import { Profile } from '@app/components/Profile';
import { Container } from '@chakra-ui/react';

export default function Index() {
  return (
    <Container
      padding="2rem"
      paddingTop="1rem"
      width="100%"
      height="100%"
      maxW="none"
      margin="0"
      maxH="none"
    >
      <Profile />
    </Container>
  );
}
