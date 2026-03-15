# DevStash — Project Overview

> **One hub for all your developer knowledge.** Snippets, prompts, commands, links, notes, and files — searchable, organized, and AI-enhanced.

---

## Table of Contents

- [Problem](#problem)
- [Target Users](#target-users)
- [Features](#features)
- [Data Models](#data-models)
- [Tech Stack](#tech-stack)
- [Monetization](#monetization)
- [UI/UX](#uiux)

---

## Problem

Developers keep their essentials scattered across too many places:

| What | Where it ends up |
|---|---|
| Code snippets | VS Code, Notion, GitHub Gists |
| AI prompts | Chat histories |
| Context files | Buried in project directories |
| Useful links | Browser bookmarks |
| Docs & notes | Random folders |
| Commands | `.txt` files, bash history |
| Templates | Gists, boilerplates repos |

This causes constant context switching, lost knowledge, and inconsistent workflows. **DevStash** solves this by providing a single, fast, searchable, AI-enhanced hub for all developer knowledge and resources.

---

## Target Users

| Persona | Need |
|---|---|
| **Everyday Developer** | Fast access to snippets, prompts, commands, links |
| **AI-First Developer** | Save prompts, contexts, workflows, system messages |
| **Content Creator / Educator** | Store code blocks, explanations, course notes |
| **Full-Stack Builder** | Collect patterns, boilerplates, API examples |

---

## Features

### A. Items & Item Types

Items are the core unit of DevStash. Each item has a **type** that determines its behavior and appearance. Users will eventually be able to create custom types, but the following **system types** are built-in and immutable:

| Type | Content Model | Icon | Color | Access |
|---|---|---|---|---|
| `snippet` | Text | `Code` | `#3b82f6` 🔵 | Free |
| `prompt` | Text | `Sparkles` | `#8b5cf6` 🟣 | Free |
| `note` | Text | `StickyNote` | `#fde047` 🟡 | Free |
| `command` | Text | `Terminal` | `#f97316` 🟠 | Free |
| `link` | URL | `Link` | `#10b981` 🟢 | Free |
| `file` | File upload | `File` | `#6b7280` ⚫ | Pro |
| `image` | File upload | `Image` | `#ec4899` 🩷 | Pro |

> **Content models:** `text` (snippet, note, prompt, command), `url` (link), `file` (file, image)
>
> **URL structure:** `/items/snippets`, `/items/prompts`, etc.

Items should be quick to access and create via a **slide-out drawer**.

### B. Collections

Users can organize items into named collections. An item can belong to **multiple collections** (many-to-many relationship).

Example collections:

- "React Patterns" → snippets, notes
- "Context Files" → files
- "Python Snippets" → snippets
- "Interview Prep" → snippets, prompts, notes

### C. Search

Full search across:

- Content body
- Titles
- Tags
- Item types

### D. Authentication

- Email/password sign-in
- GitHub OAuth sign-in
- Powered by **NextAuth v5**

### E. Core Features

- Favorite collections and items (⭐)
- Pin items to top of lists (📌)
- Recently used items section
- Import code from a file
- Markdown editor for text-based types
- File upload for file/image types
- Export data (JSON/ZIP) — Pro only
- Dark mode by default, light mode optional
- Add/remove items to/from multiple collections
- View which collections an item belongs to

### F. AI Features (Pro Only)

- **Auto-tag suggestions** — AI analyzes content and suggests relevant tags
- **Summaries** — Generate concise summaries of long notes or snippets
- **Explain This Code** — AI explains what a code snippet does
- **Prompt Optimizer** — Improve and refine AI prompts

---

## Data Models

### Entity Relationship Diagram

```
┌──────────┐       ┌───────────┐       ┌──────────────┐       ┌────────────┐
│   User   │──1:N──│   Item    │──N:M──│  Collection  │──N:1──│    User    │
└──────────┘       └───────────┘       └──────────────┘       └────────────┘
                        │                                          │
                       N:1                                        1:N
                        │                                          │
                   ┌───────────┐                             ┌───────────┐
                   │ ItemType  │                             │ ItemType  │
                   └───────────┘                             │(defaults) │
                        │                                    └───────────┘
                       N:M
                        │
                   ┌───────────┐
                   │    Tag    │
                   └───────────┘
```

**Key relationships:**

- `User` → `Item` (one-to-many)
- `User` → `Collection` (one-to-many)
- `Item` ↔ `Collection` (many-to-many via `ItemCollection` join table)
- `Item` → `ItemType` (many-to-one)
- `Item` ↔ `Tag` (many-to-many)
- `ItemType` → `User` (nullable — `null` for system types)

### Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── Auth (extends NextAuth) ───────────────────────────

model User {
  id                   String    @id @default(cuid())
  name                 String?
  email                String?   @unique
  emailVerified        DateTime?
  image                String?
  isPro                Boolean   @default(false)
  stripeCustomerId     String?   @unique
  stripeSubscriptionId String?   @unique
  createdAt            DateTime  @default(now())
  updatedAt            DateTime  @updatedAt

  accounts   Account[]
  sessions   Session[]
  items      Item[]
  collections Collection[]
  itemTypes  ItemType[]
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

// ─── Core Models ───────────────────────────────────────

model ItemType {
  id       String  @id @default(cuid())
  name     String                          // e.g. "snippet", "prompt"
  icon     String                          // Lucide icon name
  color    String                          // Hex color code
  isSystem Boolean @default(false)         // true = immutable system type

  userId String?
  user   User?   @relation(fields: [userId], references: [id], onDelete: Cascade)

  items              Item[]
  defaultCollections Collection[]           // collections using this as default type

  @@unique([name, userId])                 // unique per user (null userId = system)
}

model Item {
  id          String   @id @default(cuid())
  title       String
  description String?
  contentType String                       // "text" | "url" | "file"
  content     String?                      // text content (null if file type)
  url         String?                      // URL for link types
  fileUrl     String?                      // Cloudflare R2 URL (null if text)
  fileName    String?                      // original filename
  fileSize    Int?                         // bytes
  language    String?                      // programming language (optional)
  isFavorite  Boolean  @default(false)
  isPinned    Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  userId     String
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  itemTypeId String
  itemType   ItemType @relation(fields: [itemTypeId], references: [id])

  tags        TagsOnItems[]
  collections ItemCollection[]

  @@index([userId, itemTypeId])
  @@index([userId, isFavorite])
  @@index([userId, isPinned])
}

model Collection {
  id          String   @id @default(cuid())
  name        String                       // e.g. "React Hooks"
  description String?
  isFavorite  Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  userId        String
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  defaultTypeId String?
  defaultType   ItemType? @relation(fields: [defaultTypeId], references: [id])

  items ItemCollection[]

  @@index([userId])
}

model ItemCollection {
  itemId       String
  collectionId String
  addedAt      DateTime @default(now())

  item       Item       @relation(fields: [itemId], references: [id], onDelete: Cascade)
  collection Collection @relation(fields: [collectionId], references: [id], onDelete: Cascade)

  @@id([itemId, collectionId])
}

model Tag {
  id   String @id @default(cuid())
  name String @unique

  items TagsOnItems[]
}

model TagsOnItems {
  itemId String
  tagId  String

  item Item @relation(fields: [itemId], references: [id], onDelete: Cascade)
  tag  Tag  @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([itemId, tagId])
}
```

> **Migration rule:** Never use `db push`. Always create migrations via `prisma migrate dev` locally and `prisma migrate deploy` in production.

---

## Tech Stack

### Overview

```
┌─────────────────────────────────────────────────┐
│                    Frontend                      │
│         Next.js 16 / React 19 / TypeScript       │
│         Tailwind CSS v4 + shadcn/ui              │
├─────────────────────────────────────────────────┤
│                   Backend                        │
│           Next.js API Routes (App Router)         │
│                  NextAuth v5                      │
├──────────┬──────────────┬───────────────────────┤
│   Database │  File Storage │    AI Integration    │
│  Neon Postgres │ Cloudflare R2 │  OpenAI gpt-5-nano │
│   + Prisma 7   │               │                    │
└──────────┴──────────────┴───────────────────────┘
```

### Stack Details

| Layer | Technology | Notes |
|---|---|---|
| **Framework** | Next.js 16 + React 19 | SSR pages with dynamic client components. Single repo. |
| **Language** | TypeScript | Full type safety across the stack |
| **Database** | Neon PostgreSQL | Serverless Postgres in the cloud |
| **ORM** | Prisma 7 | Use latest docs — fetch if needed |
| **Caching** | Redis | Under consideration |
| **File Storage** | Cloudflare R2 | For file and image uploads (Pro feature) |
| **Auth** | NextAuth v5 | Email/password + GitHub OAuth |
| **AI** | OpenAI `gpt-5-nano` | Auto-tagging, summaries, code explanation, prompt optimization |
| **Styling** | Tailwind CSS v4 + shadcn/ui | Utility-first CSS with accessible component library |

### Key Technical Decisions

- **One codebase** — frontend and backend live in the same Next.js repo to reduce overhead
- **SSR with dynamic components** — server-rendered pages with client-side interactivity where needed
- **API routes for backend** — storing items, file uploads, AI calls all go through Next.js API routes
- **Prisma migrations only** — never use `db push` or directly modify the database structure

---

## Monetization

### Freemium Model

| | Free | Pro ($8/mo · $72/yr) |
|---|---|---|
| **Items** | 50 total | Unlimited |
| **Collections** | 3 | Unlimited |
| **Item types** | All system types except file & image | All system types + custom types (later) |
| **Search** | Basic | Full |
| **File/image uploads** | ✗ | ✓ |
| **AI features** | ✗ | ✓ (auto-tag, explain, summarize, optimize) |
| **Data export** | ✗ | ✓ (JSON/ZIP) |
| **Priority support** | ✗ | ✓ |

> **Development note:** During development, all users have access to all features. Pro gating will be enforced at launch. The foundation for Pro (Stripe customer/subscription IDs on the User model) is in place from the start.

---

## UI/UX

### Design Principles

- Modern, minimal, developer-focused aesthetic
- Dark mode by default, light mode optional
- Clean typography with generous whitespace
- Subtle borders and shadows
- Syntax highlighting for code blocks
- Smooth transitions, hover states, toast notifications, loading skeletons

**Design references:** Notion, Linear, Raycast

### Screenshots

Refer to the screenshots below as a base for the dashboard UI. It does not have to be exact. Use it as a reference.

- @context/screenshots/dashboard-ui-main.png
- @context/screenshots/dashboard-ui-drawer.png

### Layout

```
┌──────────────────────────────────────────────────────┐
│  DevStash                              🔍  ⚙️  👤    │
├────────────┬─────────────────────────────────────────┤
│            │                                         │
│  SIDEBAR   │  MAIN CONTENT                           │
│            │                                         │
│  ┌──────┐  │  Collections (color-coded cards)        │
│  │Types │  │  ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │      │  │  │ React   │ │ Python  │ │ Context │   │
│  │ 📋   │  │  │ Patterns│ │ Scripts │ │ Files   │   │
│  │ ✨   │  │  └─────────┘ └─────────┘ └─────────┘   │
│  │ 🔧   │  │                                         │
│  │ 📝   │  │  Items (color-coded border by type)     │
│  │ 🔗   │  │  ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │ 📁   │  │  │ snippet │ │ prompt  │ │ command │   │
│  │ 🖼️   │  │  │ ──────  │ │ ──────  │ │ ──────  │   │
│  ├──────┤  │  └─────────┘ └─────────┘ └─────────┘   │
│  │Recent│  │                                         │
│  │Collec│  │  ┌──────────────────────────────────┐   │
│  │tions │  │  │  Item Drawer (slide-out panel)   │   │
│  └──────┘  │  │  Title, content, tags, metadata  │   │
│            │  └──────────────────────────────────┘   │
└────────────┴─────────────────────────────────────────┘
```

- **Sidebar:** Item types with nav links, recent collections. Collapsible on desktop, becomes a drawer on mobile.
- **Main content:** Grid of collection cards (background color based on dominant item type) and item cards (border color matches type).
- **Item drawer:** Slide-out panel for quick viewing and editing of individual items.

### Type Colors Reference

```
snippet   ████  #3b82f6  (blue)
prompt    ████  #8b5cf6  (purple)
command   ████  #f97316  (orange)
note      ████  #fde047  (yellow)
file      ████  #6b7280  (gray)
image     ████  #ec4899  (pink)
link      ████  #10b981  (emerald)
```

### Responsive Strategy

- Desktop-first, mobile-usable
- Sidebar collapses to a hamburger drawer on mobile
- Cards reflow to single column on small screens

### Micro-Interactions

- Smooth CSS transitions on all interactive elements
- Hover states on cards (subtle lift/glow)
- Toast notifications for CRUD actions
- Loading skeletons while data fetches

---

## Useful Links

| Resource | URL |
|---|---|
| Next.js Docs | https://nextjs.org/docs |
| React 19 | https://react.dev |
| Prisma Docs | https://www.prisma.io/docs |
| Neon Postgres | https://neon.tech/docs |
| NextAuth v5 | https://authjs.dev |
| Tailwind CSS v4 | https://tailwindcss.com/docs |
| shadcn/ui | https://ui.shadcn.com |
| Cloudflare R2 | https://developers.cloudflare.com/r2 |
| OpenAI API | https://platform.openai.com/docs |
| Stripe Billing | https://docs.stripe.com/billing |
| Lucide Icons | https://lucide.dev/icons |
