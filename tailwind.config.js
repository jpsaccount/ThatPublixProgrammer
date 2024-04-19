const plugin = require("tailwindcss/plugin");
const {nextui} = require("@nextui-org/react");

const colorsTheme = {colors: {
  text: {
    50: "var(--text-50)",
    100: "var(--text-100)",
    200: "var(--text-200)",
    300: "var(--text-300)",
    400: "var(--text-400)",
    500: "var(--text-500)",
    600: "var(--text-600)",
    700: "var(--text-700)",
    800: "var(--text-800)",
    900: "var(--text-900)",
    950: "var(--text-950)",
  },
  background: {
    50: "var(--background-50)",
    100: "var(--background-100)",
    200: "var(--background-200)",
    300: "var(--background-300)",
    400: "var(--background-400)",
    500: "var(--background-500)",
    600: "var(--background-600)",
    700: "var(--background-700)",
    800: "var(--background-800)",
    900: "var(--background-900)",
    950: "var(--background-950)",
  },
  "background-t": {
    50: "var(--background-t-50)",
    100: "var(--background-t-100)",
    200: "var(--background-t-200)",
    300: "var(--background-t-300)",
    400: "var(--background-t-400)",
    500: "var(--background-t-500)",
    600: "var(--background-t-600)",
    700: "var(--background-t-700)",
    800: "var(--background-t-800)",
    900: "var(--background-t-900)",
    950: "var(--background-t-950)",
  },
  primary: {
    50: "var(--primary-50)",
    100: "var(--primary-100)",
    200: "var(--primary-200)",
    300: "var(--primary-300)",
    400: "var(--primary-400)",
    500: "var(--primary-500)",
    600: "var(--primary-600)",
    700: "var(--primary-700)",
    800: "var(--primary-800)",
    900: "var(--primary-900)",
    950: "var(--primary-950)",
  },
  secondary: {
    50: "var(--secondary-50)",
    100: "var(--secondary-100)",
    200: "var(--secondary-200)",
    300: "var(--secondary-300)",
    400: "var(--secondary-400)",
    500: "var(--secondary-500)",
    600: "var(--secondary-600)",
    700: "var(--secondary-700)",
    800: "var(--secondary-800)",
    900: "var(--secondary-900)",
    950: "var(--secondary-950)",
  },
  accent: {
    50: "var(--accent-50)",
    100: "var(--accent-100)",
    200: "var(--accent-200)",
    300: "var(--accent-300)",
    400: "var(--accent-400)",
    500: "var(--accent-500)",
    600: "var(--accent-600)",
    700: "var(--accent-700)",
    800: "var(--accent-800)",
    900: "var(--accent-900)",
    950: "var(--accent-950)",
  },
  'primary': 'var(--primary-500)',

}};

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx,html}", "node_modules/flowbite-react/lib/esm/**/*.js",
  "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",

],
  theme: {
    extend: {
      delay: {
        1:"1ms"
      },
      ...colorsTheme,
   
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("flowbite/plugin"),
    nextui(),
    plugin(function ({ addUtilities, matchUtilities, theme }) {
      matchUtilities(
        {
          "translate-z": (value) => ({
            "--tw-translate-z": value,
            "-webkit-transform": ` translate3d(var(--tw-translate-x), var(--tw-translate-y), var(--tw-translate-z)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))`,
            transform: ` translate3d(var(--tw-translate-x), var(--tw-translate-y), var(--tw-translate-z)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))`,
          }),
        },
        { values: theme("translate"), supportsNegativeValues: true },
      );

      const newUtilities = {
        '.delay-1': {
          transitionDelay: '1ms',
        },
      }
      addUtilities(newUtilities)
    }),
  ],
};
