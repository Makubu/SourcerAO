import { FC, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '@app/components/Card';
import ChooseDeveloperModal from '@app/components/ChooseDeveloperModal';
import ConnectButton from '@app/components/ConnectButton';
import { BackIcon } from '@app/components/Icons';
import ProjectInfo from '@app/components/ProjectInfo';
import {
  useAcceptProject,
  useApplyProject,
  useBeacon,
  useChooseDeveloper,
  useEndProject,
  useFundProject,
  useGetProjectById,
} from '@app/hooks';
import { Project } from '@app/models';
import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Input,
  Tag,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react';

interface contractButtonProps {
  project: Project;
}

const ApplyButton: FC<contractButtonProps> = (props: contractButtonProps) => {
  const { project } = props;
  const toast = useToast();
  const applyProject = useApplyProject();
  const [isApplying, setIsApplying] = useState(false);

  const onClick = async () => {
    setIsApplying(true);
    try {
      if (project) {
        await applyProject(project?.id);
        toast({
          title: 'Applied to project!',
          status: 'success',
          position: 'bottom-right',
          isClosable: true,
        });
      }
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <Button w="100%" size="sm" onClick={onClick} isLoading={isApplying}>
      Apply
    </Button>
  );
};

const FundButton: FC<contractButtonProps> = (props: contractButtonProps) => {
  const { project } = props;
  const toast = useToast();
  const fundProject = useFundProject();
  const [isFunding, setIsFunding] = useState(false);
  const [fund, setFund] = useState(0);

  const onClick = async () => {
    setIsFunding(true);
    try {
      if (project) {
        await fundProject(project?.id, fund);
        toast({
          title: `Fund ${fund}utz to project!`,
          status: 'success',
          position: 'bottom-right',
          isClosable: true,
        });
      }
    } finally {
      setFund(0);
      setIsFunding(false);
    }
  };

  return (
    <HStack width="100%">
      <Button w="100%" size="sm" onClick={onClick} isLoading={isFunding}>
        Fund
      </Button>
      <Input
        size="sm"
        type="number"
        value={fund}
        onChange={(e) => setFund(e.target.valueAsNumber)}
      />
    </HStack>
  );
};

const ChooseDeveloperButton: FC<contractButtonProps> = (props: contractButtonProps) => {
  const { project } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const chooseDeveloper = useChooseDeveloper();

  const onChose = async (developerAddress: string) => {
    if (project) {
      await chooseDeveloper(project?.id, developerAddress);
      toast({
        title: `Choose developer ${developerAddress}!`,
        status: 'success',
        position: 'bottom-right',
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Button w="100%" size="sm" onClick={onOpen}>
        Choose developer
      </Button>
      <ChooseDeveloperModal
        isOpen={isOpen}
        onClose={onClose}
        onChose={onChose}
        project={project}
      />
    </>
  );
};

const AcceptProjectButton: FC<contractButtonProps> = (props: contractButtonProps) => {
  const { project } = props;
  const toast = useToast();
  const acceptProject = useAcceptProject();
  const [loading, setLoading] = useState(false);

  const onClick = async () => {
    setLoading(true);
    try {
      if (project) {
        await acceptProject(project?.id, project.total_bail);
        toast({
          title: 'Project accepted!',
          status: 'success',
          position: 'bottom-right',
          isClosable: true,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button w="100%" size="sm" onClick={onClick} isLoading={loading}>
      Accept project
    </Button>
  );
};

const EndProjectButton: FC<contractButtonProps> = (props: contractButtonProps) => {
  const { project } = props;
  const toast = useToast();
  const endProject = useEndProject();
  const [loading, setLoading] = useState(false);

  const onClick = async () => {
    setLoading(true);
    try {
      if (project) {
        await endProject(project?.id);
        toast({
          title: 'Project completed',
          status: 'success',
          position: 'bottom-right',
          isClosable: true,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button w="100%" size="sm" onClick={onClick} isLoading={loading}>
      End project
    </Button>
  );
};

const ProjectPage = () => {
  const { id } = useParams();
  const { state, isConnected } = useBeacon();
  const { data } = useGetProjectById(id as string);
  const navigate = useNavigate();

  const project = useMemo(() => data?.project, [data]);
  const description = useMemo(() => data?.description, [data]);

  const isCreator = useMemo(
    () => isConnected && state.userAddress == project?.creator,
    [state, project],
  );

  const isFunder = useMemo(
    () =>
      isConnected &&
      Object.keys(project?.funders || {}).includes(state.userAddress || ''),
    [state, project],
  );

  const isChosenDeveloper = useMemo(
    () =>
      isConnected &&
      state.userAddress == project?.elected_dev &&
      project?.state == 'OPEN',
    [state, project],
  );

  const isDeveloper = useMemo(
    () =>
      isConnected &&
      state.userAddress == project?.elected_dev &&
      project?.state == 'PROGRESS',
    [state, project],
  );

  const isApplicant = useMemo(
    () =>
      isConnected &&
      (project?.applications || []).includes(state.userAddress || '') &&
      project?.state == 'OPEN',
    [state, project],
  );

  return (
    <Box>
      <Button
        variant="link"
        leftIcon={<BackIcon />}
        colorScheme="blue"
        size="lg"
        onClick={() => navigate(-1)}
      >
        Go back
      </Button>

      <HStack
        width="100%"
        justifyContent="space-between"
        alignItems="center"
        marginBottom="2rem"
      >
        <Heading
          fontSize="md"
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis"
        >
          Project: {project?.id}
        </Heading>
        <HStack spacing="1rem">
          {isCreator && (
            <Badge fontSize="2xl" colorScheme="red">
              CREATOR
            </Badge>
          )}
          {isApplicant && !isChosenDeveloper && (
            <Badge fontSize="2xl" colorScheme="blue">
              APPLICANT
            </Badge>
          )}
          {isFunder && (
            <Badge fontSize="2xl" colorScheme="green">
              FUNDER
            </Badge>
          )}
          {isDeveloper && (
            <Badge fontSize="2xl" colorScheme="orange">
              DEVELOPER
            </Badge>
          )}
          {isChosenDeveloper && (
            <Badge fontSize="2xl" colorScheme="purple">
              CHOSEN DEVELOPER
            </Badge>
          )}
          <ConnectButton />
        </HStack>
      </HStack>

      <Flex flexDirection={{ base: 'column', lg: 'row' }} gap="1.5rem">
        <VStack spacing="0.5rem">
          {project && <ProjectInfo project={project} />}

          {isConnected && (
            <>
              {project?.state == 'OPEN' && <FundButton project={project} />}

              {project?.state == 'OPEN' && !isApplicant && !isCreator && (
                <ApplyButton project={project} />
              )}

              {project?.state == 'OPEN' && isCreator && (
                <ChooseDeveloperButton project={project} />
              )}

              {project?.state == 'OPEN' && isChosenDeveloper && (
                <AcceptProjectButton project={project} />
              )}

              {project?.state == 'PROGRESS' && isCreator && (
                <EndProjectButton project={project} />
              )}
            </>
          )}

          {/* We ran out of time to implement the litigation process ... */}
          {/* <Button w="100%" size="sm">
            Trigger litigation
          </Button>
          <Button w="100%" size="sm">
            Handle litigation
          </Button> */}
        </VStack>

        <Card width="100%" overflowY="auto" h="fit-content" maxH="25rem">
          <Heading fontSize="xl" marginBottom="1rem">
            {description?.title}
          </Heading>
          <Tag fontSize="xs" marginBottom="0.5rem">
            Due: {description?.due.toISOString()}
          </Tag>
          <Text as="pre" fontSize="sm">
            {description?.description}
          </Text>
        </Card>
      </Flex>
    </Box>
  );
};

export default ProjectPage;
