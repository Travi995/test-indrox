import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./layouts";
import { ProtectedRoute } from "./routes";
import { useAuthStore } from "./stores";
import { LoginView, NotFoundView, TicketsListView } from "./views";

function RootRedirect() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());
  return <Navigate to={isAuthenticated ? "/app/tickets" : "/login"} replace />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<LoginView />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/app" element={<AppLayout />}>
          <Route path="tickets" element={<TicketsListView />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFoundView />} />
    </Routes>
  );
}

export default App;
