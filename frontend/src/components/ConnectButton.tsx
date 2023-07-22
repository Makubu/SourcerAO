import { FC } from 'react';
import { Button, HStack, Tag } from '@chakra-ui/react';

import { useConnect } from '../hooks';

const ConnectButton: FC = () => {
  const { connect, isConnected, account } = useConnect();

  if (isConnected) {
    return (
      <HStack alignItems="flex-end" spacing={1}>
        <Tag fontSize="sm" fontWeight="semibold" colorScheme="purple" variant="subtle">
          {account?.slice(0, 6) +
            '...' +
            account?.slice(account.length - 5, account.length)}
        </Tag>
      </HStack>
    );
  }

  return (
    <Button variant="solid" colorScheme="blue" boxShadow="md" size="sm" onClick={connect}>
      Metamask
    </Button>
  );
};

export default ConnectButton;
