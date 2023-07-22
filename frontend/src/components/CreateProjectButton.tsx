import { Button, useDisclosure } from '@chakra-ui/react';
import { useAccount } from 'wagmi';

import CreateProjectModal from './CreateProjectModal';
import { CreateIcon } from './Icons';

const CreateProjectButton = () => {
  const { isConnected } = useAccount();
  const { onOpen, isOpen, onClose } = useDisclosure();

  return (
    <>
      <Button
        leftIcon={<CreateIcon />}
        variant="solid"
        colorScheme="cyan"
        boxShadow="md"
        onClick={onOpen}
        isDisabled={!isConnected}
      >
        Create project
      </Button>
      <CreateProjectModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default CreateProjectButton;
