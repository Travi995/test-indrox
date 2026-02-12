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
    <div className="grid min-h-screen grid-cols-1 bg-slate-50 md:grid-cols-[240px_1fr]">
      <aside className="border-r border-slate-200 bg-white p-4">
        <h1 className="text-lg font-semibold text-brand-700">ERP Ticketera</h1>
        <nav className="mt-6 flex flex-col gap-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm transition ${
                  isActive
                    ? "bg-brand-600 text-white"
                    : "text-slate-700 hover:bg-brand-50 hover:text-brand-700"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="border-b border-slate-200 bg-white px-6 py-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-slate-600">Sistema ERP / Mesa de ayuda</p>
            <div className="flex items-center gap-3">
              <p className="text-sm text-slate-600">{user?.email ?? "Sin sesión"}</p>
              <button
                type="button"
                onClick={logout}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
