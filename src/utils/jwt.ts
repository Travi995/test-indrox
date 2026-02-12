import { decodeJwt } from "jose";

export const isTokenExpired = (token: string) => {
  try {
    const decoded = decodeJwt(token);
    if (!decoded.exp) return true;
    return decoded.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
};
