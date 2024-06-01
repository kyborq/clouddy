import { api, TApiRoutes } from "../";
import { UploadedFiles } from "../models/file-model";

export const getMyFiles = async () => {
  const { data } = await api.get<UploadedFiles>(TApiRoutes.CURRENT_FILES);
  return data;
};
