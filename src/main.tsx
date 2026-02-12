import { QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import { AppToaster, queryClient } from "./config";
import { SessionWatcher } from "./routes";
import { LoaderView } from "./views";
import "./index.css";

const SPLASH_DURATION_MS = 5000;

function SplashWrapper({ children }: { children: React.ReactNode }) {
  const [showLoader, setShowLoader] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShowLoader(false), SPLASH_DURATION_MS);
    return () => clearTimeout(t);
  }, []);
  if (showLoader) return <LoaderView />;
  return <>{children}</>;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <SplashWrapper>
        <HashRouter>
          <SessionWatcher />
          <App />
        </HashRouter>
      </SplashWrapper>
      <AppToaster />
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  </StrictMode>,
);
