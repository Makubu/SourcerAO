import { ProjectState } from '@app/models';
import { StateColors, StateName } from '@app/models/utils';
import { Badge } from '@chakra-ui/react';

interface projectBadgeProps {
  state: ProjectState;
}

const ProjectBadge = (props: projectBadgeProps) => {
  const { state } = props;
  return (
    <Badge colorScheme={StateColors[state]} fontSize="lg" variant="subtle">
      {StateName[state]}
    </Badge>
  );
};

export default ProjectBadge;
