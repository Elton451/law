import { ConfigProvider } from 'antd';
import Home from '@modules/home';
import { antdTheme } from '@shared/theme/antdTheme';
import { GlobalStyle } from '@shared/theme/GlobalStyle';

function App() {
  return (
    <ConfigProvider theme={antdTheme}>
      <GlobalStyle />
      <Home />
    </ConfigProvider>
  );
}

export default App;
