import { ComponentStyleConfig, extendTheme, ThemeConfig } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const CardStyle: ComponentStyleConfig = {
  baseStyle: (props) => ({
    padding: '1.2rem',
    borderRadius: 'md',
    boxShadow: mode('md', '0 -2px 10px rgba(0, 0, 0, 0.6)')(props),
    backgroundColor: mode('white', 'gray.700')(props),
  }),
  sizes: {},
  variants: {},
  defaultProps: {},
};

const theme = extendTheme({
  styles: {
    global: (props: any) => ({
      html: {
        height: '100%',
      },
      body: {
        height: '100%',
        backgroundColor: mode('rgb(248,248,250)', 'gray.800')(props),
      },
    }),
  },
  fonts: {
    heading: `DMMono`,
    body: `DMMono`,
  },
  components: {
    Card: CardStyle,
  },
  config,
});

export default theme;
