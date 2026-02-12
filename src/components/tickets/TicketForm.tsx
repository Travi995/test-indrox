import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Label, SelectAria } from "../sui";
import { Input } from "../ui/input";
import type { Ticket, TicketPriority, TicketStatus } from "../../services";

const ticketFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "El titulo debe tener al menos 5 caracteres")
    .max(80, "El titulo debe tener maximo 80 caracteres")
    .refine((value) => !/^\d+$/.test(value.replace(/\s+/g, "")), "El titulo no puede contener solo numeros"),
  description: z.string().trim().min(20, "La descripcion debe tener al menos 20 caracteres"),
  requesterName: z.string().trim().min(2, "El nombre del solicitante es obligatorio"),
  requesterEmail: z.email("Ingresa un correo valido"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]),
  tags: z
    .array(z.object({ value: z.string().trim().min(1, "La etiqueta no puede estar vacia") }))
    .max(5, "Solo puedes agregar hasta 5 etiquetas")
    .refine((tags) => new Set(tags.map((tag) => tag.value.toLowerCase())).size === tags.length, {
      message: "No se permiten etiquetas duplicadas",
    }),
});

type TicketFormSchema = z.infer<typeof ticketFormSchema>;

export type TicketFormValues = Omit<Ticket, "id" | "code" | "createdAt" | "updatedAt">;

interface TicketFormProps {
  title: string;
  description?: string;
  submitLabel: string;
  initialValues?: Partial<TicketFormValues>;
  canEditStatus?: boolean;
  isSubmitting?: boolean;
  onSubmit: (values: TicketFormValues) => Promise<void> | void;
}

const priorityOptions: Array<{ id: TicketPriority; label: string }> = [
  { id: "LOW", label: "Baja" },
  { id: "MEDIUM", label: "Media" },
  { id: "HIGH", label: "Alta" },
];

const statusOptions: Array<{ id: TicketStatus; label: string }> = [
  { id: "OPEN", label: "OPEN" },
  { id: "IN_PROGRESS", label: "IN_PROGRESS" },
  { id: "RESOLVED", label: "RESOLVED" },
  { id: "CLOSED", label: "CLOSED" },
];

export function TicketForm({
  title,
  description,
  submitLabel,
  initialValues,
  canEditStatus = false,
  isSubmitting = false,
  onSubmit,
}: TicketFormProps) {
  const [tagInput, setTagInput] = useState("");
  const defaultValues = useMemo<TicketFormSchema>(
    () => ({
      title: initialValues?.title ?? "",
      description: initialValues?.description ?? "",
      requesterName: initialValues?.requester?.name ?? "",
      requesterEmail: initialValues?.requester?.email ?? "",
      priority: initialValues?.priority ?? "MEDIUM",
      status: initialValues?.status ?? "OPEN",
      tags: (initialValues?.tags ?? []).map((value) => ({ value })),
    }),
    [initialValues],
  );

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting: isFormSubmitting },
  } = useForm<TicketFormSchema>({
    resolver: zodResolver(ticketFormSchema),
    defaultValues,
  });

  const tagsFieldArray = useFieldArray({ control, name: "tags" });
  const tags = useWatch({ control, name: "tags" }) ?? [];
  const currentPriority = useWatch({ control, name: "priority" });
  const currentStatus = useWatch({ control, name: "status" });
  const enabledStatusOptions = canEditStatus ? statusOptions : statusOptions.filter((option) => option.id === "OPEN");

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (!trimmed || tags.length >= 5) return;
    tagsFieldArray.append({ value: trimmed });
    setTagInput("");
  };

  const submitHandler = async (values: TicketFormSchema) => {
    await onSubmit({
      title: values.title.trim(),
      description: values.description.trim(),
      priority: values.priority,
      status: values.status,
      requester: {
        name: values.requesterName.trim(),
        email: values.requesterEmail.trim(),
      },
      tags: values.tags.map((tag) => tag.value.trim()),
    });
  };

  return (
    <Card className="border-white/10 bg-slate-900/45 shadow-[0_24px_50px_-24px_rgba(2,6,23,0.9)]">
      <CardHeader>
        <CardTitle className="text-slate-100">{title}</CardTitle>
        {description ? <CardDescription className="text-slate-300">{description}</CardDescription> : null}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="ticket-title" className="text-slate-200">
              Titulo
            </Label>
            <Input
              id="ticket-title"
              placeholder="Ej: Error en carga de orden de compra"
              className="border-slate-500/70 bg-slate-950/50 text-slate-50 placeholder:text-slate-400 focus:border-brand-400 focus:ring-brand-300/30"
              {...register("title")}
            />
            {errors.title ? <p className="text-xs text-rose-300">{errors.title.message}</p> : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ticket-description" className="text-slate-200">
              Descripcion
            </Label>
            <textarea
              id="ticket-description"
              rows={5}
              placeholder="Describe el problema con el mayor contexto posible"
              className="mt-1 flex w-full rounded-lg border border-slate-500/70 bg-slate-950/50 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-400 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-300/30"
              {...register("description")}
            />
            {errors.description ? <p className="text-xs text-rose-300">{errors.description.message}</p> : null}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="ticket-requester-name" className="text-slate-200">
                Solicitante
              </Label>
              <Input
                id="ticket-requester-name"
                placeholder="Nombre y apellido"
                className="border-slate-500/70 bg-slate-950/50 text-slate-50 placeholder:text-slate-400 focus:border-brand-400 focus:ring-brand-300/30"
                {...register("requesterName")}
              />
              {errors.requesterName ? <p className="text-xs text-rose-300">{errors.requesterName.message}</p> : null}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ticket-requester-email" className="text-slate-200">
                Email solicitante
              </Label>
              <Input
                id="ticket-requester-email"
                type="email"
                placeholder="solicitante@empresa.com"
                className="border-slate-500/70 bg-slate-950/50 text-slate-50 placeholder:text-slate-400 focus:border-brand-400 focus:ring-brand-300/30"
                {...register("requesterEmail")}
              />
              {errors.requesterEmail ? <p className="text-xs text-rose-300">{errors.requesterEmail.message}</p> : null}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SelectAria
              id="ticket-priority-form"
              label="Prioridad"
              selectedKey={currentPriority ?? "MEDIUM"}
              options={priorityOptions}
              onSelectionChange={(value) => setValue("priority", value as TicketPriority, { shouldValidate: true })}
            />

            <SelectAria
              id="ticket-status-form"
              label="Estado"
              selectedKey={currentStatus ?? "OPEN"}
              options={enabledStatusOptions}
              onSelectionChange={(value) => setValue("status", value as TicketStatus, { shouldValidate: true })}
              buttonClassName={!canEditStatus ? "opacity-70" : undefined}
            />
            {!canEditStatus ? (
              <p className="-mt-2 text-xs text-slate-400 sm:col-span-2">
                El estado solo puede cambiarse desde la edicion o el detalle del ticket.
              </p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ticket-tag-input" className="text-slate-200">
              Etiquetas
            </Label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                id="ticket-tag-input"
                value={tagInput}
                onChange={(event) => setTagInput(event.target.value)}
                placeholder="Ej: facturacion"
                className="border-slate-500/70 bg-slate-950/50 text-slate-50 placeholder:text-slate-400 focus:border-brand-400 focus:ring-brand-300/30"
              />
              <Button type="button" variant="secondary" onClick={addTag} disabled={tags.length >= 5}>
                Agregar
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={`${tag.value}-${index}`}
                  className="inline-flex items-center gap-2 rounded-full border border-brand-300/30 bg-brand-500/15 px-3 py-1 text-xs text-brand-100"
                >
                  {tag.value}
                  <button
                    type="button"
                    onClick={() => tagsFieldArray.remove(index)}
                    className="text-brand-100/80 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-200"
                    aria-label={`Eliminar etiqueta ${tag.value}`}
                  >
                    x
                  </button>
                </span>
              ))}
            </div>
            {errors.tags?.message ? <p className="text-xs text-rose-300">{errors.tags.message}</p> : null}
          </div>

          <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting || isFormSubmitting}>
            {isSubmitting || isFormSubmitting ? "Guardando..." : submitLabel}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
