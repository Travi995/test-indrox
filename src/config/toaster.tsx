import { Toaster } from "react-hot-toast";

export function AppToaster() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3500,
        style: {
          border: "1px solid rgba(148, 163, 184, 0.25)",
          borderRadius: "12px",
          background: "rgba(15, 23, 42, 0.9)",
          color: "#e2e8f0",
          backdropFilter: "blur(10px)",
          boxShadow: "0 12px 36px -12px rgba(2, 6, 23, 0.9)",
          maxWidth: "min(92vw, 420px)",
        },
        success: {
          iconTheme: {
            primary: "#22c55e",
            secondary: "#0f172a",
          },
        },
        error: {
          iconTheme: {
            primary: "#f43f5e",
            secondary: "#0f172a",
          },
          style: {
            border: "1px solid rgba(244, 63, 94, 0.45)",
            background: "rgba(30, 41, 59, 0.94)",
            color: "#fecdd3",
          },
        },
      }}
    />
  );
}
