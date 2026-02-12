import { cn } from "../components-utilities";
import * as React from "react";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground file:text-slate-100 placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "border-slate-500/70 bg-slate-950/45 text-slate-100 placeholder:text-slate-400 focus-visible:border-brand-400 focus-visible:ring-2 focus-visible:ring-brand-300/30 focus-visible:outline-none",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
