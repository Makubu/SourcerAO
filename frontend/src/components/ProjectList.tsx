import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetProjects } from '@app/hooks';
import { Project } from '@app/models';
import { Box, Heading, HStack, Spinner, Tag, Text } from '@chakra-ui/react';
import { ethers } from 'ethers';

import Card from './Card';
import ProjectBadge from './ProjectBadge';

interface projectItemProps {
  project: Project;
}

const ProjectItem: FC<projectItemProps> = (props: projectItemProps) => {
  const { project } = props;
  const navigate = useNavigate();

  return (
    <Box
      onClick={() => navigate(`/projects/${project.id}`)}
      _hover={{
        cursor: 'pointer',
      }}
      borderWidth="1px"
      borderColor="gray"
      borderRadius="md"
      padding="0.8rem"
      marginBottom="1rem"
      _last={{ marginBottom: 0 }}
    >
      <HStack justifyContent="space-between" marginBottom="0.5rem">
        <Heading fontSize="lg">{project.title}</Heading>
        <Tag fontWeight="bold" fontSize="lg" colorScheme="blue">
          {ethers
            .formatUnits(project?.total_bounty.toString() || '0', 'ether')
            .toString()}{' '}
          eth
        </Tag>
      </HStack>
      <HStack justifyContent="space-between">
        <Text fontSize="sm">{project.creation.toDateString()}</Text>
        <ProjectBadge state={project.state} />
      </HStack>
      <Heading fontSize="sm" color="gray.500">
        {project.id}
      </Heading>
    </Box>
  );
};

interface projectListProps {
  search: string;
}

const ProjectList: FC<projectListProps> = (props: projectListProps) => {
  const { search } = props;
  const { data: projects, isLoading } = useGetProjects();

  const filteredProject = useMemo(() => {
    if (!projects) {
      return [];
    }
    let p: Project[] = projects;
    if (search.length != 0) {
      p = projects.filter(({ title }) => title.toLowerCase().includes(search.trim()));
    }

    p.sort((a, b) => {
      if (a.creation < b.creation) {
        return -1;
      }
      if (a.creation > b.creation) {
        return 1;
      }
      return 0;
    });
    return p;
  }, [search, projects]);

  return (
    <Card width="100%" maxHeight="70vh" height="fit-content" overflowY="auto">
      {isLoading ? (
        <Spinner />
      ) : filteredProject.length ? (
        <>
          {filteredProject.map((project) => (
            <ProjectItem project={project} key={project.id} />
          ))}
        </>
      ) : (
        <Text>No projects 😱</Text>
      )}
    </Card>
  );
};

export default ProjectList;
