import { Construction } from "lucide-react";

export function ComingSoonView() {
  return (
    <section className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
      <Construction className="h-16 w-16 text-slate-400" aria-hidden />
      <h2 className="text-center text-2xl font-semibold text-slate-200">
        Vista en desarrollo
      </h2>
      <p className="text-center text-slate-400">
        Disponible próximamente
      </p>
    </section>
  );
}
