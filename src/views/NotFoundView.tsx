import { Link } from "react-router-dom";

export function NotFoundView() {
  return (
    <section className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-semibold text-slate-900">Ruta no encontrada</h2>
      <Link
        to="/app/tickets"
        className="rounded-md bg-brand-600 px-4 py-2 text-white hover:bg-brand-700"
      >
        Volver al inicio
      </Link>
    </section>
  );
}
