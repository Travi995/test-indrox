import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ticketsService } from "../services";
import type { ListTicketsParams, Ticket } from "../interfaces";

export const ticketKeys = {
  all: ["tickets"] as const,
  list: (params: ListTicketsParams) => [...ticketKeys.all, "list", params] as const,
  detail: (id: string) => [...ticketKeys.all, "detail", id] as const,
};

export function useTicketsListQuery(params: ListTicketsParams) {
  return useQuery({
    queryKey: ticketKeys.list(params),
    queryFn: ({ signal }) => ticketsService.list(params, signal),
    placeholderData: keepPreviousData,
  });
}

export function useTicketDetailQuery(id: string) {
  return useQuery({
    queryKey: ticketKeys.detail(id),
    queryFn: ({ signal }) => ticketsService.getById(id, signal),
    enabled: Boolean(id),
  });
}

export function useCreateTicketMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Omit<Ticket, "id" | "code" | "createdAt" | "updatedAt">) =>
      ticketsService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.all });
    },
  });
}

export function useUpdateTicketMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
      expectedUpdatedAt,
    }: {
      id: string;
      payload: Omit<Ticket, "id" | "code" | "createdAt" | "updatedAt">;
      expectedUpdatedAt: string;
    }) => ticketsService.update(id, payload, expectedUpdatedAt),
    onSuccess: (ticket) => {
      queryClient.setQueryData(ticketKeys.detail(ticket.id), ticket);
      queryClient.invalidateQueries({ queryKey: ticketKeys.all });
    },
  });
}

export function usePatchTicketStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Ticket["status"] }) =>
      ticketsService.patchStatus(id, status),
    onSuccess: (updatedTicket) => {
      queryClient.setQueryData(ticketKeys.detail(updatedTicket.id), updatedTicket);
      queryClient.invalidateQueries({ queryKey: ticketKeys.all });
    },
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ticketKeys.all });
      const previousLists = queryClient.getQueriesData({ queryKey: [...ticketKeys.all, "list"] });
      const previousDetail = queryClient.getQueryData<Ticket>(ticketKeys.detail(id));

      previousLists.forEach(([key, value]) => {
        if (!value || typeof value !== "object" || !("items" in value)) {
          return;
        }

        const listValue = value as { items: Ticket[] };
        queryClient.setQueryData(key, {
          ...value,
          items: listValue.items.map((item) =>
            item.id === id ? { ...item, status, updatedAt: new Date().toISOString() } : item,
          ),
        });
      });

      if (previousDetail) {
        queryClient.setQueryData(ticketKeys.detail(id), {
          ...previousDetail,
          status,
          updatedAt: new Date().toISOString(),
        });
      }

      return { previousLists, previousDetail };
    },
    onError: (_error, variables, context) => {
      context?.previousLists.forEach(([key, value]) => {
        queryClient.setQueryData(key, value);
      });
      if (context?.previousDetail) {
        queryClient.setQueryData(ticketKeys.detail(variables.id), context.previousDetail);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.all });
    },
  });
}
