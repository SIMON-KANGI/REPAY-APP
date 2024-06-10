
import { extendTheme } from "@chakra-ui/react";
const appTheme = extendTheme({
  colors: {
    stone: {
      50: '#fafaf9',
      100: '#f5f5f4',
      200: '#e7e5e4',
      300: '#d6d3d1',
      400: '#a8a29e',
      500: '#78716c',
      600: '#57534e',
      700: '#44403c',
      800: '#292524',
      900: '#1c1917',
      950:'#1c1817',
    },
    rose: {
        50: '#fff1f2',
        100: '#ffe4e6',
        200: '#fecdd3',
        300: '#fda4af',
        400: '#fb7185',
        500: '#f43f5e',
        600: '#e11d48',
        700: '#be123c',
        800: '#9f1239',
        900: '#881337',
      },
  },
  fonts: {
    heading: `'Inter', sans-serif`,
    body: `'Raleway', sans-serif`,
  },
  styles: {
    global: {
      body: {
        // Set a default background color
        color: "stone.900",
        fontFamily: 'Raleway, sans-serif', // Set a defa
      },
    },
  },
});

export default appTheme;