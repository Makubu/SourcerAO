import { useNavigate, useParams } from 'react-router-dom';
import { BackIcon } from '@app/components/Icons';
import { Box, Button, Heading } from '@chakra-ui/react';

export default function User() {
  const { userId } = useParams();
  const navigate = useNavigate();

  return (
    <Box>
      <Button
        variant="link"
        leftIcon={<BackIcon />}
        colorScheme="blue"
        size="md"
        onClick={() => navigate('/')}
      >
        Go back
      </Button>
      <Heading size="md">User {userId}</Heading>
    </Box>
  );
}
