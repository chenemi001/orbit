import { cn } from "@/lib/utils";

type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  default:
    "bg-[var(--accent)] text-[var(--foreground)]",
  success:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  warning:
    "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  danger:
    "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
  info:
    "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
};

export function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1",
        "text-xs font-medium leading-none",
        "transition-colors",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}