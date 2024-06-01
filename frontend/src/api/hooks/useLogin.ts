import { useMutation } from "react-query";

import { loginUser } from "../services/auth-service";

export const useLogin = () => {
  const { mutate, isError, error } = useMutation(loginUser);

  return {
    loginUser: mutate,
    isError,
    error,
  };
};
