import axios from "axios";

export enum TApiRoutes {
  LOGIN = "/auth/login",
  REGISTER = "/auth/register",
  REFRESH = "/auth/refresh",
  CURRENT_USER = "/users/current",
}

export const api = axios.create({
  baseURL: "/api",
});
