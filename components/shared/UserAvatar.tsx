import { cn } from "@/lib/utils";

interface UserAvatarProps {
  name?: string;
  image?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizes = {
  sm: "h-7 w-7 text-[9px]",
  md: "h-9 w-9 text-[11px]",
  lg: "h-11 w-11 text-xs",
  xl: "h-16 w-16 text-base",
};

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function UserAvatar({
  name = "User",
  image,
  size = "md",
  className,
}: UserAvatarProps) {
  const initials = getInitials(name);

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-full",
        "bg-[var(--accent)]",
        "flex items-center justify-center",
        "font-semibold text-[var(--foreground)]",
        sizes[size],
        className
      )}
    >
      {image ? (
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover"
        />
      ) : (
        initials
      )}
    </div>
  );
}