import { Route, Routes } from "react-router-dom";
import { AppLayout } from "./layouts";
import { LoginView, NotFoundView, TicketNewView, TicketsListView } from "./views";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginView />} />
      <Route path="/app" element={<AppLayout />}>
        <Route path="tickets" element={<TicketsListView />} />
        <Route path="tickets/new" element={<TicketNewView />} />
      </Route>
      <Route path="*" element={<NotFoundView />} />
    </Routes>
  );
}

export default App;
