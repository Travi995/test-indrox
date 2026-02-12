import Hamburger from "hamburger-react";
import {
  BarChart3,
  LayoutDashboard,
  Package,
  Settings,
  Ticket,
  Truck,
  Users,
} from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores";

const SIDEBAR_ITEMS = [
  { to: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/tickets", label: "Tickets", icon: Ticket },
  { to: "/app/clientes", label: "Clientes", icon: Users },
  { to: "/app/proveedores", label: "Proveedores", icon: Truck },
  { to: "/app/inventario", label: "Inventario", icon: Package },
  { to: "/app/reportes", label: "Reportes", icon: BarChart3 },
  { to: "/app/configuracion", label: "Configuración", icon: Settings },
] as const;

const linkBase =
  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition overflow-hidden";
const linkActive =
  "bg-brand-500/90 text-white shadow-lg shadow-brand-900/30";
const linkInactive = "text-slate-200 hover:bg-white/10 hover:text-white";

export function AppLayout() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <div
      className={`grid min-h-screen grid-cols-1 bg-transparent md:h-screen md:min-h-0 md:overflow-hidden ${
        sidebarExpanded ? "md:grid-cols-[220px_1fr]" : "md:grid-cols-[56px_1fr]"
      }`}
    >
      <a
        href="#main-content"
        className="sr-only z-50 rounded-md bg-brand-500 px-3 py-2 text-sm font-medium text-white focus:not-sr-only focus:absolute focus:left-3 focus:top-3"
      >
        Saltar al contenido principal
      </a>
      <aside
        className={`flex shrink-0 flex-col border-r border-white/10 bg-slate-900/55 backdrop-blur-xl transition-[width] duration-200 ${
          sidebarExpanded ? "w-[220px] p-4" : "w-14 items-center py-4 px-2"
        }`}
      >
        <div
          className={`flex items-center gap-3 ${
            sidebarExpanded ? "" : "justify-center"
          }`}
        >
          <Hamburger
            toggled={sidebarExpanded}
            toggle={setSidebarExpanded}
            size={20}
            label={sidebarExpanded ? "Colapsar menú" : "Expandir menú"}
          />
          {sidebarExpanded && (
            <h1 className="truncate text-lg font-semibold text-brand-100">
              ERP Ticketera
            </h1>
          )}
        </div>
        <nav className="mt-6 flex flex-col gap-1">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                title={!sidebarExpanded ? item.label : undefined}
                aria-label={item.label}
                className={({ isActive }) =>
                  `${linkBase} ${sidebarExpanded ? "" : "justify-center"} ${
                    isActive ? linkActive : linkInactive
                  }`
                }
              >
                <Icon className="h-5 w-5 shrink-0" aria-hidden />
                {sidebarExpanded && (
                  <span className="truncate whitespace-nowrap">
                    {item.label}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-col md:min-h-0 md:overflow-hidden">
        <header className="border-b border-white/10 bg-slate-900/45 px-4 py-4 backdrop-blur-xl sm:px-6">
          <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-300">Sistema ERP / Mesa de ayuda</p>
            <div className="flex items-center gap-3">
              <p className="text-sm text-slate-200">
                {user?.email ?? "Sin sesión"}
              </p>
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate("/login", { replace: true });
                }}
                className="rounded-md border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-100 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </header>
        <main
          id="main-content"
          className="flex-1 overflow-visible px-4 py-4 sm:px-6 sm:py-6 md:min-h-0 md:overflow-hidden"
        >
          <div className="mx-auto w-full max-w-7xl md:h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
