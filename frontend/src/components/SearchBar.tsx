import { FC } from 'react';
import {
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from '@chakra-ui/react';

import Card from './Card';
import { CloseIcon, SearchIcon } from './Icons';

interface searchProps {
  search: string;
  setSearch: (s: string) => void;
}

const SearchBar: FC<searchProps> = (props: searchProps) => {
  const { search, setSearch } = props;
  return (
    <Card width="100%">
      <InputGroup width="100%">
        <InputLeftElement pointerEvents="none" paddingLeft=".4rem">
          <SearchIcon boxSize="1.2rem" color="gray.400" />
        </InputLeftElement>
        <Input
          placeholder="search project..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <InputRightElement
          hidden={search === ''}
          onClick={() => setSearch('')}
          cursor="pointer"
        >
          <IconButton aria-label="close" icon={<CloseIcon />} size="xs" />
        </InputRightElement>
      </InputGroup>
    </Card>
  );
};

export default SearchBar;
