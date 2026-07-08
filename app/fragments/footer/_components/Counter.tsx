import { queryGetCounter } from '@/schema';
import { useQuery } from '@tanstack/react-query';

export const Counter = () => {
  const { data } = useQuery(queryGetCounter());

  return data?.count ?? null;
};
