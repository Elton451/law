import type { ThemeConfig } from "antd";

const theme: ThemeConfig = {
  token: {
    // Cor primária (destaque dourado, usado em CTAs e links)
    colorPrimary: "#C9A64A",

    // Cores de sucesso, alerta e erro (padrão neutro, sem vínculo com a marca)
    colorSuccess: "#4C9A6A",
    colorWarning: "#C98A3E",
    colorError: "#C9524A",
    colorInfo: "#6B7280",

    // Fundo geral — cinza escuro neutro em vez de roxo profundo
    colorBgBase: "#1C1C1F",
    colorBgContainer: "#242428",
    colorBgElevated: "#2C2C31",
    colorBgLayout: "#18181B",

    // Texto — branco levemente suavizado, cinzas neutros para textos secundários
    colorTextBase: "#EDEDED",
    colorText: "#EDEDED",
    colorTextSecondary: "#A1A1AA",
    colorTextTertiary: "#71717A",
    colorTextQuaternary: "#52525B",

    // Bordas
    colorBorder: "#3A3A40",
    colorBorderSecondary: "#2E2E33",

    // Tipografia (o site usa uma serif nos títulos e sans no corpo)
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontFamilyCode: "'Fira Code', monospace",
    fontSize: 14,

    // Cantos arredondados (botões em pill no design original)
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 6,

    // Espaçamento
    padding: 16,
    paddingLG: 24,
    margin: 16,
  },

  components: {
    Button: {
      colorPrimary: "#C9A64A",
      algorithm: true,
      borderRadius: 999, // botões em formato pill, como "Começar" e "Saiba Mais"
      fontWeight: 600,
      primaryShadow: "none",
    },
    Layout: {
      headerBg: "#1C1C1F",
      bodyBg: "#18181B",
      siderBg: "#1C1C1F",
    },
    Menu: {
      itemColor: "#A1A1AA",
      itemHoverColor: "#EDEDED",
      itemSelectedColor: "#C9A64A",
      itemBg: "transparent",
      horizontalItemSelectedBg: "transparent",
    },
    Card: {
      colorBgContainer: "#242428",
      borderRadiusLG: 16,
    },
    Input: {
      colorBgContainer: "#242428",
      colorBorder: "#3A3A40",
      borderRadius: 8,
    },
    Typography: {
      colorText: "#EDEDED",
      colorTextSecondary: "#A1A1AA",
    },
  },
};

export default theme;
