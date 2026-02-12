import { NavLink, Outlet } from "react-router-dom";

const links = [
  { to: "/app/tickets", label: "Tickets" },
  { to: "/app/tickets/new", label: "Nuevo ticket" },
];

export function AppLayout() {
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
          <p className="text-sm text-slate-600">Sistema ERP / Mesa de ayuda</p>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
