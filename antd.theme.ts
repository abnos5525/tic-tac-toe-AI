// https://github.com/ant-design/ant-design/blob/4.24.8/components/style/themes/variable.less

import { type ThemeConfig } from 'antd';

import tailwindConfig from './tailwind.config.ts';

interface CustomThemeType {
  primaryColor: string;

  xerror1: string;
  xerror2: string;

  xcolor1: string;
  xcolor2: string;
  xcolor3: string;
  xcolor4: string;
  xcolor5: string;
  xcolor6: string;
  xcolor7: string;
  xcolor8: string;
  xcolor9: string;
  xcolor10: string;
  xcolor15: string;
  xcolor16: string;
  xcolor17: string;
  xcolor18: string;
}

const tailwindTheme = (tailwindConfig?.theme?.extend?.colors || {}) as unknown as CustomThemeType;

const customTheme: ThemeConfig = {
  token: {
    colorText: tailwindTheme.xcolor1,
    colorTextPlaceholder: tailwindTheme.xcolor7,
    colorTextTertiary: tailwindTheme.xcolor7,
    colorTextLabel: tailwindTheme.xcolor7,
    colorTextDescription: tailwindTheme.xcolor7,

    colorIcon: tailwindTheme.primaryColor,

    // colorTextQuaternary is usaully used as icon color even though there's a 'colorIcon'
    colorTextQuaternary: tailwindTheme.primaryColor,
    colorTextSecondary: tailwindTheme.primaryColor,

    colorTextHeading: tailwindTheme.xcolor1,

    colorTextDisabled: tailwindTheme.xcolor10,

    borderRadius: 6,
    fontFamily: `YBAKH, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
    'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
    'Noto Color Emoji'`,

    colorPrimary: tailwindTheme.primaryColor,
    colorPrimaryHover: tailwindTheme.primaryColor,

    colorBorderSecondary: tailwindTheme.xcolor2,

    colorBorder: tailwindTheme.xcolor9,
  }
};

export default customTheme;
