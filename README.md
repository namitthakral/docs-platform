# Documentation Platform

A modern, full-stack documentation platform built with Next.js 15 and Supabase. Create, organize, and share knowledge effortlessly with powerful search, hierarchical organization, and a clean content management system.

## Tech Stack

- **Framework**: Next.js 15.5.14 with App Router
- **Frontend**: React 19, TypeScript, Tailwind CSS v4
- **Backend**: Supabase (PostgreSQL + Auth + RLS)
- **State Management**: TanStack Query v5
- **Content**: Markdown with syntax highlighting
- **UI Components**: Custom components with Lucide React icons
- **Notifications**: Sonner toast notifications
- **Styling**: clsx + tailwind-merge for conditional classes

## Features

- 📝 **Markdown Editor** - Rich markdown editing with live preview and auto-save
- 🔍 **Full-Text Search** - PostgreSQL-powered search with debouncing and caching
- 📁 **Hierarchical Organization** - Categories with parent-child relationships
- 🏷️ **Flexible Tagging** - Cross-cutting organization with many-to-many tags
- 🔐 **Authentication** - Supabase Auth with email/password and Row Level Security
- 📊 **Dashboard** - Complete CMS for managing documents, categories, and tags
- 🌐 **Public Documentation** - SEO-optimized public pages with server-side rendering
- 📱 **Responsive Design** - Mobile-first design with dark/light mode support
- 🔄 **Document Versioning** - Automatic version history on content changes
- 🚀 **Performance Optimized** - Server components, caching, and optimistic updates

## Prerequisites

- Node.js 20+ 
- npm or yarn
- Supabase account and project

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd docs-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_publishable_key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **Set up the database**
   
   Run the SQL schema in your Supabase project:
   ```bash
   # Copy the contents of supabase-schema.sql and run in Supabase SQL Editor
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` | Supabase publishable/anon key for client-side operations | Yes |
| `NEXT_PUBLIC_SITE_URL` | Base URL for sitemap and robots.txt generation | No |

## Project Structure

```
src/
├── app/                          # Next.js App Router pages and layouts
│   ├── (auth)/                   # Authentication pages (login, register)
│   ├── dashboard/                # Protected CMS area
│   ├── docs/                     # Public documentation pages
│   ├── api/                      # API routes for CRUD operations
│   ├── globals.css               # Global styles and Tailwind imports
│   ├── layout.tsx                # Root layout with providers
│   ├── page.tsx                  # Landing page
│   ├── loading.tsx               # Global loading UI
│   ├── error.tsx                 # Global error boundary
│   ├── not-found.tsx             # 404 page
│   ├── robots.ts                 # Robots.txt generation
│   └── sitemap.ts                # Sitemap generation
├── components/                   # React components organized by domain
│   ├── auth/                     # Authentication forms and UI
│   ├── dashboard/                # CMS components (editors, tables, managers)
│   ├── docs/                     # Public documentation components
│   ├── shared/                   # Reusable UI components
│   └── providers/                # Context providers (Query, Auth)
├── config/                       # Configuration files
│   ├── routes.ts                 # Centralized route management
│   └── dashboard-navigation.tsx  # Dashboard navigation config
├── hooks/                        # Custom React hooks
│   ├── mutations/                # TanStack Query mutation hooks
│   ├── queries/                  # TanStack Query hooks for data fetching
│   └── use-unified-search.ts     # Unified search functionality
├── lib/                          # Utility libraries and helpers
│   ├── data/                     # Server-side data access layer
│   ├── supabase/                 # Supabase client configurations
│   ├── helpers.ts                # General utility functions
│   └── query-keys.ts             # TanStack Query key management
└── types/                        # TypeScript type definitions
    ├── database.ts               # Generated Supabase types
    ├── document.ts               # Document-related types
    ├── category.ts               # Category and hierarchy types
    └── index.ts                  # Barrel exports
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Build the application for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint for code quality checks |

## API Reference

### Documents
- `GET /api/documents` - List documents with filtering (status, categoryId, limit)
- `POST /api/documents` - Create new document
- `PUT /api/documents?id=:id` - Update document by ID
- `DELETE /api/documents?id=:id` - Delete document by ID
- `GET /api/documents/[id]/versions` - Get document version history
- `POST /api/documents/[id]/tags` - Assign tags to document
- `DELETE /api/documents/[id]/tags` - Remove tags from document

### Categories
- `GET /api/categories` - List all categories with hierarchy
- `POST /api/categories` - Create new category
- `PUT /api/categories/[id]` - Update category
- `DELETE /api/categories/[id]` - Delete category
- `GET /api/categories/[id]/breadcrumbs` - Get category breadcrumb trail

### Tags
- `GET /api/tags` - List all tags
- `POST /api/tags` - Create new tag
- `PUT /api/tags/[id]` - Update tag
- `DELETE /api/tags/[id]` - Delete tag

### Search
- `GET /api/search` - Public search (published documents only)
- `GET /api/dashboard/search` - Authenticated search (includes drafts)

### Dashboard
- `GET /api/dashboard/stats` - Dashboard statistics and metrics
- `GET /api/navigation/documents` - Published documents for navigation

## License

MIT