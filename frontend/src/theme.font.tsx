import { Global } from '@emotion/react';

const Fonts = () => (
  <Global
    styles={`
      /* DM mono */
      @font-face {
        font-family: 'DMMono';
        src: url('/fonts/DMMono-Regular.ttf') format('truetype');
        font-style: normal;
        font-weight: 400;
        font-display: swap;
      }
      @font-face {
        font-family: 'DMMono';
        src: url('/fonts/DMMono-Medium.ttf') format('truetype');
        font-style: normal;
        font-weight: 600;
        font-display: swap;
      }
      @font-face {
        font-family: 'DMMono';
        src: url('/fonts/DMMono-Light.ttf') format('truetype');
        font-style: normal;
        font-weight: 200;
        font-display: swap;
      }
      `}
  />
);

export default Fonts;
