import { IconType } from 'react-icons';
import { FaMoon, FaPlus, FaSun } from 'react-icons/fa';
import { HiOutlineArrowNarrowLeft } from 'react-icons/hi';
import { MdClose, MdSearch } from 'react-icons/md';
import { SiIpfs } from 'react-icons/si';
import { Icon, IconProps, useStyleConfig } from '@chakra-ui/react';

const iconFactory = (icon: IconType) => {
  const IconFactory = (props: IconProps) => {
    const styles = useStyleConfig('Icon');
    return <Icon __css={styles} as={icon} {...props} />;
  };
  return IconFactory;
};

export const SunIcon = iconFactory(FaSun);
export const MoonIcon = iconFactory(FaMoon);
export const IPFSIcon = iconFactory(SiIpfs);
export const CreateIcon = iconFactory(FaPlus);
export const CloseIcon = iconFactory(MdClose);
export const SearchIcon = iconFactory(MdSearch);
export const BackIcon = iconFactory(HiOutlineArrowNarrowLeft);
