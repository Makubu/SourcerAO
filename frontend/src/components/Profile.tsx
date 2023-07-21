import { useEffect } from 'react';
import {
  Avatar,
  Box,
  Button,
  HStack,
  Spinner,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

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
      <Box
        boxShadow="md"
        borderWidth="sm"
        borderRadius="md"
        padding="1rem"
        width="fit-content"
      >
        <HStack>
          <Avatar size="sm" />
          <VStack alignItems="flex-start" spacing={0}>
            <Text fontSize="xs" fontWeight="semibold" color="teal">
              {connector?.name}
            </Text>
            <Text fontSize="sm" fontWeight="semibold">
              {address?.slice(0, 5) +
                '...' +
                address?.slice(address.length - 4, address.length)}
            </Text>
          </VStack>
        </HStack>
      </Box>
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
