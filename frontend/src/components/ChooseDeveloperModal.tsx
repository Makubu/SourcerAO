import { FC, useMemo, useState } from 'react';
import { useGetDevelopers } from '@app/hooks';
import { Project, ProjectState } from '@app/models';
import {
  Badge,
  Box,
  Button,
  Divider,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Tag,
  Text,
  VStack,
} from '@chakra-ui/react';

interface props {
  project: Project;
  onChose: (developAddress: string) => Promise<void>;
  isOpen: boolean;
  onClose: () => void;
}

const ChooseDeveloperModal: FC<props> = (props: props) => {
  const { isOpen, onClose, onChose, project } = props;
  const [loading, setLoading] = useState(false);
  const { data: developers } = useGetDevelopers(project.applications);

  const applicants = useMemo(() => {
    return developers?.filter(({ dev_addr }) => {
      return project.applications.includes(dev_addr);
    });
  }, [developers, project]);

  const onClick = async (developerAddress: string) => {
    setLoading(true);
    try {
      await onChose(developerAddress);
      setLoading(false);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" closeOnOverlayClick={!loading}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Choose Developer</ModalHeader>
        <ModalCloseButton />
        <ModalBody overflowY="auto" padding="2rem">
          <VStack spacing="1rem" divider={<Divider />}>
            {applicants?.map((dev) => (
              <Box key={dev.dev_addr} width="100%">
                <HStack width="100%">
                  <VStack alignItems="flex-start">
                    <Text fontSize="xs">Link: {dev.cv_uri}</Text>
                    <Tag>{dev.dev_addr}</Tag>
                  </VStack>
                  <HStack width="100%" justifyContent="flex-end">
                    <Badge colorScheme="blue" fontSize="lg">
                      {dev.reputation} rep
                    </Badge>
                    <Button
                      variant="outline"
                      colorScheme="purple"
                      size="sm"
                      isDisabled={loading || project.state != ProjectState.VOTE_PHASE}
                      onClick={async () => await onClick(dev.dev_addr)}
                    >
                      Choose
                    </Button>
                  </HStack>
                </HStack>
              </Box>
            ))}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ChooseDeveloperModal;
