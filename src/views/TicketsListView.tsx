import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { PlusCircle, SearchX, TicketIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button, Card, CardContent, SelectAria } from "../components/sui";
import { TicketFilters, TicketsMobileList, TicketsSkeleton, TicketsTable } from "../components/tickets";
import { useTicketDetailQuery, useTicketsListQuery } from "../querys";
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
  const [selectedTicketId, setSelectedTicketId] = useState<string>("");

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
  const detailQuery = useTicketDetailQuery(selectedTicketId);

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

  return (
    <section className="space-y-4">
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
        <Link
          to="/app/tickets/new"
          className="inline-flex h-10 items-center justify-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
        >
          <PlusCircle size={16} className="mr-2" />
          Nuevo ticket
        </Link>
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
            className="space-y-3"
          >
            <TicketsMobileList items={items} onSelectTicket={setSelectedTicketId} />
            <TicketsTable items={items} onSelectTicket={setSelectedTicketId} />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.footer
        initial={shouldReduceMotion ? undefined : { opacity: 0, y: 10 }}
        animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={shouldReduceMotion ? undefined : { duration: 0.25, delay: 0.08 }}
        className="flex flex-col gap-3 rounded-xl border border-white/10 bg-slate-900/45 px-4 py-3 backdrop-blur-xl md:flex-row md:items-end md:justify-between"
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

      {selectedTicketId ? (
        <motion.aside
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 12 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={shouldReduceMotion ? undefined : { duration: 0.24, ease: "easeOut" }}
          className="rounded-xl border border-white/10 bg-slate-900/45 p-4 backdrop-blur-xl"
        >
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Detalle rapido</h3>
          {detailQuery.isLoading ? (
            <p className="mt-2 text-sm text-slate-300">Cargando ticket...</p>
          ) : detailQuery.isError ? (
            <p className="mt-2 text-sm text-rose-200">No se pudo cargar el detalle.</p>
          ) : detailQuery.data ? (
            <div className="mt-2 space-y-1 text-sm text-slate-200">
              <p className="font-semibold text-slate-50">{detailQuery.data.title}</p>
              <p>{detailQuery.data.description}</p>
              <p>
                <span className="font-medium">Solicitante:</span> {detailQuery.data.requester.email}
              </p>
            </div>
          ) : null}
        </motion.aside>
      ) : null}
    </section>
  );
}
