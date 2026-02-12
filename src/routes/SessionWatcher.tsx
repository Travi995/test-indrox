import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { isTokenExpired } from "../utils/jwt";
import { useAuthStore } from "../stores";

export function SessionWatcher() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const check = () => {
      const { token, logout } = useAuthStore.getState();
      if (!token) return;
      if (!isTokenExpired(token)) return;
      logout();
      if (location.pathname !== "/login") {
        navigate("/login", { replace: true });
      }
    };

    check();
    const id = window.setInterval(check, 10_000);
    return () => window.clearInterval(id);
  }, [location.pathname, navigate]);

  return null;
}
