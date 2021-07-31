import yaml from 'js-yaml';

import { anyChar, digit, letter, string } from 'parjs';
import { between, later, many, manyBetween, manyTill, map, or, qthen, thenPick } from 'parjs/combinators';
import type { Parjser } from 'parjs';

const atom = later<Atom>();

type StringInterpolation = { name: 'StringInterpolation', content: string };
const interpolation: Parjser<StringInterpolation> =
	anyChar().pipe(
		manyBetween(string('{'), string('}')),
		map(result => ({ name: 'StringInterpolation', content: result.join('') }))
	);

const escape: Parjser<string> =
	string('\\').pipe(
		qthen(
			string('\\').pipe(
				or(string('{')),
				or(string('<')),
			)
		)
	);

const tagName: Parjser<string> =
	letter().pipe(
		or(digit())
	);

type Tag = { name: 'Tag', tagName: string, content: Atom[] };
const tag: Parjser<Tag> =
	tagName.pipe(
		manyBetween('<', '>'),
		map(result => result.join(''))
	).pipe(
		thenPick((content) => {
			const tagClose = string(content)
				.pipe(
					between('</', '>')
				);

			return atom.pipe(
				manyTill(tagClose),
				map(result => ({ name: 'Tag', tagName: content, content: result }))
			);
		})
	);

type Atom = string | StringInterpolation | Tag;
atom.init(
	escape.pipe(
		or(tag),
		or(interpolation),
		or(anyChar())
	)
);

const program: Parjser<Atom[]> =
	atom.pipe(
		many()
	);

type I18n = { [ Key in string ]: string | I18n };
type ParsedI18n = { [ Key in string ]: Atom[] | ParsedI18n };

const parseAllI18n = (i18nData: I18n): ParsedI18n =>
	Object.keys(i18nData).reduce<ParsedI18n>((result, key) => {
		const value = i18nData[key];
		if (typeof value === 'string') {
			const parseResult = program.parse(value);
			if (parseResult.isOk) {
				return { ...result, [ key ]: parseResult.value };
			}
		}

		return result;
	}, {});

const viteI18n = () => ({
	name: 'vite-i18n',

	transform(src: string, id: string) {
		if (!id.endsWith('.i18n.yml')) {
			return;
		}

		const i18nData = yaml.load(src) as I18n;
		const parsedI18nData = parseAllI18n(i18nData);

		return (
			`const i18n = ${JSON.stringify(parsedI18nData)};` +
			`export default i18n`
		);
	}
});

export default viteI18n;
