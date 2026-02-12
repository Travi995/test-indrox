import { motion, useReducedMotion } from "framer-motion";
import type { Ticket } from "../../interfaces";
import { cn } from "../components-utilities";

interface TicketsTableProps {
  items: Ticket[];
  onSelectTicket: (id: string) => void;
  className?: string;
}

function getStatusClass(status: Ticket["status"]) {
  if (status === "OPEN") return "bg-amber-100 text-amber-800";
  if (status === "IN_PROGRESS") return "bg-blue-100 text-blue-800";
  if (status === "RESOLVED") return "bg-emerald-100 text-emerald-800";
  return "bg-slate-200 text-slate-700";
}

function getPriorityClass(priority: Ticket["priority"]) {
  if (priority === "HIGH") return "bg-rose-100 text-rose-800";
  if (priority === "MEDIUM") return "bg-orange-100 text-orange-800";
  return "bg-slate-200 text-slate-700";
}

export function TicketsTable({ items, onSelectTicket, className }: TicketsTableProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={`hidden h-full overflow-auto rounded-xl border border-white/10 bg-slate-900/45 backdrop-blur-xl md:block ${className ?? ""}`}
      initial={shouldReduceMotion ? undefined : { opacity: 0, y: 10 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={shouldReduceMotion ? undefined : { duration: 0.22 }}
    >
      <table className="min-w-full divide-y divide-white/10">
        <thead className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-300">
              Codigo
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-300">
              Titulo
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-300">
              Estado
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-300">
              Prioridad
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-300">
              Solicitante
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-300">
              Actualizado
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {items.map((ticket, index) => (
            <tr
              key={ticket.id}
              className={cn(
                "cursor-pointer transition hover:bg-white/10",
                index % 2 === 0 ? "bg-transparent" : "bg-white/[0.02]",
              )}
              onClick={() => onSelectTicket(ticket.id)}
            >
              <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-slate-200">{ticket.code}</td>
              <td className="px-4 py-3 text-sm text-slate-100">{ticket.title}</td>
              <td className="px-4 py-3 text-sm">
                <span className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusClass(ticket.status)}`}>
                  {ticket.status}
                </span>
              </td>
              <td className="px-4 py-3 text-sm">
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${getPriorityClass(ticket.priority)}`}
                >
                  {ticket.priority}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-slate-300">{ticket.requester.email}</td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-300">
                {new Date(ticket.updatedAt).toLocaleString("es-ES")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}
