import { useNavigate, useParams } from 'react-router-dom';
import { BackIcon } from '@app/components/Icons';
import { Box, Button, Heading } from '@chakra-ui/react';

export default function Project() {
  const { projectId } = useParams();
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
      <Heading size="md">Project {projectId}</Heading>
    </Box>
  );
}
