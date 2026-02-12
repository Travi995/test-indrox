import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./layouts";
import { ProtectedRoute } from "./routes";
import { LoginView, NotFoundView, TicketsListView } from "./views";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
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
