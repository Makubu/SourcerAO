import { Project, ProjectState } from '.';

export const dataToProject = (data: any): Project => {
  return {
    id: data[0].toString(),
    title: data[1].toString(),
    uri: data[2].toString(),
    creator: data[3].toString().toLowerCase(),
    creation: new Date(parseInt(data[4].toString()) * 1000),
    state: parseInt(data[6].toString()) as ProjectState,
    total_bounty: parseInt(data[7].toString()),
    total_bail: parseInt(data[8].toString()),
    application_date: new Date(parseInt(data[9].toString())),
    vote_deadline: new Date(parseInt(data[10].toString())),
    elected_dev: data[11],
    arbitrator: data[12],
    funders: [...data[13]].map((addr) => addr.toLowerCase()),
    applications: [...data[14]].map((addr) => addr.toLowerCase()),
  };
};

export const StateColors: Record<ProjectState, string> = {
  [ProjectState.OPEN]: 'green',
  [ProjectState.VOTE_PHASE]: 'cyan',
  [ProjectState.WAITING_FOR_DEV]: 'purple',
  [ProjectState.PROGRESS]: 'blue',
  [ProjectState.COMPLETED]: 'gray',
  [ProjectState.LITIGATION]: 'red',
  [ProjectState.ARBITRATION]: 'orange',
};

export const StateName: Record<ProjectState, string> = {
  [ProjectState.OPEN]: 'Open',
  [ProjectState.VOTE_PHASE]: 'Voting',
  [ProjectState.WAITING_FOR_DEV]: 'Developer reveal',
  [ProjectState.PROGRESS]: 'Progress',
  [ProjectState.COMPLETED]: 'Completed',
  [ProjectState.LITIGATION]: 'Litigation',
  [ProjectState.ARBITRATION]: 'Arbitration',
};
