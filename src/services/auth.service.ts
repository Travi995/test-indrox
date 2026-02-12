import { http } from "../request";
import type { LoginResponse } from "../interfaces/auth.interface";
import type { LoginPayload } from "../types/auth.types";

export const authService = {
  login: async (payload: LoginPayload) => {
    const { data } = await http.post<LoginResponse>("/auth/login", payload);
    return data;
  },
};
