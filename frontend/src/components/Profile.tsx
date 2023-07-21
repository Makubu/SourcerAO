import { useEffect } from 'react';
import {
  Avatar,
  Button,
  HStack,
  Spinner,
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
      <Card width="fit-content" padding="1rem">
        <HStack>
          <Avatar size="sm" />
          <VStack alignItems="flex-start" spacing={0}>
            <Text fontSize="sm" fontWeight="bold" color="teal">
              {connector?.name}
            </Text>
            <Text fontSize="sm" fontWeight="semibold">
              {address?.slice(0, 5) +
                '...' +
                address?.slice(address.length - 4, address.length)}
            </Text>
          </VStack>
        </HStack>
        <Button onClick={() => disconnect()} width="100%" size="xs">
          Disconnect
        </Button>
      </Card>
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
