import { ConfigProvider } from 'antd';
import { render, type RenderOptions } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
import { MemoryRouter } from 'react-router';
import { antdTheme } from '@shared/theme/antdTheme';

type CustomRenderOptions = Omit<RenderOptions, 'wrapper'> & {
  /** Initial location for the in-memory router. */
  route?: string | { pathname: string; state?: unknown };
};

const customRender = (ui: ReactElement, { route = '/', ...options }: CustomRenderOptions = {}) => {
  const Providers = ({ children }: { children: ReactNode }) => (
    <ConfigProvider theme={antdTheme}>
      <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
    </ConfigProvider>
  );

  return render(ui, { wrapper: Providers, ...options });
};

export * from '@testing-library/react';
export { customRender as render };
