import { Box, BoxProps, ThemingProps, useStyleConfig } from '@chakra-ui/react';

type props = ThemingProps & BoxProps;

function Card(props: props) {
  const { variant, ...rest } = props;

  const styles = useStyleConfig('Card', { variant });

  // Pass the computed styles into the `__css` prop
  return <Box __css={styles} {...rest} />;
}

export default Card;
