import { useState } from 'react';
import { Profile } from '@app/components/Profile';
import SearchBar from '@app/components/SearchBar';
import ThemeToggler from '@app/components/ThemeToggler';
import { Container, HStack, Stack, Text, VStack } from '@chakra-ui/react';

export default function Index() {
  const [search, setSearch] = useState('');
  const projects = [];

  return (
    <Container minWidth="80%" maxHeight="100vh">
      <ThemeToggler />

      <VStack alignItems="flex-start" spacing="1rem" marginBottom="1rem">
        <Stack
          justifyContent="space-between"
          width="100%"
          alignItems="flex-end"
          direction={{ base: 'column', lg: 'row' }}
        >
          <HStack spacing="1rem" width="100%">
            {/* <CreateProjectButton /> */}
            <Text>Projects: {projects?.length}</Text>
          </HStack>
          <VStack alignItems="flex-end" width="100%">
            {/* <UserInfo /> */}
            <HStack spacing="1rem">
              <Profile />
            </HStack>
          </VStack>
        </Stack>
        <SearchBar search={search} setSearch={setSearch} />
      </VStack>
    </Container>
  );
}
