import { FC, useMemo, useState } from 'react';
import { useCreateProject } from '@app/hooks';
import { ProjectDescription } from '@app/models';
import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useToast,
} from '@chakra-ui/react';

interface props {
  isOpen: boolean;
  onClose: () => void;
}

const CreateProjectModal: FC<props> = (props: props) => {
  const { isOpen, onClose } = props;
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState(0);
  const toast = useToast();
  const createProject = useCreateProject();

  const isValid = useMemo(() => title.trim() && description.trim(), [title, description]);

  const onCreate = async () => {
    setLoading(true);
    try {
      const projectDescription: ProjectDescription = {
        title: title,
        description: description,
        due: new Date(),
      };
      await createProject(projectDescription, amount);
      setLoading(false);
      onClose();
      toast({
        title: 'Project created',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'bottom-right',
        size: 'md',
      });
    } finally {
      setDescription('');
      setTitle('');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" closeOnOverlayClick={!loading}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>New Project</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <HStack marginBottom="1rem">
            <FormControl isRequired={true}>
              <FormLabel>Title</FormLabel>
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </FormControl>
            <FormControl marginBottom="1rem">
              <FormLabel>Amount (uꜩ)</FormLabel>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.valueAsNumber)}
              />
            </FormControl>
          </HStack>

          <FormControl isRequired={true}>
            <FormLabel>Description</FormLabel>
            <Textarea
              resize="none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" mr={3} onClick={onClose} isDisabled={loading}>
            Close
          </Button>
          <Button
            colorScheme="cyan"
            onClick={onCreate}
            isLoading={loading}
            isDisabled={!isValid}
          >
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateProjectModal;
