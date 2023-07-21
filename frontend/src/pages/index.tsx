import { Profile } from '@app/components/Profile';
import { Container } from '@chakra-ui/react';

export default function Index() {
  return (
    <Container minWidth="80%" maxHeight="100vh">
      <Profile />
    </Container>
  );
}
