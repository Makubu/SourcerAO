import { ProjectDescription } from '@app/models';
import { useToast } from '@chakra-ui/react';
import useSWR, { mutate } from 'swr';
import { useAccount, useConnect, useContractWrite } from 'wagmi';

import { uploadProjectDescription } from './http';

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

export const useCreateProject = () => {
  const { address } = useAccount();
  const { data, isLoading, isSuccess, write } = useContractWrite({
    // abi: abi,
    address: CONTRACT_ADDRESS,
    functionName: 'new_project',
  });

  const toast = useToast();

  return async (projectDescription: ProjectDescription, amount: number) => {
    const cid = await uploadProjectDescription(projectDescription);
    const today = new Date();

    // application date close next week
    const applicationDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    write({
      args: [cid, projectDescription.title, applicationDate.toISOString(), true],
      from: address as string,
      value: parseEther(amount),
    });

    // contract.methods
    //   .new_project(
    //     cid.toString(),
    //     projectDescription.title,
    //     applicationDate.toISOString(),
    //     true,
    //   )
    //   .send({ amount, mutez: true });

    const toastId = toast({
      title: `Waiting transation confirmation`,
      status: 'info',
      position: 'bottom-right',
      duration: 60 * 1000,
    });
    // await operation.confirmation(2);
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
