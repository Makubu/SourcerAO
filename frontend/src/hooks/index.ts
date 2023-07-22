import { useEffect, useMemo, useState } from 'react';
import { ProjectDescription } from '@app/models';
import { useToast } from '@chakra-ui/react';
import { ethers } from 'ethers';
import useSWR, { mutate } from 'swr';
import { useContractRead, useContractWrite, useWaitForTransaction } from 'wagmi';

import contractAbi from '../abi/contract.json';

import { uploadProjectDescription } from './http';

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

export const useProvider = () => {
  if (!window.ethereum) {
    throw Error('ethereum provider not found');
  }
  const provider = new ethers.BrowserProvider(window.ethereum);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi);
  return { provider, contract };
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
    account,
    isConnected,
  };
};

export const useCreateProject = () => {
  const toast = useToast();
  const {
    data,
    write,
    isLoading: isPreparing,
    isSuccess: isPending,
  } = useContractWrite({
    abi: contractAbi,
    address: CONTRACT_ADDRESS,
    functionName: 'createProject',
  });

  const { isSuccess: isConfirmed } = useWaitForTransaction({
    confirmations: 1,
    hash: data?.hash,
  });

  useEffect(() => {
    const revalidate = async () => {
      if (isConfirmed === true) {
        await revalidateProjects();
        toast.closeAll();
        toast({
          title: `Project created`,
          description: data?.hash,
          status: 'success',
          position: 'bottom-right',
          duration: 6000,
        });
      }
    };
    revalidate();
  }, [isConfirmed]);

  useEffect(() => {
    if (isPending === true) {
      toast({
        title: `Waiting transation confirmation`,
        status: 'info',
        position: 'bottom-right',
        duration: 60 * 1000,
      });
    }
  }, [isPending]);

  const action = async (projectDescription: ProjectDescription) => {
    if (write) {
      const cid = await uploadProjectDescription(projectDescription);
      // const cid = 'ipfs/:123';
      write({ args: [projectDescription.title, cid, true] });
    }
  };

  return {
    action,
    loading: isPreparing,
    success: isPending,
    // loading: (isPreparing || isPending) && !isConfirmed,
    // success: isConfirmed,
  };
};

export const revalidateProjects = async () => {
  await mutate((key: string) => key.includes('GetProject'), undefined, {
    revalidate: true,
    populateCache: true,
  });
};

export const useGetProjects = () => {
  const { provider, contract } = useProvider();

  const getProjects = async () => {
    console.log(provider, contract);
    try {
      const projectCount = await contract.getProjectCount();
      console.log('get projects', projectCount);
    } catch (e) {
      console.log('err', e);
    }
    // const projects: Project[] = [];
    // for (const id of projects_id) {
    //   const project = await contract.get_Project_value(id);
    //   if (project) {
    //     projects.push(dataToProject(project, id.toString()));
    //   }
    // }
    return 0;
  };

  return useSWR('GetProjects', getProjects, {
    revalidateIfStale: false,
    refreshWhenHidden: false,
    revalidateOnFocus: false,
  });
};
