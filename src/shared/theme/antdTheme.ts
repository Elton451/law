import { theme, type ThemeConfig } from 'antd';
import { colors, radii, spacing, typography } from './tokens';

export const antdTheme: ThemeConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: colors.primary,

    colorSuccess: colors.success,
    colorWarning: colors.warning,
    colorError: colors.error,
    colorInfo: colors.info,

    colorBgBase: colors.bgBase,
    colorBgContainer: colors.bgContainer,
    colorBgElevated: colors.bgElevated,
    colorBgLayout: colors.bgLayout,

    colorText: colors.textPrimary,
    colorTextSecondary: colors.textSecondary,
    colorTextTertiary: colors.textTertiary,
    colorTextQuaternary: colors.textQuaternary,

    colorBorder: colors.border,
    colorBorderSecondary: colors.borderSecondary,

    colorLink: colors.accent,
    colorLinkHover: colors.accentSoft,
    colorLinkActive: colors.accent,

    fontFamily: typography.fontFamily,
    fontFamilyCode: typography.fontFamilyCode,
    fontSize: typography.fontSize,

    borderRadius: radii.md,
    borderRadiusLG: radii.lg,
    borderRadiusSM: radii.sm,

    padding: spacing.base,
    paddingLG: spacing.lg,
    margin: spacing.base,
  },

  components: {
    Button: {
      colorPrimary: colors.primary,
      algorithm: true,
      borderRadius: radii.pill,
      fontWeight: 600,
      primaryShadow: 'none',
    },
    Layout: {
      headerBg: colors.bgBase,
      bodyBg: colors.bgLayout,
      siderBg: colors.bgBase,
    },
    Menu: {
      itemColor: colors.textSecondary,
      itemHoverColor: colors.textPrimary,
      itemSelectedColor: colors.primary,
      itemBg: 'transparent',
      horizontalItemSelectedBg: 'transparent',
    },
    Card: {
      colorBgContainer: colors.bgContainer,
      borderRadiusLG: radii.lg + 4,
    },
    Input: {
      colorBgContainer: colors.bgContainer,
      colorBorder: colors.border,
      borderRadius: radii.md,
    },
    Typography: {
      colorText: colors.textPrimary,
      colorTextSecondary: colors.textSecondary,
    },
  },
};

export default antdTheme;
