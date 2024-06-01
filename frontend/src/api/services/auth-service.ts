import { AxiosError } from "axios";

import { api, TApiRoutes } from "@/api";
import { Credentials } from "@/api/models/auth-model";

export const loginUser = async (credentials: Credentials) => {
  try {
    const { data } = await api.post(TApiRoutes.LOGIN, credentials);
    console.log(data);
    return data;
  } catch (e) {
    throw e as AxiosError;
  }
};
