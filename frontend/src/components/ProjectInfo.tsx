import { FC } from 'react';
import { Project, ProjectState } from '@app/models';
import { Divider, Heading, HStack, Tag, Text } from '@chakra-ui/react';

import Card from './Card';
import ProjectBadge from './ProjectBadge';

interface projectInfoProps {
  project: Project;
}

const ProjectInfo: FC<projectInfoProps> = (props: projectInfoProps) => {
  const { project } = props;

  return (
    <Card minW={{ base: '100%', lg: '25rem' }} height="fit-content">
      <Heading fontSize="lg">Project details</Heading>

      <Divider marginY="0.8rem" />

      <HStack justifyContent="space-between" marginBottom="1rem">
        <ProjectBadge state={project?.state as ProjectState} />
        <Tag fontSize="xl" fontWeight="bold" colorScheme="blue">
          {(project?.total_amount || 0) / 1_000_000} ꜩ
        </Tag>
      </HStack>

      <Text fontSize="sm">
        Application date: {project?.application_date.toISOString()}
      </Text>
      <Text fontSize="sm">Applicants: {project?.applications.length}</Text>
      <Text fontSize="sm">Funders: {Object.keys(project?.funders || {}).length}</Text>
      <Text fontSize="sm">Developer: {project?.elected_dev}</Text>
      <Text fontSize="sm">Arbitrator: {project?.arbitrator}</Text>
    </Card>
  );
};

export default ProjectInfo;
