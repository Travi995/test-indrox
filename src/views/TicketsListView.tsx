import { useCallback, useEffect, useMemo, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight,  SearchX, X } from "lucide-react";
import toast from "react-hot-toast";
import { Card, CardContent } from "../components/sui";
import { TicketDetailDialog, TicketFilters, TicketForm, TicketsMobileList, TicketsSkeleton, TicketsTable } from "../components/tickets";
import type { TicketFormValues } from "../components/tickets/TicketForm";
import { useCreateTicketMutation, useTicketDetailQuery, useTicketsListQuery, useUpdateTicketMutation } from "../querys";
import { isTicketConflictError } from "../services";
import type { TicketPriority, TicketSort, TicketStatus } from "../types";

export function TicketsListView() {
  const shouldReduceMotion = useReducedMotion();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [status, setStatus] = useState<"" | TicketStatus>("");
  const [priority, setPriority] = useState<"" | TicketPriority>("");
  const [sort, setSort] = useState<TicketSort>("updatedAt.desc");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editTicketId, setEditTicketId] = useState<string | null>(null);
  const [editModalContentEl, setEditModalContentEl] = useState<HTMLDivElement | null>(null);
  const editModalContentRef = useCallback((el: HTMLDivElement | null) => setEditModalContentEl(el), []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedQuery(query.trim());
      setPage(1);
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [query]);

  const params = useMemo(
    () => ({
      query: debouncedQuery || undefined,
      status: status || undefined,
      priority: priority || undefined,
      sort,
      page,
      pageSize,
    }),
    [debouncedQuery, page, pageSize, priority, sort, status],
  );

  const { data, isLoading, isFetching, isError, error } = useTicketsListQuery(params);
  const createTicketMutation = useCreateTicketMutation();
  const updateTicketMutation = useUpdateTicketMutation();
  const editTicketQuery = useTicketDetailQuery(editTicketId ?? "");
  const items = data?.items ?? [];

  const onResetFilters = () => {
    setQuery("");
    setDebouncedQuery("");
    setStatus("");
    setPriority("");
    setSort("updatedAt.desc");
    setPageSize(10);
    setPage(1);
  };

  const canGoPrev = page > 1;
  const canGoNext = page < (data?.totalPages ?? 1);

  const onCreateSubmit = async (values: TicketFormValues) => {
    await createTicketMutation.mutateAsync(values);
    toast.success("Ticket creado correctamente.");
    setIsCreateOpen(false);
  };

  const onEditSubmit = async (values: TicketFormValues) => {
    if (!editTicketId) return;
    if (!editTicketQuery.data?.updatedAt) return;

    try {
      await updateTicketMutation.mutateAsync({
        id: editTicketId,
        payload: values,
        expectedUpdatedAt: editTicketQuery.data.updatedAt,
      });
      toast.success("Ticket actualizado correctamente.");
      setEditTicketId(null);
    } catch (error) {
      if (isTicketConflictError(error)) {
        toast.error("Conflicto de edicion: el ticket cambio en el servidor. Recargamos la version actual.");
        await editTicketQuery.refetch();
        return;
      }
      toast.error("No fue posible actualizar el ticket.");
    }
  };

  return (
    <section className="flex h-full min-h-0 flex-col gap-3 sm:gap-4">
      <motion.div
        initial={shouldReduceMotion ? undefined : { opacity: 0, y: 12 }}
        animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={shouldReduceMotion ? undefined : { duration: 0.32, delay: 0.05, ease: "easeOut" }}
      >
        <TicketFilters
          query={query}
          status={status}
          priority={priority}
          sort={sort}
          onQueryChange={setQuery}
          onStatusChange={(value) => {
            setStatus(value);
            setPage(1);
          }}
          onPriorityChange={(value) => {
            setPriority(value);
            setPage(1);
          }}
          onSortChange={(value) => {
            setSort(value);
            setPage(1);
          }}
          onReset={onResetFilters}
          onCreateTicket={() => setIsCreateOpen(true)}
        />
      </motion.div>

      <div className="min-h-0 flex-1 flex flex-col gap-3">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="tickets-loading"
              initial={shouldReduceMotion ? undefined : { opacity: 0 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0 }}
            >
              <TicketsSkeleton />
            </motion.div>
          ) : null}

          {isError ? (
            <motion.div
              key="tickets-error"
              initial={shouldReduceMotion ? undefined : { opacity: 0, y: 8 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, y: -8 }}
              className="rounded border border-rose-300/35 bg-rose-950/30 p-4 text-sm text-rose-200"
            >
              Error al cargar tickets: {error instanceof Error ? error.message : "Error desconocido"}
            </motion.div>
          ) : null}

          {!isLoading && !isError && items.length === 0 ? (
            <motion.div
              key="tickets-empty"
              initial={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.98 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.98 }}
            >
              <Card className="rounded border-white/10 bg-slate-900/45 p-8 text-center">
                <CardContent className="space-y-2">
                  <SearchX className="mx-auto text-slate-300" size={20} />
                  <p className="text-sm font-medium text-slate-100">
                    No hay tickets para los filtros seleccionados.
                  </p>
                  <p className="text-sm text-slate-300">Prueba limpiar filtros o crear un nuevo ticket.</p>
                </CardContent>
              </Card>
            </motion.div>
          ) : null}

          {!isLoading && !isError && items.length > 0 ? (
            <motion.div
              key="tickets-list"
              initial={shouldReduceMotion ? undefined : { opacity: 0, y: 8 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0 }}
              transition={shouldReduceMotion ? undefined : { duration: 0.2 }}
              className="min-h-0 flex-1"
            >
              <TicketsMobileList
                items={items}
                onSelectTicket={(id) => setSelectedTicketId(id)}
                className="h-full scrollbar-indrox"
              />
              <TicketsTable
                items={items}
                onSelectTicket={(id) => setSelectedTicketId(id)}
                className="h-full scrollbar-indrox"
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
        <motion.footer
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 10 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={shouldReduceMotion ? undefined : { duration: 0.25, delay: 0.08 }}
          className="flex shrink-0 flex-col gap-3 rounded border border-white/10 bg-slate-900/45 px-4 py-3 backdrop-blur-xl md:flex-row md:items-center md:justify-between"
        >
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300">Filas por pagina</span>
              <span className="inline-flex rounded border border-white/20 bg-white/5 overflow-hidden">
                {([5, 10, 20] as const).map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => {
                      setPageSize(size);
                      setPage(1);
                    }}
                    className={`min-w-9 px-2.5 py-1.5 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-inset ${
                      pageSize === size
                        ? "bg-brand-500 text-white"
                        : "text-slate-300 hover:bg-white/10"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Pagina {data?.page ?? page} de {data?.totalPages ?? 1} | {data?.total ?? 0} resultado(s)
              {isFetching ? " actualizando..." : ""}
            </p>
          </div>
          <div className="flex items-center gap-1 self-end md:self-center">
            <button
              type="button"
              onClick={() => setPage((prev) => prev - 1)}
              disabled={!canGoPrev}
              aria-label="Pagina anterior"
              className="inline-flex h-9 w-9 items-center justify-center rounded border border-white/20 bg-white/5 text-slate-300 transition hover:bg-white/10 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => setPage((prev) => prev + 1)}
              disabled={!canGoNext}
              aria-label="Pagina siguiente"
              className="inline-flex h-9 w-9 items-center justify-center rounded border border-white/20 bg-white/5 text-slate-300 transition hover:bg-white/10 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </motion.footer>
      </div>

      {selectedTicketId ? (
        <TicketDetailDialog
          ticketId={selectedTicketId}
          open={Boolean(selectedTicketId)}
          onOpenChange={(open) => {
            if (!open) setSelectedTicketId(null);
          }}
          onEdit={(ticketId) => setEditTicketId(ticketId)}
        />
      ) : null}

      <Dialog.Root open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <AnimatePresence>
          {isCreateOpen ? (
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild forceMount>
                <motion.div
                  initial={shouldReduceMotion ? undefined : { opacity: 0 }}
                  animate={shouldReduceMotion ? undefined : { opacity: 1 }}
                  exit={shouldReduceMotion ? undefined : { opacity: 0 }}
                  className="fixed inset-0 z-40 bg-slate-950/75 backdrop-blur-sm"
                />
              </Dialog.Overlay>
              <Dialog.Content asChild forceMount>
                <motion.div
                  initial={shouldReduceMotion ? undefined : { opacity: 0 }}
                  animate={shouldReduceMotion ? undefined : { opacity: 1 }}
                  exit={shouldReduceMotion ? undefined : { opacity: 0 }}
                  className="fixed inset-0 z-50 grid place-items-center p-3"
                >
                  <motion.div
                    initial={shouldReduceMotion ? undefined : { opacity: 0, y: 12, scale: 0.98 }}
                    animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
                    exit={shouldReduceMotion ? undefined : { opacity: 0, y: 12, scale: 0.98 }}
                    className="scrollbar-indrox max-h-[90dvh] w-full max-w-3xl overflow-y-auto rounded border border-white/10 bg-slate-900 p-4 shadow-2xl outline-none sm:p-6"
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <Dialog.Title className="text-base font-semibold text-slate-100 sm:text-lg">
                        Crear nuevo ticket
                      </Dialog.Title>
                      <Dialog.Close asChild>
                        <button
                          type="button"
                          className="inline-flex h-8 w-8 items-center justify-center rounded text-slate-300 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
                          aria-label="Cerrar modal de nuevo ticket"
                        >
                          <X size={16} />
                        </button>
                      </Dialog.Close>
                    </div>
                    <TicketForm
                      title=""
                      submitLabel="Crear ticket"
                      isSubmitting={createTicketMutation.isPending}
                      onSubmit={onCreateSubmit}
                    />
                  </motion.div>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          ) : null}
        </AnimatePresence>
      </Dialog.Root>

      <Dialog.Root open={Boolean(editTicketId)} onOpenChange={(open) => !open && setEditTicketId(null)}>
        <AnimatePresence>
          {editTicketId ? (
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild forceMount>
                <motion.div
                  initial={shouldReduceMotion ? undefined : { opacity: 0 }}
                  animate={shouldReduceMotion ? undefined : { opacity: 1 }}
                  exit={shouldReduceMotion ? undefined : { opacity: 0 }}
                  className="fixed inset-0 z-40 bg-slate-950/75 backdrop-blur-sm"
                />
              </Dialog.Overlay>
              <Dialog.Content asChild forceMount>
                <motion.div
                  initial={shouldReduceMotion ? undefined : { opacity: 0 }}
                  animate={shouldReduceMotion ? undefined : { opacity: 1 }}
                  exit={shouldReduceMotion ? undefined : { opacity: 0 }}
                  className="fixed inset-0 z-50 grid place-items-center p-3"
                >
                  <motion.div
                    ref={editModalContentRef}
                    initial={shouldReduceMotion ? undefined : { opacity: 0, y: 12, scale: 0.98 }}
                    animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
                    exit={shouldReduceMotion ? undefined : { opacity: 0, y: 12, scale: 0.98 }}
                    className="relative scrollbar-indrox max-h-[90dvh] w-full max-w-3xl overflow-y-auto rounded border border-white/10 bg-slate-900 p-4 shadow-2xl outline-none sm:p-6"
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <Dialog.Title className="text-base font-semibold text-slate-100 sm:text-lg">
                        Editar ticket
                      </Dialog.Title>
                      <Dialog.Close asChild>
                        <button
                          type="button"
                          className="inline-flex h-8 w-8 items-center justify-center rounded text-slate-300 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
                          aria-label="Cerrar modal de edicion"
                        >
                          <X size={16} />
                        </button>
                      </Dialog.Close>
                    </div>
                    {editTicketQuery.isLoading ? <p className="text-sm text-slate-300">Cargando ticket...</p> : null}
                    {editTicketQuery.isError ? (
                      <p className="rounded border border-rose-300/35 bg-rose-950/30 p-3 text-sm text-rose-200">
                        No fue posible cargar el ticket para editar.
                      </p>
                    ) : null}
                    {editTicketQuery.data ? (
                      <TicketForm
                        title=""
                        submitLabel="Guardar cambios"
                        canEditStatus
                        isSubmitting={updateTicketMutation.isPending}
                        initialValues={{
                          title: editTicketQuery.data.title,
                          description: editTicketQuery.data.description,
                          priority: editTicketQuery.data.priority,
                          status: editTicketQuery.data.status,
                          requester: editTicketQuery.data.requester,
                          tags: editTicketQuery.data.tags,
                        }}
                        onSubmit={onEditSubmit}
                        statusSelectPortalContainer={editModalContentEl}
                      />
                    ) : null}
                  </motion.div>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          ) : null}
        </AnimatePresence>
      </Dialog.Root>
    </section>
  );
}
