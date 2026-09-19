export function formatDate(
  date: string | Date | null | undefined
): string {
  if (!date) return "—";

  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(value);
}

export function formatDateTime(
  date: string | Date | null | undefined
): string {
  if (!date) return "—";

  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(value);
}

export function formatRelativeTime(
  date: string | Date
): string {
  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return "—";
  }

  const seconds = Math.floor(
    (Date.now() - value.getTime()) / 1000
  );

  if (seconds < 60) {
    return "just now";
  }

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);

  if (days < 7) {
    return `${days}d ago`;
  }

  return formatDate(value);
}

export function formatNumber(
  value: number
): string {
  return new Intl.NumberFormat("en-US").format(
    value
  );
}

export function formatPercentage(
  value: number,
  decimals = 0
): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatFileSize(
  bytes: number
): string {
  if (bytes === 0) return "0 Bytes";

  const units = [
    "Bytes",
    "KB",
    "MB",
    "GB",
    "TB",
  ];

  const index = Math.floor(
    Math.log(bytes) / Math.log(1024)
  );

  const size =
    bytes / Math.pow(1024, index);

  return `${size.toFixed(index === 0 ? 0 : 1)} ${
    units[index]
  }`;
}

export function formatInitials(
  name: string
): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}

export function truncate(
  value: string,
  length: number
): string {
  if (value.length <= length) {
    return value;
  }

  return `${value.slice(0, length).trimEnd()}...`;
}

export function capitalize(
  value: string
): string {
  if (!value) return "";

  return (
    value.charAt(0).toUpperCase() +
    value.slice(1)
  );
}

export function formatStatus(
  value: string
): string {
  return value
    .split(/[-_]/)
    .map(capitalize)
    .join(" ");
}