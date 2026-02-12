import { Outlet } from "react-router-dom";
import { useAuthStore } from "../stores";

export function AppLayout() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="min-h-screen bg-transparent md:h-screen md:overflow-hidden">
      <div className="flex min-w-0 flex-col md:h-screen md:overflow-hidden">
        <header className="border-b border-white/10 bg-slate-900/45 px-4 py-4 backdrop-blur-xl sm:px-6">
          <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-lg font-semibold text-brand-100">ERP Ticketera</h1>
              <p className="text-xs text-slate-300">Sistema ERP / Mesa de ayuda</p>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-sm text-slate-200">{user?.email ?? "Sin sesión"}</p>
              <button
                type="button"
                onClick={logout}
                className="rounded-md border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-100 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-visible px-4 py-4 sm:px-6 sm:py-6 md:min-h-0 md:overflow-hidden">
          <div className="mx-auto w-full max-w-7xl md:h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
