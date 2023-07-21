import { IconButton, useColorMode } from '@chakra-ui/react';

import { MoonIcon, SunIcon } from './Icons';

const ThemeToggler = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <IconButton
      aria-label="theme toggler"
      onClick={toggleColorMode}
      icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
    />
  );
};

export default ThemeToggler;
