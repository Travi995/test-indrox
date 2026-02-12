import type { TicketPriority, TicketSort, TicketStatus } from "../types/ticket.types";

export interface TicketRequester {
  name: string;
  email: string;
}

export interface Ticket {
  id: string;
  code: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
  updatedAt: string;
  requester: TicketRequester;
  tags: string[];
}

export interface ListTicketsParams {
  query?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  sort?: TicketSort;
  page?: number;
  pageSize?: number;
}

export interface TicketsListResult {
  items: Ticket[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
