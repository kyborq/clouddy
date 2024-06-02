import { useQuery } from "react-query";

import { listFiles } from "../services/storageService";

export const useStorage = () => {
  const { data } = useQuery(["files"], listFiles, {
    onSuccess: () => {},
  });

  return data || [];
};
