# Orbit

Orbit is a modern team workspace application for managing projects, tasks, collaboration, notifications, and AI-assisted workflows.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Framer Motion
- Lucide React
- Zustand
- Drizzle ORM
- PostgreSQL

## Development Philosophy

Build Orbit as a production-quality SaaS application.

Prioritize:

- Clean architecture
- Reusable components
- Strong TypeScript typing
- Responsive design
- Accessibility
- Performance
- Security
- Maintainability

## UI Direction

Orbit uses a premium dark SaaS interface.

Primary colors:

- Background: `#070a09`
- Surface: `#101411`
- Primary: `#5ce8ca`
- Secondary: `#285a48`
- Foreground: `#f2f5f3`

Use subtle borders, restrained shadows, clear spacing, and strong typography.

Avoid generic template-like UI.

## Project Structure

```text
app/
components/
  ui/
  layout/
  dashboard/
  projects/
  tasks/
  ai/
  notifications/
  shared/
hooks/
lib/
  db/
  services/
  validation/
stores/
types/
utils/