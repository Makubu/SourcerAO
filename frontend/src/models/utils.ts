import { Project, ProjectState } from '.';

export const dataToProject = (data: any): Project => {
  console.log(data);
  return {
    id: data[0].toString(),
    title: data[1].toString(),
    uri: data[2].toString(),
    creator: data[3].toString(),
    creation: new Date(parseInt(data[4].toString())),
    state: parseInt(data[6].toString()) as ProjectState,
    total_bounty: parseInt(data[7].toString()),
    total_bail: parseInt(data[8].toString()),
    application_date: new Date(parseInt(data[9].toString())),
    elected_dev: data[11],
    arbitrator: data[12],
    funders: data[13],
    applications: data[14],
    application_votes: {},
  };
};