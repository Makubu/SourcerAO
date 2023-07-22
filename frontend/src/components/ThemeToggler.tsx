import { FC } from 'react';
import { IconButton, useColorMode } from '@chakra-ui/react';

import { MoonIcon, SunIcon } from './Icons';

const ThemeToggler: FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <IconButton
      margin="1rem"
      position="absolute"
      top={0}
      right={0}
      aria-label="theme toggler"
      onClick={toggleColorMode}
      icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
    />
  );
};

export default ThemeToggler;
