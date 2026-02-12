import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import { useAuthStore } from "../stores";
import { LoginView } from "./LoginView";

describe("LoginView", () => {
  afterEach(() => {
    useAuthStore.setState({ user: null, token: null });
  });

  it("muestra errores de validacion cuando se envia vacio", async () => {
    const user = userEvent.setup();

    const { getByRole, getByText } = render(
      <MemoryRouter>
        <LoginView />
      </MemoryRouter>,
    );

    await user.click(getByRole("button", { name: "Ingresar" }));

    expect(getByText("Ingresa un correo valido")).toBeInTheDocument();
    expect(getByText("La contraseña debe tener al menos 6 caracteres")).toBeInTheDocument();
  });
});
