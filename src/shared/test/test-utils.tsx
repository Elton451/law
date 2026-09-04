import { ConfigProvider } from 'antd';
import { render, type RenderOptions } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
import { antdTheme } from '@shared/theme/antdTheme';

const Providers = ({ children }: { children: ReactNode }) => (
  <ConfigProvider theme={antdTheme}>{children}</ConfigProvider>
);

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: Providers, ...options });

export * from '@testing-library/react';
export { customRender as render };
