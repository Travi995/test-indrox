import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CircleAlert, Pencil, X } from "lucide-react";
import { Button, SelectAria } from "../sui";
import { usePatchTicketStatusMutation, useTicketDetailQuery } from "../../querys";
import type { TicketStatus } from "../../types";

interface TicketDetailDialogProps {
  ticketId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (ticketId: string) => void;
}

const statusOptions: Array<{ id: TicketStatus; label: string }> = [
  { id: "OPEN", label: "OPEN" },
  { id: "IN_PROGRESS", label: "IN_PROGRESS" },
  { id: "RESOLVED", label: "RESOLVED" },
  { id: "CLOSED", label: "CLOSED" },
];

export function TicketDetailDialog({ ticketId, open, onOpenChange, onEdit }: TicketDetailDialogProps) {
  const shouldReduceMotion = useReducedMotion();
  const detailQuery = useTicketDetailQuery(ticketId);
  const patchStatusMutation = usePatchTicketStatusMutation();

  const onChangeStatus = async (nextStatus: string) => {
    if (!detailQuery.data || patchStatusMutation.isPending) return;
    const currentStatus = detailQuery.data.status;
    if (nextStatus === currentStatus) return;

    const confirmed = window.confirm(
      `Vas a cambiar el estado de ${detailQuery.data.code} de ${currentStatus} a ${nextStatus}.`,
    );
    if (!confirmed) return;

    await patchStatusMutation.mutateAsync({
      id: detailQuery.data.id,
      status: nextStatus as TicketStatus,
    });
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
                  initial={shouldReduceMotion ? undefined : { opacity: 0, y: 12, scale: 0.98 }}
                  animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
                  exit={shouldReduceMotion ? undefined : { opacity: 0, y: 12, scale: 0.98 }}
                  transition={shouldReduceMotion ? undefined : { duration: 0.22, ease: "easeOut" }}
                  className="max-h-[90dvh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-slate-900 p-4 shadow-2xl outline-none sm:p-6"
                >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Dialog.Title className="text-base font-semibold text-slate-100 sm:text-lg">
                      Detalle del ticket
                    </Dialog.Title>
                    <Dialog.Description className="text-sm text-slate-300">
                      Revisa la informacion completa y actualiza el estado.
                    </Dialog.Description>
                  </div>
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-300 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
                      aria-label="Cerrar detalle"
                    >
                      <X size={16} />
                    </button>
                  </Dialog.Close>
                </div>

                {detailQuery.isLoading ? (
                  <p className="mt-5 text-sm text-slate-300">Cargando ticket...</p>
                ) : detailQuery.isError ? (
                  <div className="mt-5 flex items-start gap-2 rounded-lg border border-rose-300/35 bg-rose-950/30 p-3 text-sm text-rose-200">
                    <CircleAlert size={16} className="mt-0.5 shrink-0" />
                    No se pudo cargar el detalle del ticket.
                  </div>
                ) : detailQuery.data ? (
                  <div className="mt-5 space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-brand-300/35 bg-brand-500/20 px-2.5 py-1 text-xs font-medium text-brand-100">
                        {detailQuery.data.code}
                      </span>
                      <span className="rounded-full border border-white/20 bg-white/5 px-2.5 py-1 text-xs text-slate-200">
                        {detailQuery.data.priority}
                      </span>
                      <span className="rounded-full border border-white/20 bg-white/5 px-2.5 py-1 text-xs text-slate-200">
                        {detailQuery.data.status}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-slate-100">{detailQuery.data.title}</h4>
                      <p className="mt-1 text-sm text-slate-300">{detailQuery.data.description}</p>
                    </div>

                    <div className="grid grid-cols-1 gap-3 rounded-xl border border-white/10 bg-slate-950/45 p-3 text-sm text-slate-200 sm:grid-cols-2">
                      <p>
                        <span className="font-medium text-slate-100">Solicitante:</span> {detailQuery.data.requester.name}
                      </p>
                      <p>
                        <span className="font-medium text-slate-100">Email:</span> {detailQuery.data.requester.email}
                      </p>
                      <p>
                        <span className="font-medium text-slate-100">Creado:</span>{" "}
                        {new Date(detailQuery.data.createdAt).toLocaleString("es-ES")}
                      </p>
                      <p>
                        <span className="font-medium text-slate-100">Actualizado:</span>{" "}
                        {new Date(detailQuery.data.updatedAt).toLocaleString("es-ES")}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-slate-100">Etiquetas</p>
                      <div className="flex flex-wrap gap-2">
                        {detailQuery.data.tags.length ? (
                          detailQuery.data.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full border border-brand-300/30 bg-brand-500/15 px-2.5 py-1 text-xs text-brand-100"
                            >
                              {tag}
                            </span>
                          ))
                        ) : (
                          <p className="text-sm text-slate-400">Sin etiquetas.</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
                      <SelectAria
                        id="ticket-detail-status"
                        label="Cambiar estado"
                        selectedKey={detailQuery.data.status}
                        options={statusOptions}
                        onSelectionChange={onChangeStatus}
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
                    </div>
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
