import type { RefObject } from "react";
import { SelectAria } from "../sui";
import type { TicketStatus } from "../../types";

/**
 * Componente reutilizable para seleccionar o cambiar el estado del ticket.
 * Se usa en el modal de detalle del ticket y en el modal de edición (formulario de ticket).
 *
 * Se implementó con SelectAria (React Aria) porque el control anterior (input/select nativo)
 * daba problemas de z-index e interactividad dentro de modales: los clics no llegaban
 * a las opciones del desplegable ni se mostraba cursor pointer al pasar sobre ellas.
 */

const STATUS_OPTIONS: Array<{ id: TicketStatus; label: string }> = [
  { id: "OPEN", label: "OPEN" },
  { id: "IN_PROGRESS", label: "IN_PROGRESS" },
  { id: "RESOLVED", label: "RESOLVED" },
  { id: "CLOSED", label: "CLOSED" },
];

export interface TicketStatusSelectProps {
  id: string;
  label: string;
  selectedKey: string;
  onSelectionChange: (value: string) => void;
  /** Si true, solo se muestra la opción OPEN (ej. formulario de creación). */
  onlyOpenOption?: boolean;
  className?: string;
  buttonClassName?: string;
  /** Contenedor donde montar el popover (ej. contenido del modal). Evita que los clics no lleguen a las opciones. */
  portalContainer?: Element | RefObject<HTMLElement | null>;
}

export function TicketStatusSelect({
  id,
  label,
  selectedKey,
  onSelectionChange,
  onlyOpenOption = false,
  className,
  buttonClassName,
  portalContainer,
}: TicketStatusSelectProps) {
  const options = onlyOpenOption
    ? STATUS_OPTIONS.filter((o) => o.id === "OPEN")
    : STATUS_OPTIONS;

  return (
    <SelectAria
      id={id}
      label={label}
      selectedKey={selectedKey}
      options={options}
      onSelectionChange={onSelectionChange}
      className={className}
      buttonClassName={buttonClassName}
      portalContainer={portalContainer}
    />
  );
}
