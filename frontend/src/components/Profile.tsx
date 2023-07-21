import { useEffect } from 'react';
import {
  Avatar,
  Button,
  HStack,
  Spinner,
  Tag,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

import Card from './Card';

export function Profile() {
  const { connect, connectors, error, isLoading, pendingConnector } = useConnect();
  const { address, connector, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const toast = useToast();

  useEffect(() => {
    if (error) {
      toast({
        description: error.message,
        status: 'error',
        variant: 'solid',
        position: 'top-right',
        isClosable: true,
        duration: 2000,
      });
    }
  }, [error]);

  if (isConnected) {
    return (
      <HStack alignItems="flex-end" spacing={1}>
        <Tag fontSize="sm" fontWeight="semibold" colorScheme="purple" variant="subtle">
          {connector?.name}:{' '}
          {address?.slice(0, 5) +
            '...' +
            address?.slice(address.length - 4, address.length)}
        </Tag>
        <Button onClick={() => disconnect()} size="xs" boxShadow="sm" variant="outline">
          Disconnect
        </Button>
      </HStack>
    );
  }

  return (
    <>
      {connectors.map((connector) => (
        <Button
          isDisabled={!connector.ready}
          key={connector.id}
          onClick={() => connect({ connector })}
          variant="solid"
          colorScheme="blue"
          boxShadow="md"
        >
          {connector.name}
          {!connector.ready && ' (unsupported)'}
          {isLoading && connector.id === pendingConnector?.id && (
            <Spinner ml="1rem" size="sm" speed="0.5s" />
          )}
        </Button>
      ))}
    </>
  );
}
