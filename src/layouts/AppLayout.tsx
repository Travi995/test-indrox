import { NavLink, Outlet } from "react-router-dom";
import { useAuthStore } from "../stores";

const links = [
  { to: "/app/tickets", label: "Tickets" },
  { to: "/app/tickets/new", label: "Nuevo ticket" },
];

export function AppLayout() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="grid min-h-screen grid-cols-1 bg-transparent md:grid-cols-[240px_1fr]">
      <aside className="border-r border-white/10 bg-slate-900/55 p-4 backdrop-blur-xl">
        <h1 className="text-lg font-semibold text-brand-100">ERP Ticketera</h1>
        <nav className="mt-6 flex flex-col gap-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm transition ${
                  isActive
                    ? "bg-brand-500/90 text-white shadow-lg shadow-brand-900/30"
                    : "text-slate-200 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="border-b border-white/10 bg-slate-900/45 px-4 py-4 backdrop-blur-xl sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-slate-300">Sistema ERP / Mesa de ayuda</p>
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
        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
