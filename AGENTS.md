# Orbit — AI Coding Guidelines

## Project Overview

Orbit is a modern team workspace built with Next.js, React, TypeScript, Tailwind CSS, Zustand, Drizzle ORM, and PostgreSQL.

The application helps teams manage:

- Projects
- Tasks
- Team members
- Notifications
- Activity
- AI-assisted workflows
- Workspace collaboration

The product should feel like a polished, production-quality SaaS application.

---

## Core Principles

### 1. Preserve the existing architecture

Before creating a new file or component, check whether an existing component, hook, utility, service, or type already solves the problem.

Avoid unnecessary duplication.

### 2. Keep components focused

Components should have one clear responsibility.

Prefer:

```text
components/
├── ui/
├── layout/
├── dashboard/
├── projects/
├── tasks/
├── ai/
├── notifications/
└── shared/