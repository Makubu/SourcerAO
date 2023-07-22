import { ProjectState } from '@app/models';
import { Badge } from '@chakra-ui/react';

const StateColors: Record<ProjectState, string> = {
  OPEN: 'green',
  PROGRESS: 'blue',
  COMPLETED: 'gray',
  LITIGATION: 'red',
  ARBITRATION: 'orange',
};

interface projectBadgeProps {
  state: ProjectState;
}

const ProjectBadge = (props: projectBadgeProps) => {
  const { state } = props;
  return (
    <Badge colorScheme={StateColors[state]} fontSize="lg" variant="subtle">
      {state}
    </Badge>
  );
};

export default ProjectBadge;
