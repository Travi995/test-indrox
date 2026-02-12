import { http } from "../request";

export type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
export type TicketPriority = "LOW" | "MEDIUM" | "HIGH";

export type Ticket = {
  id: string;
  code: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
  updatedAt: string;
  requester: { name: string; email: string };
  tags: string[];
};

export type ListTicketsParams = {
  query?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  sort?: "updatedAt.asc" | "updatedAt.desc";
  page?: number;
  pageSize?: number;
};

export const ticketsService = {
  list: async (params: ListTicketsParams = {}) => {
    const {
      query = "",
      status,
      priority,
      sort = "updatedAt.desc",
      page = 1,
      pageSize = 10,
    } = params;

    const [sortField, sortOrder] = sort.split(".");

    const { data } = await http.get<Ticket[]>("/tickets", {
      params: {
        _page: page,
        _per_page: pageSize,
        _sort: sortField,
        _order: sortOrder,
        q: query || undefined,
        status: status || undefined,
        priority: priority || undefined,
      },
    });

    return data;
  },
  getById: async (id: string) => {
    const { data } = await http.get<Ticket>(`/tickets/${id}`);
    return data;
  },
  create: async (payload: Omit<Ticket, "id" | "code" | "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString();
    const code = `TCK-${Math.floor(Math.random() * 1_000_000)
      .toString()
      .padStart(6, "0")}`;

    const { data } = await http.post<Ticket>("/tickets", {
      ...payload,
      code,
      createdAt: now,
      updatedAt: now,
    });
    return data;
  },
};
