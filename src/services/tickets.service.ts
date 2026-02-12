import { http } from "../request";
import type { ListTicketsParams, Ticket, TicketsListResult } from "../interfaces/ticket.interface";

export const ticketsService = {
  list: async (params: ListTicketsParams = {}, signal?: AbortSignal): Promise<TicketsListResult> => {
    const {
      query = "",
      status,
      priority,
      sort = "updatedAt.desc",
      page = 1,
      pageSize = 10,
    } = params;

    const [sortField, sortOrder] = sort.split(".");

    const { data, headers } = await http.get<Ticket[] | { data: Ticket[]; items?: number; pages?: number }>(
      "/tickets",
      {
      params: {
        _page: page,
        _per_page: pageSize,
        _limit: pageSize,
        _sort: sortField,
        _order: sortOrder,
        q: query || undefined,
        status: status || undefined,
        priority: priority || undefined,
      },
      signal,
    });

    const items = Array.isArray(data) ? data : data.data;
    const headerTotal = Number(headers["x-total-count"] ?? 0);
    const payloadTotal = !Array.isArray(data) && typeof data.items === "number" ? data.items : 0;
    const total = headerTotal || payloadTotal || items.length;
    const payloadPages = !Array.isArray(data) && typeof data.pages === "number" ? data.pages : 0;
    const totalPages = payloadPages || Math.max(1, Math.ceil(total / pageSize));

    return {
      items,
      page,
      pageSize,
      total,
      totalPages,
    };
  },
  getById: async (id: string, signal?: AbortSignal): Promise<Ticket> => {
    const { data } = await http.get<Ticket>(`/tickets/${id}`, { signal });
    return data;
  },
  create: async (
    payload: Omit<Ticket, "id" | "code" | "createdAt" | "updatedAt">,
    signal?: AbortSignal,
  ): Promise<Ticket> => {
    const now = new Date().toISOString();
    const code = `TCK-${Math.floor(Math.random() * 1_000_000)
      .toString()
      .padStart(6, "0")}`;

    const { data } = await http.post<Ticket>("/tickets", {
        ...payload,
        code,
        createdAt: now,
        updatedAt: now,
      },
      { signal },
    );
    return data;
  },
  update: async (
    id: string,
    payload: Omit<Ticket, "id" | "code" | "createdAt" | "updatedAt">,
    signal?: AbortSignal,
  ): Promise<Ticket> => {
    const { data } = await http.put<Ticket>(
      `/tickets/${id}`,
      {
        ...payload,
        updatedAt: new Date().toISOString(),
      },
      { signal },
    );
    return data;
  },
  patchStatus: async (id: string, status: Ticket["status"], signal?: AbortSignal): Promise<Ticket> => {
    const { data } = await http.patch<Ticket>(
      `/tickets/${id}`,
      { status, updatedAt: new Date().toISOString() },
      { signal },
    );
    return data;
  },
};
