import { useEffect, useMemo, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { PlusCircle, SearchX, TicketIcon, X } from "lucide-react";
import toast from "react-hot-toast";
import { Button, Card, CardContent, SelectAria } from "../components/sui";
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
      <motion.header
        initial={shouldReduceMotion ? undefined : { opacity: 0, y: 10 }}
        animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={shouldReduceMotion ? undefined : { duration: 0.28, ease: "easeOut" }}
        className="flex flex-wrap items-center justify-between gap-3"
      >
        <div>
          <div className="inline-flex items-center gap-2 text-brand-200">
            <TicketIcon size={16} />
            <span className="text-xs font-semibold uppercase tracking-wide">Mesa de soporte</span>
          </div>
          <h2 className="mt-1 text-2xl font-semibold text-slate-100">Tickets</h2>
          <p className="mt-1 text-sm text-slate-300">Consulta y filtra tickets en tiempo real.</p>
        </div>
        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex h-10 items-center justify-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
        >
          <PlusCircle size={16} className="mr-2" />
          Nuevo ticket
        </button>
      </motion.header>

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
              className="rounded-xl border border-rose-300/35 bg-rose-950/30 p-4 text-sm text-rose-200"
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
              <Card className="border-white/10 bg-slate-900/45 p-8 text-center">
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
          className="flex shrink-0 flex-col gap-3 rounded-xl border border-white/10 bg-slate-900/45 px-4 py-3 backdrop-blur-xl md:flex-row md:items-end md:justify-between"
        >
          <div className="flex items-end gap-3">
            <div className="w-36">
              <SelectAria
                id="tickets-page-size"
                label="Filas por pagina"
                selectedKey={String(pageSize)}
                options={[
                  { id: "5", label: "5" },
                  { id: "10", label: "10" },
                  { id: "20", label: "20" },
                ]}
                onSelectionChange={(value) => {
                  setPageSize(Number(value));
                  setPage(1);
                }}
              />
            </div>
            <p className="pb-2 text-xs text-slate-300">
              Pagina {data?.page ?? page} de {data?.totalPages ?? 1} | {data?.total ?? 0} resultado(s)
              {isFetching ? " actualizando..." : ""}
            </p>
          </div>
          <div className="flex items-center gap-2 self-end">
            <Button type="button" variant="secondary" onClick={() => setPage((prev) => prev - 1)} disabled={!canGoPrev}>
              Anterior
            </Button>
            <Button type="button" onClick={() => setPage((prev) => prev + 1)} disabled={!canGoNext}>
              Siguiente
            </Button>
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
                    className="scrollbar-indrox max-h-[90dvh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-white/10 bg-slate-900 p-4 shadow-2xl outline-none sm:p-6"
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <Dialog.Title className="text-base font-semibold text-slate-100 sm:text-lg">
                        Nuevo ticket
                      </Dialog.Title>
                      <Dialog.Close asChild>
                        <button
                          type="button"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-300 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
                          aria-label="Cerrar modal de nuevo ticket"
                        >
                          <X size={16} />
                        </button>
                      </Dialog.Close>
                    </div>
                    <TicketForm
                      title="Nuevo ticket"
                      description="Completa los datos para crear el ticket."
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
                    initial={shouldReduceMotion ? undefined : { opacity: 0, y: 12, scale: 0.98 }}
                    animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
                    exit={shouldReduceMotion ? undefined : { opacity: 0, y: 12, scale: 0.98 }}
                    className="scrollbar-indrox max-h-[90dvh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-white/10 bg-slate-900 p-4 shadow-2xl outline-none sm:p-6"
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <Dialog.Title className="text-base font-semibold text-slate-100 sm:text-lg">
                        Editar ticket
                      </Dialog.Title>
                      <Dialog.Close asChild>
                        <button
                          type="button"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-300 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
                          aria-label="Cerrar modal de edicion"
                        >
                          <X size={16} />
                        </button>
                      </Dialog.Close>
                    </div>
                    {editTicketQuery.isLoading ? <p className="text-sm text-slate-300">Cargando ticket...</p> : null}
                    {editTicketQuery.isError ? (
                      <p className="rounded-lg border border-rose-300/35 bg-rose-950/30 p-3 text-sm text-rose-200">
                        No fue posible cargar el ticket para editar.
                      </p>
                    ) : null}
                    {editTicketQuery.data ? (
                      <TicketForm
                        title={`Editar ${editTicketQuery.data.code}`}
                        description="Actualiza los campos del ticket."
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
