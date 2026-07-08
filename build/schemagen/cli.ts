#!/usr/bin/env node
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, isAbsolute, relative, resolve } from 'node:path';
import { glob } from 'tinyglobby';
import ts from 'typescript';
import { loadConfig } from './config.ts';
import type { NormalizedSchemagenConfig } from './config.ts';

type RouteDefinition = {
  exportName: string;
  filePath: string;
  method: string;
  path: string;
};

type GeneratedSchemagenOutput = {
  outFile: string;
  routes: RouteDefinition[];
};

const capitalize = (value: string): string => value.charAt(0).toUpperCase() + value.slice(1);

const parseArgs = (): { root: string } => {
  const args = process.argv.slice(2);
  let root = process.cwd();

  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === '--root') {
      root = resolve(args[index + 1] ?? root);
      index += 1;
    }
  }

  return { root: resolve(root) };
};

const resolveIncludeFiles = async (root: string, include: readonly string[]): Promise<string[]> =>
  glob([...include], {
    absolute: true,
    cwd: root,
    expandDirectories: false,
    onlyFiles: true,
  });

const toImportSpecifier = (fromFile: string, target: string): string => {
  if (!isAbsolute(target) && !target.startsWith('.')) {
    return target;
  }

  const relativePath = relative(dirname(fromFile), target);
  const importPath = relativePath.replaceAll('\\', '.').replace(/\.(?:c|m)?[jt]sx?$/, '');
  return importPath.startsWith('.') ? importPath : `./${importPath}`;
};

const getSourceKind = (filePath: string): ts.ScriptKind => {
  if (filePath.endsWith('.tsx')) {
    return ts.ScriptKind.TSX;
  }

  if (filePath.endsWith('.jsx')) {
    return ts.ScriptKind.JSX;
  }

  return ts.ScriptKind.TS;
};

const hasExportModifier = (node: ts.Node): boolean =>
  ts.canHaveModifiers(node) &&
  Boolean(ts.getModifiers(node)?.some(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword));

const unwrapExpression = (expression: ts.Expression): ts.Expression => {
  let current = expression;

  while (
    ts.isAsExpression(current) ||
    ts.isSatisfiesExpression(current) ||
    ts.isParenthesizedExpression(current) ||
    ts.isTypeAssertionExpression(current)
  ) {
    current = current.expression;
  }

  return current;
};

const getPropertyNameText = (name: ts.PropertyName): string | undefined => {
  if (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name)) {
    return name.text;
  }

  return undefined;
};

const getStringLiteralValue = (expression: ts.Expression): string | undefined => {
  const unwrapped = unwrapExpression(expression);

  if (ts.isStringLiteral(unwrapped) || ts.isNoSubstitutionTemplateLiteral(unwrapped)) {
    return unwrapped.text;
  }

  return undefined;
};

const getRouteCallObject = (initializer: ts.Expression): ts.ObjectLiteralExpression | undefined => {
  const expression = unwrapExpression(initializer);

  if (!ts.isCallExpression(expression) || !ts.isIdentifier(expression.expression)) {
    return undefined;
  }

  if (expression.expression.text !== 'route') {
    return undefined;
  }

  const [definition] = expression.arguments;
  const routeDefinition = definition ? unwrapExpression(definition) : undefined;
  return routeDefinition && ts.isObjectLiteralExpression(routeDefinition)
    ? routeDefinition
    : undefined;
};

const getStringProperty = (
  object: ts.ObjectLiteralExpression,
  propertyName: string,
): string | undefined => {
  for (const property of object.properties) {
    if (!ts.isPropertyAssignment(property)) {
      continue;
    }

    if (getPropertyNameText(property.name) !== propertyName) {
      continue;
    }

    return getStringLiteralValue(property.initializer);
  }

  return undefined;
};

const collectRoutesFromFile = async (filePath: string): Promise<RouteDefinition[]> => {
  const sourceText = await readFile(filePath, 'utf8');
  const sourceFile = ts.createSourceFile(
    filePath,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    getSourceKind(filePath),
  );
  const routes: RouteDefinition[] = [];

  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement) || !hasExportModifier(statement)) {
      continue;
    }

    for (const declaration of statement.declarationList.declarations) {
      if (!ts.isIdentifier(declaration.name) || !declaration.initializer) {
        continue;
      }

      const routeObject = getRouteCallObject(declaration.initializer);
      if (!routeObject) {
        continue;
      }

      const method = getStringProperty(routeObject, 'method');
      const path = getStringProperty(routeObject, 'path');
      if (!method || !path) {
        continue;
      }

      routes.push({
        exportName: declaration.name.text,
        filePath,
        method: method.toLowerCase(),
        path,
      });
    }
  }

  return routes;
};

const collectRoutes = async (
  root: string,
  config: NormalizedSchemagenConfig,
): Promise<RouteDefinition[]> => {
  const files = (await resolveIncludeFiles(root, config.include)).sort();
  const routes = await Promise.all(files.map(file => collectRoutesFromFile(file)));

  return routes.flat();
};

const renderGeneratedSchemagen = (
  config: NormalizedSchemagenConfig,
  routes: RouteDefinition[],
): string => {
  const usedHelpers = new Set(routes.map(route => (route.method === 'get' ? 'query' : 'mutate')));
  const importsByFile = new Map<string, string[]>();
  const generatedNames = new Map<string, RouteDefinition>();
  const lines = ['// This file is generated by schemagen. Do not edit manually.'];

  for (const route of routes) {
    const helper = route.method === 'get' ? 'query' : 'mutate';
    const generatedName = `${helper}${capitalize(route.exportName)}`;
    const duplicate = generatedNames.get(generatedName);

    if (duplicate) {
      throw new Error(
        `Duplicate generated export "${generatedName}" for ${duplicate.filePath} and ${route.filePath}.`,
      );
    }

    generatedNames.set(generatedName, route);

    const imports = importsByFile.get(route.filePath) ?? [];
    imports.push(route.exportName);
    importsByFile.set(route.filePath, imports);
  }

  if (usedHelpers.size > 0) {
    lines.push(
      `import { ${[...usedHelpers].sort().join(', ')} } from '${toImportSpecifier(
        config.outFile,
        config.queryModule,
      )}';`,
    );
  }

  for (const [filePath, imports] of [...importsByFile].sort(([left], [right]) =>
    left.localeCompare(right),
  )) {
    lines.push(
      `import type { ${imports.sort().join(', ')} } from '${toImportSpecifier(
        config.outFile,
        filePath,
      )}';`,
    );
  }

  if (routes.length > 0) {
    lines.push('');
  }

  for (const route of routes) {
    const helper = route.method === 'get' ? 'query' : 'mutate';
    const generatedName = `${helper}${capitalize(route.exportName)}`;
    lines.push(
      `export const ${generatedName} = ${helper}<typeof ${route.exportName}>('${route.method}', '${route.path}');`,
    );
  }

  return `${lines.join('\n')}\n`;
};

const generateSchemagen = async ({
  root,
  config,
}: {
  root: string;
  config: NormalizedSchemagenConfig;
}): Promise<GeneratedSchemagenOutput> => {
  const routes = await collectRoutes(root, config);
  const contents = renderGeneratedSchemagen(config, routes);

  await mkdir(dirname(config.outFile), { recursive: true });
  await writeFile(config.outFile, contents);

  return {
    outFile: config.outFile,
    routes,
  };
};

const main = async (): Promise<void> => {
  const { root } = parseArgs();
  const { config } = await loadConfig(root);
  const generated = await generateSchemagen({ root, config });

  process.stdout.write(
    `Generated ${generated.routes.length} schemagen routes in ${generated.outFile}\n`,
  );
};

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
