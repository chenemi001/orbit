export const APP_NAME = "Orbit";

export const APP_DESCRIPTION =
  "A modern workspace for teams to plan, build, and get work done.";

export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  "http://localhost:3000";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  TASKS: "/tasks",
  PROJECTS: "/projects",
  NOTIFICATIONS: "/notifications",
  SETTINGS: "/settings",
  PROFILE: "/profile",
} as const;

export const TASK_STATUSES = [
  "todo",
  "in-progress",
  "review",
  "done",
] as const;

export const TASK_PRIORITIES = [
  "low",
  "medium",
  "high",
  "urgent",
] as const;

export const PROJECT_STATUSES = [
  "active",
  "completed",
  "archived",
  "on-hold",
] as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

export const DATE_FORMATS = {
  SHORT: "MMM d, yyyy",
  LONG: "MMMM d, yyyy",
  WITH_TIME: "MMM d, yyyy · h:mm a",
} as const;

export const DEBOUNCE_DELAYS = {
  SEARCH: 300,
  INPUT: 400,
  AUTOSAVE: 800,
} as const;