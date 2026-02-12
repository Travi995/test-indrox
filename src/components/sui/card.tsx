import { cn } from "../components-utilities";
import type { HTMLAttributes } from "react";

type DivProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: DivProps) {
  return (
    <div
      className={cn(
        "relative w-full rounded-sm border border-white/15 bg-slate-100/70 shadow-[0_24px_60px_-18px_rgba(15,23,42,0.85)] backdrop-blur-xl",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: DivProps) {
  return <div className={cn("space-y-2", className)} {...props} />;
}

export function CardTitle({ className, ...props }: DivProps) {
  return <div className={cn("text-2xl font-semibold text-slate-900", className)} {...props} />;
}

export function CardDescription({ className, ...props }: DivProps) {
  return <div className={cn("text-sm text-slate-700", className)} {...props} />;
}

export function CardContent({ className, ...props }: DivProps) {
  return <div className={cn("space-y-4", className)} {...props} />;
}
