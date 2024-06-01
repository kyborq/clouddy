import { useQuery } from "react-query";

import { getMyFiles } from "../services/file-service";

export const useFiles = () => {
  const { data } = useQuery(["files"], getMyFiles);
  return {
    files: data || [],
  };
};
