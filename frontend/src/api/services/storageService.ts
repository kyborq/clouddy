import axios, { AxiosError } from "axios";

import { api, TApiRoutes } from "../";
import { TStorageItem } from "../models/storageModel";

export const listFiles = async () => {
  try {
    const { data } = await api.get<TStorageItem[]>(TApiRoutes.STORAGE_FILES);
    return data;
  } catch (err) {
    const error = err as Error | AxiosError;
    if (!axios.isAxiosError(error)) {
      // TODO:
      throw error;
    }
  }
};
