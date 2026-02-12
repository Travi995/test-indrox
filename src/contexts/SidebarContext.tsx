import { createContext, useContext } from "react";

interface SidebarContextValue {
  sidebarExpanded: boolean;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  return ctx ?? { sidebarExpanded: true };
}

export function SidebarProvider({
  sidebarExpanded,
  children,
}: SidebarContextValue & { children: React.ReactNode }) {
  return (
    <SidebarContext.Provider value={{ sidebarExpanded }}>
      {children}
    </SidebarContext.Provider>
  );
}
