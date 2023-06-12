const { fontFamily } = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    // app content
    `./src/**/*.{js,ts,jsx,tsx,md,mdx}`,
    `./pages/**/*.{js,ts,jsx,tsx,md,mdx}`,
    `./components/**/*.{js,ts,jsx,tsx}`,
    './public/**/*.html',
  ],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      screens: {
        xs: '480px',
        sm: '640px',
        md: '768px',
        lg: '992px',
        xl: '1140px',
        '2xl': '1496px',
      },
    },
    extend: {
      fontFamily: {
        serif: ['var(--font-londrina)', ...fontFamily.serif],
        sans: ['var(--font-roboto)', ...fontFamily.sans],
      },
      fontSize: {
        'size-body2': '17px',
        'size-title1': '3.125rem',
        'size-title3': '2rem',
        'size-title4': '1.375rem',
        'size-title5': '1.25rem',
        'xxs': '0.625rem',
        '13px': '0.8125rem',
      },
      lineHeight: {
        'size-body2': '26px',
        'size-body1': '1.875rem',
      },
      letterSpacing: {
        'body-text': '0.015em',
        'primary-btn': '0.125em',
      },
      colors: {
        red: {
          DEFAULT: '#EC4A4E',
          600: '#EC4A4E',
        },
        peach: {
          DEFAULT: '#E1D7D5',
          400: '#E1D7D5',
          500: '#D6C8C5',
          600: '#CFBDBA',
        },
        gray: {
          100: '#EEEEEE',
          200: '#D5D7E1',
          400: '#AEB1B4',
          900: '#212529',
        },
        olive: {
          DEFAULT: '#6C6D52',
          100: '#F7F8E4',
          200: '#E7E8D3',
          300: '#D7D9BD',
          400: '#bdbfa1',
          500: '#C3C698',
          600: '#6C6D52',
          700: '#55564A',
          800: '#3D3E32',
          900: '#2F2F26',
        },
        amber: {
          50: '#F1F2DF',
        },
        yellow: {
          DEFAULT: '#EEF57F',
          300: '#EEF57F',
          600: '#D9AD57',
        },
        orange: {
          DEFAULT: '#F59740',
          500: '#F59740',
        },
        green: {
          DEFAULT: '#3CC07B',
          500: '#3CC07B',
        }
      },
      spacing: {
        '1px': '1px',
        '2px': '0.125rem',
        22: '5.5rem',
        25: '6.25rem',
        30: '7.5rem',
        128: '32rem',
        144: '36rem',
        '6px': '0.375rem',
        '10px': '0.625rem',
        '18px': '1.125rem',
      },
      borderRadius: {
        '4xl': '2rem',
        'lx': '0.625rem',
      },
      minWidth: {
        192: '12rem',
        30: '7.5rem',
        '130px': '8.125rem',
        28: '7rem',
      },
      maxWidth: {
        'desktop': '71.25rem',
        'docs-desktop': '82rem',
        33: '8.25rem',
        125: '33.333rem',
        '130px': '8.125rem',
        133: '33.333rem',
      },
      maxHeight: {
        '139px': '8.7rem',
        30: '7.5rem',
      },
      width: {
        'desktop': '71.25rem',
        'docs-desktop': '82rem',
        13: '3.125rem',
        22: '5.5rem',
        25: '6.25rem',
        30: '7.5rem',
        50: '12.5rem',
        54: '13.5rem',
        76: '19rem',
        95: '23.75rem',
        105: '26.25rem',
        106: '26.5rem',
        116: '29rem',
        123: '30.75rem',
        '500px': '31.25rem',
        '650px': '40.625rem',
        129: '32.25rem',
        133: '33.333rem',
        '18px': '1.125rem',
        300: '75rem',
        '130px': '8.125rem',
        '150px': '9.375rem',
        152: '38rem',
        233: '58.25rem',
        '570px': '35.625rem',
      },
      height: {
        89: '22.25rem',
        129: '32.25rem',
        '218px': '13.625rem',
        152: '38rem',
      },
    },
  },
  variants: {
    fill: [],
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
