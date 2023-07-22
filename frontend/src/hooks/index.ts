import { useEffect, useMemo, useState } from 'react';
import { Developer, Project, ProjectDescription } from '@app/models';
import { dataToProject } from '@app/models/utils';
import { useToast } from '@chakra-ui/react';
import { ethers } from 'ethers';
import useSWR, { mutate } from 'swr';

import contractAbi from '../abi/contract.json';

import { downloadProjectDescription, uploadProjectDescription } from './http';

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
const PUBLIC_PROVIDER = new ethers.JsonRpcProvider(
  'https://goerli.infura.io/v3/1f2293dc91f14fca8f613667f75dff45',
);

export const useProvider = () => {
  if (!window.ethereum) {
    throw Error('ethereum provider not found');
  }
  const provider = new ethers.BrowserProvider(window.ethereum);
  return { provider };
};

export const useConnect = () => {
  const NULL_ACCOUNT = '0x0';
  const { provider } = useProvider();
  const [account, setaccount] = useState(NULL_ACCOUNT);

  useEffect(() => {
    const recover = async () => {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts && accounts.length > 0) {
        setaccount(accounts[0] || NULL_ACCOUNT);
      }
    };

    recover();

    const accountWasChanged = (accounts: string[]) => {
      setaccount(accounts[0] || NULL_ACCOUNT);
    };

    const clearAccount = () => {
      setaccount(NULL_ACCOUNT);
    };

    window.ethereum.on('accountsChanged', accountWasChanged);
    window.ethereum.on('disconnect', clearAccount);

    return () => {
      window.ethereum.removeListener('accountsChanged', accountWasChanged);
      window.ethereum.removeListener('disconnect', clearAccount);
    };
  }, []);

  const connect = async () => {
    await provider.send('eth_requestAccounts', []).catch((error) => {
      console.log('error: ', error);
    });
  };

  const isConnected = useMemo(() => account !== NULL_ACCOUNT, [account]);

  return {
    connect,
    account: account.toLowerCase(),
    isConnected,
  };
};

export const useGetDevelopers = (applications: string[]) => {
  const getDevelopers = async () => {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi, PUBLIC_PROVIDER);
    const developers: Developer[] = [];
    for (const id of applications || []) {
      const developer = await contract.getDevelopperDesc(id);
      developers.push({
        dev_addr: id,
        reputation: developer['reputation'],
        cv_uri: developer['cv_uri'],
      });
    }
    return developers;
  };

  return useSWR('GetDevelopers', getDevelopers);
};

export const useCreateProject = () => {
  const { provider } = useProvider();
  const toast = useToast();

  return async (projectDescription: ProjectDescription) => {
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi, signer);
    const cid = await uploadProjectDescription(projectDescription);
    const application_deadline = new Date(Date.now() + 3600 * 24 * 7 * 1000);
    const vote_deadline = new Date(Date.now() + 3600 * 24 * 7 * 2 * 1000);
    const operation = await contract.createProject(
      projectDescription.title,
      cid,
      true,
      application_deadline.getTime(),
      vote_deadline.getTime(),
    );
    const toastId = toast({
      title: `Waiting transation confirmation`,
      status: 'info',
      position: 'bottom-right',
      duration: 20_000,
    });
    await operation.wait(1);
    toast.close(toastId);
    await revalidateProjects();
  };
};

export const revalidateProjects = async () => {
  await mutate((key: string) => key.includes('GetProject'), undefined, {
    revalidate: true,
    populateCache: true,
  });
};

export const useGetProjects = () => {
  const getProjects = async () => {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi, PUBLIC_PROVIDER);
    const projectCount = await contract.getProjectCount();
    const projects: Project[] = [];
    for (let id = 0; id < projectCount; ++id) {
      const project = await contract.getProject(id);
      if (project) {
        projects.push(dataToProject([...project]));
      }
    }

    return projects;
  };

  return useSWR('GetProjects', getProjects, {
    revalidateIfStale: false,
    refreshWhenHidden: false,
    revalidateOnFocus: false,
  });
};

export const useGetProjectById = (projectId: string) => {
  const getProject = async () => {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi, PUBLIC_PROVIDER);
    const projectData = await contract.getProject(projectId);
    const project = dataToProject([...projectData]);
    const description = await downloadProjectDescription(project.uri);
    return {
      project,
      description,
    };
  };

  return useSWR(`GetProject-${projectId}`, getProject, {
    revalidateIfStale: false,
    refreshWhenHidden: false,
  });
};

export const useAcceptProject = () => {
  const { provider } = useProvider();
  const toast = useToast();

  return async (projectId: string, amount: number) => {
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi, signer);
    const bailInWei = ethers.formatUnits(amount.toString(), 'wei');
    const operation = await contract.acceptProject(projectId, { value: bailInWei });
    const toastId = toast({
      title: `Waiting transation confirmation`,
      status: 'info',
      position: 'bottom-right',
      duration: 20_000,
    });
    await operation.wait(1);
    toast.close(toastId);
    await revalidateProjects();
  };
};

export const useFundProject = () => {
  const { provider } = useProvider();
  const toast = useToast();

  return async (projectId: string, fund: number) => {
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi, signer);
    const fundInWei = ethers.parseUnits(fund.toString(), 'gwei');
    const operation = await contract.fundProject(projectId, { value: fundInWei });
    const toastId = toast({
      title: `Waiting transation confirmation`,
      status: 'info',
      position: 'bottom-right',
      duration: 20_000,
    });
    await operation.wait(1);
    toast.close(toastId);
    await revalidateProjects();
  };
};

export const useApplyProject = () => {
  const { provider } = useProvider();
  const toast = useToast();

  return async (projectId: string) => {
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi, signer);
    const operation = await contract.applyToProject(projectId);
    const toastId = toast({
      title: `Waiting transation confirmation`,
      status: 'info',
      position: 'bottom-right',
      duration: 20_000,
    });
    await operation.wait(1);
    toast.close(toastId);
    await revalidateProjects();
  };
};

export const useUpdateCV = () => {
  const { provider } = useProvider();
  const toast = useToast();

  return async (cv_ipfs: string) => {
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi, signer);
    const operation = await contract.updateCV(cv_ipfs);
    const toastId = toast({
      title: `Waiting transation confirmation`,
      status: 'info',
      position: 'bottom-right',
      duration: 20_000,
    });
    await operation.wait(1);
    toast.close(toastId);
    await revalidateProjects();
  };
};

export const useStartVotePhase = () => {
  const { provider } = useProvider();
  const toast = useToast();

  return async (projectId: string) => {
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi, signer);
    const operation = await contract.startVotePhase(projectId);
    const toastId = toast({
      title: `Waiting transation confirmation`,
      status: 'info',
      position: 'bottom-right',
      duration: 20_000,
    });
    await operation.wait(1);
    toast.close(toastId);
    await revalidateProjects();
  };
};

export const useEndVotePhase = () => {
  const { provider } = useProvider();
  const toast = useToast();

  return async (projectId: string) => {
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi, signer);
    const operation = await contract.endVotePhase(projectId);
    const toastId = toast({
      title: `Waiting transation confirmation`,
      status: 'info',
      position: 'bottom-right',
      duration: 20_000,
    });
    await operation.wait(1);
    toast.close(toastId);
    await revalidateProjects();
  };
};

export const useForceVotePhase = () => {
  const { provider } = useProvider();
  const toast = useToast();

  return async (projectId: string) => {
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi, signer);
    const operation = await contract.forceVotePhase(projectId);
    const toastId = toast({
      title: `Waiting transation confirmation`,
      status: 'info',
      position: 'bottom-right',
      duration: 20_000,
    });
    await operation.wait(1);
    toast.close(toastId);
    await revalidateProjects();
  };
};

// voteForDeveloper
export const useChooseDeveloper = () => {
  const { provider } = useProvider();
  const toast = useToast();

  return async (projectId: string, developerAddress: string) => {
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi, signer);
    const operation = await contract.voteForDeveloper(projectId, developerAddress);
    const toastId = toast({
      title: `Waiting transation confirmation`,
      status: 'info',
      position: 'bottom-right',
      duration: 20_000,
    });
    await operation.wait(1);
    toast.close(toastId);
    await revalidateProjects();
  };
};

export const useCompleteProject = () => {
  const { provider } = useProvider();
  const toast = useToast();

  return async (projectId: string) => {
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi, signer);
    const operation = await contract.completeProject(projectId);
    const toastId = toast({
      title: `Waiting transation confirmation`,
      status: 'info',
      position: 'bottom-right',
      duration: 20_000,
    });
    await operation.wait(1);
    toast.close(toastId);
    await revalidateProjects();
  };
};

export const useCloseProject = () => {
  const { provider } = useProvider();
  const toast = useToast();

  return async (projectId: string) => {
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi, signer);
    const operation = await contract.closeProject(projectId);
    const toastId = toast({
      title: `Waiting transation confirmation`,
      status: 'info',
      position: 'bottom-right',
      duration: 20_000,
    });
    await operation.wait(1);
    toast.close(toastId);
    await revalidateProjects();
  };
};

// -----------------------------------
// startLitigationPhase_dev
// startLitigationPhase_funder
// handleLitigationPhase
// settleLitigation
// ----------------------------------
