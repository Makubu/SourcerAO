import { useEffect } from 'react';
import { ProjectDescription } from '@app/models';
import { useToast } from '@chakra-ui/react';
import { mutate } from 'swr';
import { useContractWrite, useWaitForTransaction } from 'wagmi';

import contractAbi from '../abi/contract.json';

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

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
      // const cid = await uploadProjectDescription(projectDescription);
      const cid = 'ipfs/:123';
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
