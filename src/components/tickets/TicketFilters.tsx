import { motion, useReducedMotion } from "framer-motion";
import { Brush, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useSidebar } from "../../contexts/SidebarContext";
import { Input, Label, SelectAria } from "../sui";
import type { TicketPriority, TicketSort, TicketStatus } from "../../types";

const MD_BREAKPOINT = 768;

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < MD_BREAKPOINT
  );
  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MD_BREAKPOINT - 1}px)`);
    const handler = () => setIsMobile(mql.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);
  return isMobile;
}

interface TicketFiltersProps {
  query: string;
  status: "" | TicketStatus;
  priority: "" | TicketPriority;
  sort: TicketSort;
  onQueryChange: (value: string) => void;
  onStatusChange: (value: "" | TicketStatus) => void;
  onPriorityChange: (value: "" | TicketPriority) => void;
  onSortChange: (value: TicketSort) => void;
  onReset: () => void;
  onCreateTicket?: () => void;
}

const inputHeightClass = "h-9";

export function TicketFilters({
  query,
  status,
  priority,
  sort,
  onQueryChange,
  onStatusChange,
  onPriorityChange,
  onSortChange,
  onReset,
  onCreateTicket,
}: TicketFiltersProps) {
  const { sidebarExpanded } = useSidebar();
  const shouldReduceMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const statusOptions = [
    { id: "", label: "Todos" },
    { id: "OPEN", label: "OPEN" },
    { id: "IN_PROGRESS", label: "IN_PROGRESS" },
    { id: "RESOLVED", label: "RESOLVED" },
    { id: "CLOSED", label: "CLOSED" },
  ];

  const priorityOptions = [
    { id: "", label: "Todas" },
    { id: "LOW", label: "LOW" },
    { id: "MEDIUM", label: "MEDIUM" },
    { id: "HIGH", label: "HIGH" },
  ];

  const sortOptions = [
    { id: "updatedAt.desc", label: "Actualizados recientes" },
    { id: "updatedAt.asc", label: "Actualizados antiguos" },
  ];

  const filterFieldClass = "min-w-0 flex-1 basis-0";
  const hasActiveFilters = query.trim() !== "" || status !== "" || priority !== "";

  return (
    <div className="w-full rounded border border-white/10 bg-slate-900/45 p-3 backdrop-blur-xl">
      {/* Móvil: dos bloques. Desktop: una sola fila flex-wrap */}
      <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-end md:gap-3">
        {/* Bloque 1 móvil / primera parte desktop: Buscar + Añadir ticket */}
        <div className="flex items-end gap-2 md:contents md:gap-3">
          <div className={`${filterFieldClass} md:order-0`}>
            <Label htmlFor="ticket-query" className="text-xs">Buscar</Label>
            <Input
              id="ticket-query"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Titulo, codigo o email"
              className={`mt-1 w-full rounded ${inputHeightClass}`}
            />
          </div>
          {onCreateTicket ? (
            <motion.button
              type="button"
              onClick={onCreateTicket}
              aria-label="Añadir ticket"
              className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded bg-brand-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 md:order-5 ${inputHeightClass}`}
              animate={{
                maxWidth: shouldReduceMotion ? undefined : isMobile ? 40 : sidebarExpanded ? 40 : 140,
                paddingLeft: isMobile ? 10 : sidebarExpanded ? 10 : 12,
                paddingRight: isMobile ? 10 : sidebarExpanded ? 10 : 12,
              }}
              transition={{ type: "tween", duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <motion.span
                className="inline-flex shrink-0"
                animate={
                  shouldReduceMotion ? {} : { marginRight: isMobile ? 0 : sidebarExpanded ? 0 : 6 }
                }
                transition={{ type: "tween", duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <PlusCircle size={14} aria-hidden />
              </motion.span>
              <motion.span
                className="hidden overflow-hidden whitespace-nowrap md:inline"
                initial={false}
                animate={
                  shouldReduceMotion || isMobile
                    ? { opacity: 0, maxWidth: 0 }
                    : { opacity: sidebarExpanded ? 0 : 1, maxWidth: sidebarExpanded ? 0 : 120 }
                }
                transition={{ type: "tween", duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              >
                Añadir ticket
              </motion.span>
            </motion.button>
          ) : null}
        </div>
        {/* Bloque 2 móvil: Estado, Prioridad, Orden en grid 3 columnas + limpiar */}
        <div className="grid grid-cols-[1fr_1fr_1fr_auto] items-end gap-2 md:contents md:gap-3">
          <div className={`min-w-0 md:order-1 ${filterFieldClass}`}>
            <SelectAria
              id="ticket-status"
              label="Estado"
              selectedKey={status}
              options={statusOptions}
              onSelectionChange={(value) => onStatusChange(value as "" | TicketStatus)}
              buttonClassName={`w-full min-w-0 rounded ${inputHeightClass}`}
            />
          </div>
          <div className={`min-w-0 md:order-2 ${filterFieldClass}`}>
            <SelectAria
              id="ticket-priority"
              label="Prioridad"
              selectedKey={priority}
              options={priorityOptions}
              onSelectionChange={(value) => onPriorityChange(value as "" | TicketPriority)}
              buttonClassName={`w-full min-w-0 rounded ${inputHeightClass}`}
            />
          </div>
          <div className={`min-w-0 md:order-3 ${filterFieldClass}`}>
            <SelectAria
              id="ticket-sort"
              label="Orden"
              selectedKey={sort}
              options={sortOptions}
              onSelectionChange={(value) => onSortChange(value as TicketSort)}
              buttonClassName={`w-full min-w-0 rounded ${inputHeightClass}`}
            />
          </div>
          <motion.button
            type="button"
            onClick={onReset}
            aria-label="Limpiar filtros"
            className={`inline-flex shrink-0 items-center justify-center rounded border transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 md:order-4 ${inputHeightClass} px-2.5 ${
              hasActiveFilters
                ? "border-orange-400/60 bg-orange-500/90 text-white hover:bg-orange-500"
                : "border-white/20 bg-white/5 text-slate-200 hover:bg-white/10"
            }`}
            animate={
              hasActiveFilters && !shouldReduceMotion
                ? {
                    boxShadow: [
                      "0 0 0 0 rgba(249, 115, 22, 0)",
                      "0 0 0 6px rgba(249, 115, 22, 0.15)",
                      "0 0 0 0 rgba(249, 115, 22, 0)",
                    ],
                  }
                : { boxShadow: "0 0 0 0 transparent" }
            }
            transition={
              hasActiveFilters && !shouldReduceMotion
                ? { boxShadow: { duration: 1.5, repeat: Infinity, ease: "easeInOut" } }
                : { boxShadow: { duration: 0.15 } }
            }
          >
            <Brush size={16} aria-hidden />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
