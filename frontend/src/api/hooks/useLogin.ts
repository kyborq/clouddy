import { useMutation, useQueryClient } from "react-query";

import { loginUser } from "../services/auth-service";

export const useLogin = () => {
  const queryClient = useQueryClient();

  const { mutate, isError, error } = useMutation(loginUser, {
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);
    },
  });

  return {
    loginUser: mutate,
    isError,
    error,
  };
};
