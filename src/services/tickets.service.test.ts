import { AxiosError, AxiosHeaders } from "axios";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { Ticket } from "../interfaces";
import { http } from "../request";
import { isTicketConflictError, ticketsService } from "./tickets.service";

describe("ticketsService update conflict", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("propaga error 409 y permite detectarlo", async () => {
    const conflictTicket: Ticket = {
      id: "1",
      code: "TCK-000001",
      title: "Ticket actualizado en servidor",
      description: "Descripcion extensa del ticket para cumplir minimo",
      status: "IN_PROGRESS",
      priority: "HIGH",
      createdAt: "2026-02-10T10:00:00.000Z",
      updatedAt: "2026-02-12T10:00:00.000Z",
      requester: { name: "Ana", email: "ana@empresa.com" },
      tags: ["erp"],
    };

    const error = new AxiosError("Conflict", "ERR_BAD_REQUEST");
    error.response = {
      status: 409,
      statusText: "Conflict",
      headers: {},
      config: { headers: new AxiosHeaders() },
      data: {
        code: "TICKET_CONFLICT",
        message: "El ticket fue modificado por otro usuario.",
        currentTicket: conflictTicket,
      },
    };

    vi.spyOn(http, "put").mockRejectedValue(error);

    const action = ticketsService.update(
      "1",
      {
        title: "Titulo nuevo",
        description: "Descripcion con mas de veinte caracteres",
        status: "OPEN",
        priority: "MEDIUM",
        requester: { name: "Ana", email: "ana@empresa.com" },
        tags: ["erp"],
      },
      "2026-02-12T09:00:00.000Z",
    );

    await expect(action).rejects.toBe(error);
    await action.catch((caught) => {
      expect(isTicketConflictError(caught)).toBe(true);
    });
  });
});
