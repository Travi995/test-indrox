import { useCallback, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CircleAlert, Pencil, X } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "../sui";
import { TicketStatusSelect } from "./TicketStatusSelect";
import { useTicketDetailQuery, useUpdateTicketMutation } from "../../querys";
import type { TicketStatus } from "../../types";

interface TicketDetailDialogProps {
  ticketId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (ticketId: string) => void;
}

export function TicketDetailDialog({ ticketId, open, onOpenChange, onEdit }: TicketDetailDialogProps) {
  const shouldReduceMotion = useReducedMotion();
  const [modalContentEl, setModalContentEl] = useState<HTMLDivElement | null>(null);
  const modalContentRef = useCallback((el: HTMLDivElement | null) => setModalContentEl(el), []);
  const detailQuery = useTicketDetailQuery(ticketId);
  const updateTicketMutation = useUpdateTicketMutation();

  const onChangeStatus = async (nextStatus: string) => {
    if (!detailQuery.data || updateTicketMutation.isPending) return;
    if (nextStatus === detailQuery.data.status) return;

    const ticket = detailQuery.data;
    try {
      await updateTicketMutation.mutateAsync({
        id: ticket.id,
        expectedUpdatedAt: ticket.updatedAt,
        payload: {
          title: ticket.title,
          description: ticket.description,
          priority: ticket.priority,
          status: nextStatus as TicketStatus,
          requester: ticket.requester,
          tags: ticket.tags,
        },
      });
      toast.success("Ticket actualizado.");
    } catch {
      toast.error("No se pudo actualizar el estado del ticket.");
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open ? (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                initial={shouldReduceMotion ? undefined : { opacity: 0 }}
                animate={shouldReduceMotion ? undefined : { opacity: 1 }}
                exit={shouldReduceMotion ? undefined : { opacity: 0 }}
                transition={shouldReduceMotion ? undefined : { duration: 0.2 }}
                className="fixed inset-0 z-40 bg-slate-950/75 backdrop-blur-sm"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild forceMount>
              <motion.div
                initial={shouldReduceMotion ? undefined : { opacity: 0 }}
                animate={shouldReduceMotion ? undefined : { opacity: 1 }}
                exit={shouldReduceMotion ? undefined : { opacity: 0 }}
                transition={shouldReduceMotion ? undefined : { duration: 0.2, ease: "easeOut" }}
                className="fixed inset-0 z-50 grid place-items-center p-3"
              >
                <motion.div
                  ref={modalContentRef}
                  initial={shouldReduceMotion ? undefined : { opacity: 0, y: 12, scale: 0.98 }}
                  animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
                  exit={shouldReduceMotion ? undefined : { opacity: 0, y: 12, scale: 0.98 }}
                  transition={shouldReduceMotion ? undefined : { duration: 0.22, ease: "easeOut" }}
                  className="relative max-h-[90dvh] w-full max-w-2xl overflow-y-auto rounded border border-white/10 bg-slate-900 p-4 shadow-2xl outline-none sm:p-6"
                >
                <header className="flex items-start justify-between gap-3 border-b border-white/10 pb-4">
                  <div>
                    <Dialog.Title className="text-base font-semibold text-slate-100 sm:text-lg">
                      Detalle del ticket
                    </Dialog.Title>
                    <Dialog.Description className="text-sm text-slate-300">
                      Revisa la informacion y actualiza el estado si lo necesitas.
                    </Dialog.Description>
                  </div>
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded text-slate-300 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
                      aria-label="Cerrar detalle"
                    >
                      <X size={16} />
                    </button>
                  </Dialog.Close>
                </header>

                {detailQuery.isLoading ? (
                  <p className="mt-5 text-sm text-slate-300">Cargando ticket...</p>
                ) : detailQuery.isError ? (
                  <div className="mt-5 flex items-start gap-2 rounded border border-rose-300/35 bg-rose-950/30 p-3 text-sm text-rose-200">
                    <CircleAlert size={16} className="mt-0.5 shrink-0" />
                    No se pudo cargar el detalle del ticket.
                  </div>
                ) : detailQuery.data ? (
                  <div className="mt-5 flex flex-col gap-4">
                    <section
                      className="flex max-h-[40vh] min-h-0 flex-col overflow-hidden rounded border border-white/10 bg-slate-950/30"
                      aria-labelledby="ticket-detail-heading"
                    >
                      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 px-3 py-2">
                        <span className="rounded border border-brand-300/35 bg-brand-500/20 px-2.5 py-1 text-xs font-medium text-brand-100">
                          {detailQuery.data.code}
                        </span>
                        <span className="rounded border border-white/20 bg-white/5 px-2.5 py-1 text-xs text-slate-200">
                          {detailQuery.data.priority}
                        </span>
                        <span className="rounded border border-white/20 bg-white/5 px-2.5 py-1 text-xs text-slate-200">
                          {detailQuery.data.status}
                        </span>
                      </div>
                      <div id="ticket-detail-heading" className="flex-1 overflow-y-auto px-3 py-3">
                        <h2 className="text-lg font-semibold text-slate-100">{detailQuery.data.title}</h2>
                        <p className="mt-2 text-sm leading-relaxed text-slate-300">
                          {detailQuery.data.description}
                        </p>
                      </div>
                    </section>

                    <section className="rounded border border-white/10 bg-slate-950/30 p-3" aria-label="Datos del ticket">
                      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Datos
                      </h3>
                      <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                        <div>
                          <dt className="font-medium text-slate-100">Solicitante</dt>
                          <dd className="text-slate-300">{detailQuery.data.requester.name}</dd>
                        </div>
                        <div>
                          <dt className="font-medium text-slate-100">Email</dt>
                          <dd className="text-slate-300">{detailQuery.data.requester.email}</dd>
                        </div>
                        <div>
                          <dt className="font-medium text-slate-100">Creado</dt>
                          <dd className="text-slate-300">
                            {new Date(detailQuery.data.createdAt).toLocaleString("es-ES")}
                          </dd>
                        </div>
                        <div>
                          <dt className="font-medium text-slate-100">Actualizado</dt>
                          <dd className="text-slate-300">
                            {new Date(detailQuery.data.updatedAt).toLocaleString("es-ES")}
                          </dd>
                        </div>
                      </dl>
                    </section>

                    <section className="rounded border border-white/10 bg-slate-950/30 p-3" aria-label="Etiquetas">
                      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Etiquetas
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {detailQuery.data.tags.length ? (
                          detailQuery.data.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded border border-brand-300/30 bg-brand-500/15 px-2.5 py-1 text-xs text-brand-100"
                            >
                              {tag}
                            </span>
                          ))
                        ) : (
                          <p className="text-sm text-slate-400">Sin etiquetas.</p>
                        )}
                      </div>
                    </section>

                    <section
                      className="flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-end sm:justify-between"
                      aria-label="Acciones"
                    >
                      <TicketStatusSelect
                        id="ticket-detail-status"
                        label="Cambiar estado"
                        selectedKey={detailQuery.data.status}
                        onSelectionChange={onChangeStatus}
                        portalContainer={modalContentEl ?? undefined}
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        className="w-full sm:w-auto"
                        onClick={() => {
                          onOpenChange(false);
                          onEdit(detailQuery.data!.id);
                        }}
                      >
                        <Pencil size={16} className="mr-2" />
                        Editar
                      </Button>
                    </section>
                  </div>
                ) : null}
                </motion.div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        ) : null}
      </AnimatePresence>
    </Dialog.Root>
  );
}
