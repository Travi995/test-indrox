import { motion, useReducedMotion } from "framer-motion";
import type { Ticket } from "../../interfaces";

interface TicketsMobileListProps {
  items: Ticket[];
  onSelectTicket: (id: string) => void;
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

export function TicketsMobileList({ items, onSelectTicket }: TicketsMobileListProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="grid grid-cols-1 gap-3 md:hidden">
      {items.map((ticket, index) => (
        <motion.button
          key={ticket.id}
          type="button"
          onClick={() => onSelectTicket(ticket.id)}
          className="rounded-xl border border-white/10 bg-slate-900/45 p-4 text-left backdrop-blur-xl transition hover:border-brand-300/60 hover:bg-slate-900/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 8 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={shouldReduceMotion ? undefined : { duration: 0.18, delay: index * 0.02 }}
        >
          <p className="text-xs font-semibold text-slate-300">{ticket.code}</p>
          <p className="mt-1 line-clamp-2 text-sm font-medium text-slate-100">{ticket.title}</p>
          <p className="mt-2 text-xs text-slate-300">{ticket.requester.email}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusClass(ticket.status)}`}>
              {ticket.status}
            </span>
            <span
              className={`rounded-full px-2 py-1 text-xs font-medium ${getPriorityClass(ticket.priority)}`}
            >
              {ticket.priority}
            </span>
            <span className="ml-auto text-xs text-slate-400">
              {new Date(ticket.updatedAt).toLocaleDateString("es-ES")}
            </span>
          </div>
        </motion.button>
      ))}
    </div>
  );
}
