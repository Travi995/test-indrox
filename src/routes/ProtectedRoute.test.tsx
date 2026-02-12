import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import { useAuthStore } from "../stores";
import { ProtectedRoute } from "./ProtectedRoute";

describe("ProtectedRoute", () => {
  afterEach(() => {
    useAuthStore.setState({ user: null, token: null });
  });

  it("redirecciona a login cuando no hay sesion", () => {
    useAuthStore.setState({ user: null, token: null });

    render(
      <MemoryRouter initialEntries={["/app/tickets"]}>
        <Routes>
          <Route path="/login" element={<p>Pantalla login</p>} />
          <Route element={<ProtectedRoute />}>
            <Route path="/app/tickets" element={<p>Ruta privada</p>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Pantalla login")).toBeInTheDocument();
    expect(screen.queryByText("Ruta privada")).not.toBeInTheDocument();
  });
});
