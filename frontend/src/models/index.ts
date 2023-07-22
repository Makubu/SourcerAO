export interface Account {
  address: string;
}

export enum ProjectState {
  OPEN = 'OPEN',
  PROGRESS = 'PROGRESS',
  COMPLETED = 'COMPLETED',
  LITIGATION = 'LITIGATION',
  ARBITRATION = 'ARBITRATION',
}

export interface Fund {
  amount: number;
  bail: number;
}

export interface Project {
  id: string;
  title: string;
  total_amount: number;
  total_bail: number;
  uri: string; // ipfs
  creator: string;
  creation: Date;
  state: ProjectState;
  funders: Record<string, Fund>; // addr: amount
  application_date: Date;
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
