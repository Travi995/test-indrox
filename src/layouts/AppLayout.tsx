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
import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { SidebarProvider } from "../contexts/SidebarContext";
import { useAuthStore } from "../stores";

const MD_BREAKPOINT = 768;

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

function isMobile() {
  return typeof window !== "undefined" && window.innerWidth < MD_BREAKPOINT;
}

export function AppLayout() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  // Drawer cerrado por defecto en móvil
  useEffect(() => {
    if (isMobile()) setSidebarExpanded(false);
  }, []);

  // Cerrar drawer al navegar en móvil
  useEffect(() => {
    if (isMobile()) setSidebarExpanded(false);
  }, [location.pathname]);

  // Evitar scroll del body con drawer abierto en móvil
  useEffect(() => {
    if (!isMobile() || !sidebarExpanded) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [sidebarExpanded]);

  return (
    <SidebarProvider sidebarExpanded={sidebarExpanded}>
      <div className="flex min-h-screen flex-col bg-transparent md:h-screen md:min-h-0 md:flex-row md:overflow-hidden">
      <a
        href="#main-content"
        className="sr-only z-50 rounded-md bg-brand-500 px-3 py-2 text-sm font-medium text-white focus:not-sr-only focus:absolute focus:left-3 focus:top-3"
        onClick={(e) => {
          const target = document.getElementById("main-content");
          if (target) {
            e.preventDefault();
            target.focus({ preventScroll: false });
          }
        }}
      >
        Saltar al contenido principal
      </a>

      {/* Overlay solo en móvil cuando el drawer está abierto */}
      <button
        type="button"
        aria-label="Cerrar menú"
        aria-hidden={!sidebarExpanded}
        tabIndex={sidebarExpanded ? 0 : -1}
        onClick={() => setSidebarExpanded(false)}
        className={`fixed inset-0 z-30 bg-black/50 transition-opacity md:pointer-events-none md:invisible md:opacity-0 ${
          sidebarExpanded ? "opacity-100" : "pointer-events-none invisible opacity-0"
        }`}
      />

      {/* Sidebar: drawer en móvil, barra lateral en desktop */}
      <aside
        className={`flex shrink-0 flex-col border-r border-white/10 bg-slate-900/55 backdrop-blur-xl
          fixed left-0 top-0 z-40 h-full w-[220px] px-4 pb-4 pt-0
          transition-[transform] duration-200 ease-out
          md:relative md:left-auto md:top-auto md:h-auto md:shrink-0
          md:transition-[width,padding] md:duration-300 md:ease-[cubic-bezier(0.25,0.1,0.25,1)]
          ${sidebarExpanded ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          ${sidebarExpanded ? "md:w-[220px] md:px-4 md:pb-4 md:pt-0" : "md:w-14 md:items-center md:py-4 md:px-2"}
        `}
      >
        <div
          className={`flex h-12 min-h-12 shrink-0 items-center gap-3 border-b border-white/10 -mx-4 px-4 ${
            !sidebarExpanded ? "md:-mx-2 md:px-2" : ""
          } ${sidebarExpanded ? "" : "justify-center"}`}
        >
          <Hamburger
            toggled={sidebarExpanded}
            toggle={setSidebarExpanded}
            size={20}
            label={sidebarExpanded ? "Colapsar menú" : "Expandir menú"}
          />
          {sidebarExpanded && (
            <h1 className="truncate text-sm font-bold text-brand-100">
              ERP Ticketera
            </h1>
          )}
        </div>
        <nav className="mt-4 flex flex-col gap-1">
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

      <div className="flex min-w-0 flex-1 flex-col transition-[width] duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] md:min-h-0 md:overflow-hidden">
        <header className="flex shrink-0 flex-col border-b border-white/10 bg-slate-900/45 px-4 backdrop-blur-xl sm:px-6 md:h-12 md:min-h-12 md:flex-row md:items-center">
          <div className="mx-auto flex w-full max-w-7xl flex-row items-center justify-between gap-2 py-3 md:flex-wrap md:justify-between md:gap-3 md:py-0">
            {/* Móvil: una sola fila = hamburger + título + Cerrar sesión (sin email) */}
            <div className="flex min-h-12 min-w-0 flex-1 items-center gap-3 md:hidden md:min-h-0 md:flex-initial">
              <div className="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center">
                <Hamburger
                  toggled={sidebarExpanded}
                  toggle={setSidebarExpanded}
                  size={22}
                  label={sidebarExpanded ? "Cerrar menú" : "Abrir menú"}
                />
              </div>
              <h2 className="min-w-0 truncate text-sm font-semibold text-slate-100">
                ERP Ticketera
              </h2>
            </div>
            <p className="hidden text-sm text-slate-300 md:block">Sistema ERP / Mesa de ayuda</p>
            <div className="flex shrink-0 items-center gap-3">
              <p className="hidden min-w-0 truncate text-sm text-slate-200 md:block md:max-w-none">
                {user?.email ?? "Sin sesión"}
              </p>
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate("/login", { replace: true });
                }}
                className="shrink-0 rounded border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-100 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </header>
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 overflow-visible px-4 py-4 sm:px-6 sm:py-6 md:min-h-0 md:overflow-hidden"
        >
          <div className="mx-auto w-full max-w-7xl md:h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
    </SidebarProvider>
  );
}
