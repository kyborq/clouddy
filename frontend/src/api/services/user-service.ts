import { api, TApiRoutes } from "../";

export const getCurrent = async () => {
  const { data } = await api.get(TApiRoutes.CURRENT_USER);
  return data;
};
