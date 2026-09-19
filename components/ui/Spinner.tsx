import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "h-3.5 w-3.5",
  md: "h-4.5 w-4.5",
  lg: "h-6 w-6",
};

export function Spinner({
  size = "md",
  className,
}: SpinnerProps) {
  return (
    <LoaderCircle
      aria-label="Loading"
      className={cn(
        "animate-spin text-current",
        sizes[size],
        className
      )}
    />
  );
}