export enum ProjectState {
  OPEN = 0,
  VOTE_PHASE = 1,
  WAITING_FOR_DEV = 2,
  PROGRESS = 3,
  COMPLETED = 4,
  LITIGATION = 5,
  ARBITRATION = 6,
}

export interface Fund {
  amount: number;
  bail: number;
}

export interface Project {
  id: string;
  title: string;
  total_bounty: number;
  total_bail: number;
  uri: string; // ipfs
  creator: string;
  creation: Date;
  state: ProjectState;
  funders: Record<string, Fund>; // addr: amount
  application_date: Date;
  vote_deadline: Date;
  applications: string[]; // addr
  elected_dev: string; // addr
  application_votes: Record<string, string>; // addr: addr
  arbitrator: string;
}

export interface ProjectDescription {
  title: string;
  description: string;
  due: Date;
}

export interface Developer {
  dev_addr: string;
  reputation: number;
  arbitration_right: boolean;
  cv_uri: string;
}
