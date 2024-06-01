import { useQuery } from "react-query";

import { useAuthStore } from "@/store/useStore";

import { getCurrent } from "../services/user-service";

export const useUser = () => {
  const { setUser, clearUser } = useAuthStore();

  const { data, isLoading, isError } = useQuery(["user"], getCurrent, {
    onSuccess: (user) => {
      setUser(user);
    },
    onError: () => {
      clearUser();
    },
  });

  return {
    user: data,
    isLoading,
    isError,
  };
};
