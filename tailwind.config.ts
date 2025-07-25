/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primaryColor: '#3662FF',
        xerror1: '#FF8D69',
        xerror2: '#ff4d4f',
        xcolor1: '#1C1B1F',
        xcolor2: '#E9EEFF',
        xcolor3: '#F6F8FF',
        xcolor4: '#DFE6EC',
        xcolor5: '#D1D5D8',
        xcolor6: '#737C9B',
        xcolor7: '#8A8A8A',
        xcolor8: '#C5C5C5',
        xcolor9: '#EFF0F3',
        xcolor10: '#B8b8b8',
        xcolor11: '#FFB865',
        xcolor12: '#DA527B',
        xcolor13: '#FFB4A9',
        xcolor14: '#AE92FF',
        xcolor15: '#BD4141',
        xcolor16: '#FFEACB',
        xcolor17: '#BD9341',
        xcolor18: '#FFCBCB',
        xcolor19: '#1890FF',
        xcolor20: '#CCD7FD',
        xcolor21: '#F6F6F6',
        xcolor22: '#06C93D',
      },
      spacing: {
        layoutHeader: '68px',
        layoutSidebar: '81px',
        mediaPreviewHeight: 400,
      },
      borderRadius: {
        10: '10px',
      },
    },
    fontFamily: {
      YBAKH: ['YBAKH'],
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
