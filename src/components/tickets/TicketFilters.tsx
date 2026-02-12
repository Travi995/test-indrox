import { Button, Input, Label, SelectAria } from "../sui";
import type { TicketPriority, TicketSort, TicketStatus } from "../../types";

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
}

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
}: TicketFiltersProps) {
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

  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/45 p-4 backdrop-blur-xl">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="md:col-span-2">
          <Label htmlFor="ticket-query">Buscar</Label>
          <Input
            id="ticket-query"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Titulo, codigo o email"
            className="mt-1"
          />
        </div>

        <div>
          <SelectAria
            id="ticket-status"
            label="Estado"
            selectedKey={status}
            options={statusOptions}
            onSelectionChange={(value) => onStatusChange(value as "" | TicketStatus)}
          />
        </div>

        <div>
          <SelectAria
            id="ticket-priority"
            label="Prioridad"
            selectedKey={priority}
            options={priorityOptions}
            onSelectionChange={(value) => onPriorityChange(value as "" | TicketPriority)}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-end gap-3">
        <div className="w-full sm:w-auto">
          <SelectAria
            id="ticket-sort"
            label="Orden"
            selectedKey={sort}
            options={sortOptions}
            onSelectionChange={(value) => onSortChange(value as TicketSort)}
            buttonClassName="sm:min-w-52"
          />
        </div>
        <Button type="button" variant="secondary" onClick={onReset} className="sm:ml-auto">
          Limpiar filtros
        </Button>
      </div>
    </div>
  );
}
