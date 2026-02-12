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

function getPriorityOutlineClass(priority: Ticket["priority"]) {
  if (priority === "HIGH") return "border border-rose-400/70 text-rose-300 bg-rose-500/10";
  if (priority === "MEDIUM") return "border border-orange-400/70 text-orange-300 bg-orange-500/10";
  return "border border-slate-500/60 text-slate-400 bg-white/5";
}

export function TicketsTable({ items, onSelectTicket, className }: TicketsTableProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={`hidden h-full overflow-auto rounded border border-white/10 bg-slate-900/45 backdrop-blur-xl md:block ${className ?? ""}`}
      initial={shouldReduceMotion ? undefined : { opacity: 0, y: 10 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={shouldReduceMotion ? undefined : { duration: 0.22 }}
    >
      <table className="min-w-full divide-y divide-white/10">
        <thead className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur">
          <tr>
            <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-300">
              Codigo
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-300">
              Titulo
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-300">
              Solicitante
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-300">
              Prioridad
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-300">
              Estado
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-300">
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
              <td className="px-4 py-3 text-sm text-slate-300">{ticket.requester.email}</td>
              <td className="px-4 py-3 text-sm">
                <span
                  className={`rounded px-2 py-1 text-xs font-medium ${getPriorityOutlineClass(ticket.priority)}`}
                >
                  {ticket.priority}
                </span>
              </td>
              <td className="px-4 py-3 text-sm">
                <span className={`rounded px-2 py-1 text-xs font-medium ${getStatusClass(ticket.status)}`}>
                  {ticket.status}
                </span>
              </td>
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
