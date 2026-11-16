import { theme, type ThemeConfig } from 'antd';
import { colors, radii, spacing, typography } from './tokens';

export const antdTheme: ThemeConfig = {
  algorithm: theme.defaultAlgorithm,
  token: {
    // Selection, focus and links are ametista; dourado is reserved for the
    // primary buttons (highlighted actions), set in `components.Button`.
    colorPrimary: colors.accent,

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
    colorLinkActive: colors.accentSoft,

    colorTextLightSolid: colors.textOnAccent,

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
      colorPrimaryHover: colors.primaryHover,
      colorPrimaryActive: colors.primaryActive,
      primaryColor: colors.textOnPrimary,
      algorithm: true,
      borderRadius: radii.pill,
      fontWeight: 600,
      primaryShadow: 'none',
    },
    Layout: {
      headerBg: colors.bgBase,
      bodyBg: colors.bgLayout,
      siderBg: colors.bgBase,
      triggerBg: colors.surface,
      triggerColor: colors.textPrimary,
    },
    Menu: {
      itemColor: colors.textSecondary,
      itemHoverColor: colors.textPrimary,
      itemSelectedColor: colors.textPrimary,
      itemSelectedBg: colors.surface,
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
