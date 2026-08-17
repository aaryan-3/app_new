import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-rose text-white hover:bg-rose-deep active:scale-[0.98] shadow-[0_6px_20px_-6px_rgba(169,93,119,0.55)]",
  secondary:
    "bg-lavender-light text-plum hover:bg-lavender/40 active:scale-[0.98]",
  ghost: "bg-transparent text-plum hover:bg-plum/5 active:scale-[0.98]",
  outline:
    "bg-white/70 text-plum border border-plum/10 hover:bg-white active:scale-[0.98]",
  danger:
    "bg-white text-rose-deep border border-rose/30 hover:bg-rose-light/30 active:scale-[0.98]",
};

const sizeClasses: Record<Size, string> = {
  sm: "text-sm px-3.5 py-2 gap-1.5",
  md: "text-[0.95rem] px-5 py-2.5 gap-2",
  lg: "text-base px-6 py-3.5 gap-2.5",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 disabled:opacity-40 disabled:pointer-events-none",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
