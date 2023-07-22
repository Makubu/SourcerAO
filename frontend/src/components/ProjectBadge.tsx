import { ProjectState } from '@app/models';
import { Badge } from '@chakra-ui/react';

const StateColors: Record<ProjectState, string> = {
  [ProjectState.OPEN]: 'green',
  [ProjectState.PROGRESS]: 'blue',
  [ProjectState.COMPLETED]: 'gray',
  [ProjectState.LITIGATION]: 'red',
  [ProjectState.ARBITRATION]: 'orange',
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
