import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export function Chip({ active, className, children, ...props }: ChipProps) {
  return (
    <button
      type="button"
      className={cn(
        "px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all duration-150 active:scale-95",
        active
          ? "bg-rose text-white border-rose shadow-[0_4px_14px_-4px_rgba(169,93,119,0.6)]"
          : "bg-white/60 text-plum-soft border-plum/10 hover:border-rose/40 hover:text-plum",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
