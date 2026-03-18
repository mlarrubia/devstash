# Current Feature

<!-- Feature name and short description -->
Seed Data — Populate the database with sample data for development and demos per the seed spec.

## Status

<!-- Not started | In Progress | Completed -->
Completed

## Goals

<!-- Goals and requirements -->

## Notes

<!-- Any extra notes -->

## History

<!-- Keep this updated. Earliest to latest -->

- **2026-03-15** — Initial Next.js project setup. Cleared default boilerplate, added CLAUDE.md and context files, committed to main.
- **2026-03-15** — Dashboard UI Phase 1 completed. shadcn/ui initialized, dark mode set, /dashboard route created, top bar with search and new item buttons implemented.
- **2026-03-15** — Dashboard UI Phase 2 completed. Collapsible sidebar with item type nav links, favorite/recent collections with animated collapse, user avatar area, mobile Sheet drawer, and mobile FAB for new item/collection actions.
- **2026-03-15** — Dashboard UI Phase 3 completed. Main content area with 4 stats cards, collections grid with type icons and colored borders, pinned items section, and recent items section.
- **2026-03-16** — Prisma + Neon PostgreSQL setup completed. Installed Prisma 7 with pg adapter, created full schema (User, Item, Collection, ItemType, Tag, join tables, NextAuth models), added ContentType enum and password field, ran initial migrations, created seed script with 7 system item types, demo user, 3 collections, and 17 items.
- **2026-03-18** — Seed data completed. Updated seed script with 5 collections (React Patterns, AI Workflows, DevOps, Terminal Commands, Design Resources) and 18 items. Added db:test script to verify all data.
