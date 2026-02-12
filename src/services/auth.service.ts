import { http } from "../request";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  user: SessionUser;
};

export const authService = {
  login: async (payload: LoginPayload) => {
    const { data } = await http.post<LoginResponse>("/auth/login", payload);
    return data;
  },
};
