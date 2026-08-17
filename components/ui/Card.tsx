import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

export function Card({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[1.75rem] bg-white/70 backdrop-blur-sm border border-white/60 shadow-[0_8px_30px_-12px_rgba(62,53,72,0.18)] p-5 sm:p-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
