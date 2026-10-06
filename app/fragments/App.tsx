import { AssetsProvider } from '@/assets';
import { globalStyle } from '@/styles';
import { StrictMode, type PropsWithChildren } from 'react';
import { Page } from './Page';
import { I18nProvider } from './_providers/I18nProvider';
import { QueryProvider } from './_providers/QueryProvider';

export const AppFrame = ({ children }: PropsWithChildren) => (
  <StrictMode>
    <AssetsProvider>
      <QueryProvider>
        <I18nProvider>
          <main className={globalStyle}>{children}</main>
        </I18nProvider>
      </QueryProvider>
    </AssetsProvider>
  </StrictMode>
);

export const App = () => (
  <AppFrame>
    <Page />
  </AppFrame>
);
