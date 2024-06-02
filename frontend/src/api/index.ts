import axios from "axios";

export enum TApiRoutes {
  STORAGE_FILES = "/storage",
}

export const api = axios.create({
  baseURL: "/api",
});
