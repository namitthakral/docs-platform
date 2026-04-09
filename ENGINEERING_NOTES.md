# Engineering Notes

## 1. Architectural Decisions

### App Router Structure

The project uses Next.js 15 with the App Router pattern, organizing routes by feature:

- `/docs` - Public documentation pages (Server Components)
- `/dashboard` - Authenticated CMS interface (Client Components)
- `/auth` - Authentication pages
- `/api` - REST API endpoints (no Server Actions used)

**Why this structure:** Clear separation between public-facing content and admin functionality. Public docs benefit from Server Components for SEO and performance, while dashboard needs client-side interactivity.

### Server vs Client Component Strategy

- **Server Components:** Used for public docs pages, layouts, and data fetching
- **Client Components:** Used for dashboard, forms, search modals, and interactive UI
- **Hybrid approach:** Docs layout is server-rendered but includes client components for search

```typescript
// Example: Public docs page (Server Component)
export default async function DocPage({ params }: DocPageProps) {
  const document = await getDocumentByPath(slug, isPreview)
  // Server-side data fetching, SEO metadata
}

// Dashboard uses client hooks for mutations
const { mutate: updateDocument } = useUpdateDocument()
```

### API Design Pattern

All mutations go through REST API endpoints rather than Server Actions. Each API route follows a consistent response pattern:

```typescript
return NextResponse.json({
  success: true,
  data: result,
  error?: string
})
```

**Why REST over Server Actions:** Provides better separation of concerns, easier testing, and consistent error handling across the application.

## 2. State Management Approach

### Client-Side State: TanStack Query v5

All client-side data fetching and caching is handled through TanStack Query:

```typescript
// Centralized query keys for cache management
export const queryKeys = {
  documents: {
    all: ["documents"] as const,
    detail: (id: string) => [...queryKeys.documents.all, "detail", id] as const,
  },
  search: {
    public: (query: string) => ["search", "public", query] as const,
    dashboard: (query: string) => ["search", "dashboard", query] as const,
  },
}
```

**Cache Strategy:**

- Public content: 5 min stale time, 10 min garbage collection
- Dashboard content: 30s stale time, 5 min garbage collection
- Search results: Cached per query with different TTLs for public vs dashboard

### Server State: Supabase with RLS

Server-side state is managed through Supabase with Row Level Security:

- Public documents: Accessible to everyone when `status = 'published'`
- User documents: Scoped by `auth.uid() = user_id`
- Categories: Shared across users with public/private visibility and usage protection

### Query Client Isolation

Each user session gets its own QueryClient instance to prevent data leakage:

```typescript
const [queryClient] = useState(
  () =>
    new QueryClient({
      defaultOptions: {
        queries: { staleTime: 1000 * 60 * 5 },
        mutations: { retry: false },
      },
    }),
)
```

## 3. Data Fetching Strategy

### Server-Side Fetching

Public pages use direct Supabase calls in Server Components:

```typescript
// In server components
const supabase = await createClient()
const { data: documents } = await supabase
  .from("documents")
  .select("*")
  .eq("status", "published")
```

### Client-Side Fetching

Dashboard uses custom hooks that call API endpoints:

```typescript
// Client hooks fetch from API routes
async function searchDashboardDocuments(query: string) {
  const response = await fetch(getRoute.api.dashboard.search(query))
  return response.json()
}
```

### Cache Invalidation Strategy

Mutations automatically invalidate related queries:

```typescript
onSuccess: (result, variables) => {
  // Update specific item in cache
  queryClient.setQueryData(["document", variables.id], result.document)

  // Invalidate lists that might include this item
  invalidateQueries.documents(queryClient)
  invalidateQueries.dashboardStats(queryClient)
}
```

## 4. Search Implementation

### Hybrid Search Approach

Search combines PostgreSQL full-text search with pattern matching for better recall:

```sql
-- Full-text search with weighted ranking
CREATE INDEX idx_documents_search_weighted ON documents USING GIN (
  (setweight(to_tsvector('english', title), 'A') ||
   setweight(to_tsvector('english', content), 'B') ||
   setweight(to_tsvector('english', COALESCE(description, '')), 'C'))
);
```

The `search_documents` RPC function:

1. **Full-text search:** High precision for complex queries using `ts_rank_cd`
2. **Pattern matching:** High recall for partial matches using `ILIKE`
3. **Relevance scoring:** FTS results get 1.0-2.0 scores, pattern matching gets 0.3-0.9
4. **Snippet generation:** `ts_headline` for FTS, regex replacement for pattern matches

### Search Debouncing

Client-side search is debounced at 300ms to reduce API calls:

```typescript
const debouncedSetQuery = useCallback(
  (value: string) => {
    const debouncedFn = debounce((val: string) => {
      setDebouncedQuery(val)
    }, debounceMs)
    debouncedFn(value)
  },
  [debounceMs],
)
```

### Dual Search Modes

- **Public search:** Only published documents, no authentication required
- **Dashboard search:** User's documents including drafts, requires authentication

## 5. Component Organization

### Three-File Pattern

Many components use a consistent structure:

- `component.tsx` - React component
- `component.props.ts` - TypeScript interfaces
- `component.styles.ts` - Tailwind class collections

```typescript
// Example: tag-selector.styles.ts
export const tagSelectorStyles = {
  container: "space-y-2",
  input: "w-full px-3 py-2 border border-gray-300 rounded-md",
  suggestions:
    "absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg",
}
```

### Server vs Client Component Split

- **Docs components:** Server-rendered for SEO, client components only for interactivity
- **Dashboard components:** Primarily client components for rich interactions
- **Shared components:** Designed to work in both contexts

### Component Hierarchy

```
src/components/
├── docs/           # Public documentation UI
├── dashboard/      # User interface components
├── shared/         # Reusable across both contexts
├── auth/           # Authentication forms
└── providers/      # Context providers
```

## 6. Trade-offs and Assumptions

### Intentional Simplifications

- **No real-time collaboration:** Documents are single-user edited
- **Simple versioning:** Automatic versioning on content changes, no manual version management
- **Basic media handling:** No image uploads or file attachments
- **Single-tenant:** No multi-organization support

### Performance Trade-offs

- **Client-side search:** Trades server load for network requests on every keystroke
- **Eager loading:** Table of contents and breadcrumbs loaded on every doc page
- **No component lazy loading:** All React components load immediately rather than using dynamic imports or code-splitting
- **Query-level optimization:** While components aren't lazy-loaded, data fetching is optimized through caching and debouncing

### Scale Assumptions

- **Document volume:** Optimized for hundreds to low thousands of documents
- **Concurrent users:** Designed for small team usage (< 50 concurrent users)
- **Search frequency:** Search is cached but not optimized for high-frequency usage

### Known Limitations

- **Nested categories:** Database supports hierarchy but UI only shows one level
- **Bulk operations:** No bulk document management in dashboard
- **Search ranking:** Basic relevance scoring, no user behavior or click-through optimization

## 7. Public Page Rendering and Discoverability

### Server-Side Rendering Strategy

Public documentation pages use Next.js Server Components for optimal SEO:

```typescript
// Generates metadata for each document
export async function generateMetadata({
  params,
}: DocPageProps): Promise<Metadata> {
  const document = await getDocumentByPath(slug, isPreview)
  return {
    title: `${document.title} - ${categoryName}`,
    description: document.description,
    openGraph: { title, description, type: "article" },
  }
}
```

### SEO Implementation

- **Dynamic sitemap:** Generated from published documents in database
- **Robots.txt:** Allows crawling of `/docs/` and `/`, blocks `/dashboard/`, `/auth/`, `/api/`
- **Meta tags:** Each document gets proper title, description, and Open Graph tags
- **Structured URLs:** `/docs/category/document-slug` pattern for clear hierarchy

### Performance Considerations

- **Highlight.js CSS:** Loaded only on document pages for syntax highlighting
- **Static assets:** Minimal public assets, relies on Tailwind for styling
- **Database queries:** Optimized with proper indexes on `status`, `slug`, and full-text search

## 8. Optional Enhancements Implemented

### Draft vs Published Document States

Full draft/published workflow is implemented with database-level enforcement:

```sql
-- Document status enum
CREATE TYPE document_status AS ENUM ('draft', 'published');

-- RLS policy for public access
CREATE POLICY "Published documents are viewable by everyone" ON documents
  FOR SELECT USING (status = 'published');
```

**Implementation details:**

- Documents default to `draft` status when created
- `published_at` timestamp automatically set when status changes to published via trigger
- Dashboard shows status badges and allows publish/unpublish actions
- Public pages filter to only show `status = 'published'` documents
- Preview mode (`?preview=true`) allows document owners to view drafts
- Status transitions handled through `/api/documents/[id]` PUT endpoint

**Status transition locations:**

- Mutation hook: `useUpdateDocument()` in `src/hooks/use-document-mutations.ts` handles all document updates including status changes
- Database trigger: `update_published_at()` function automatically manages `published_at` timestamp
- UI controls:
  - Publish button in document editor header (saves content + sets status to published)
  - Status radio buttons in document editor sidebar (draft/published toggle)
  - Both use the same unified update endpoint

### Document Versioning

Automatic version history is implemented with database triggers:

```sql
-- Trigger creates version history on content changes
CREATE TRIGGER create_documents_version
  BEFORE UPDATE ON documents
  FOR EACH ROW EXECUTE FUNCTION create_document_version();
```

**Implementation details:**

- Versions stored in `document_versions` table
- Automatic versioning on title/content/description changes
- API endpoint at `/api/documents/[id]/versions` for retrieving history
- Version number incremented automatically and displayed in UI

### Breadcrumb Navigation

Hierarchical breadcrumbs implemented with recursive SQL function:

```sql
-- Recursive CTE for category breadcrumbs
CREATE OR REPLACE FUNCTION get_category_breadcrumbs(category_uuid UUID)
RETURNS TABLE (id UUID, name VARCHAR(255), slug VARCHAR(255), level INTEGER)
```

**Implementation details:**

- Database function `get_category_breadcrumbs` traverses category hierarchy
- API endpoint at `/api/categories/[id]/breadcrumbs`
- Breadcrumbs component renders full path from root to current category
- Used in document pages when document belongs to a category

### Deep Linking Within Documents

Automatic anchor links for all headings using rehype plugins:

```typescript
rehypePlugins={[
  rehypeSlug,  // Generates IDs for headings
  [rehypeAutolinkHeadings, { behavior: 'wrap' }],  // Wraps headings in links
]}
```

**Implementation details:**

- `rehype-slug` generates URL-friendly IDs for all headings
- `rehype-autolink-headings` makes headings clickable
- Table of contents component extracts headings and provides navigation
- Intersection Observer tracks which heading is currently visible

### Full-Text Search Improvements

Enhanced search with weighted ranking and hybrid approach:

**Weighted search index:**

```sql
-- Title weighted highest (A), content medium (B), description lowest (C)
setweight(to_tsvector('english', title), 'A') ||
setweight(to_tsvector('english', content), 'B') ||
setweight(to_tsvector('english', COALESCE(description, '')), 'C')
```

**Hybrid search strategy:**

- Full-text search for complex queries with proper ranking
- Pattern matching fallback for partial matches
- Relevance scoring combines both approaches
- Search snippets with highlighted matches using `ts_headline`

### Performance Optimizations

Several performance enhancements are implemented:

**Caching strategies:**

- TanStack Query with different TTLs for public vs dashboard content
- Search results cached per query
- Static sitemap generation

**Database optimizations:**

- Proper indexes on frequently queried columns
- GIN index for full-text search
- Composite indexes for slug/category lookups

**Client-side optimizations:**

- Debounced search to reduce API calls
- Query client isolation prevents cross-user data leakage
- `useSyncExternalStore` for hydration safety in `ClientOnly` wrapper

## 9. Category & Tag Architecture

### Shared Global Taxonomy Approach

Categories and tags are shared across all authenticated users with no user-specific ownership or isolation.

**Rationale:**

- **Team Collaboration:** Documentation platforms benefit from consistent taxonomies
- **Content Discoverability:** Shared categories improve navigation and search effectiveness
- **Simplicity:** Reduces complexity in state management and UI logic
- **Public Page Consistency:** Ensures coherent structure for public documentation

### Data Model

```sql
-- Categories support hierarchy and public/private visibility
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES categories(id),
  sort_order INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tags are simple labels with many-to-many relationship to documents
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE document_tags (
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (document_id, tag_id)
);
```

### Usage Protection & Data Integrity

**Category Deletion Protection:**

- Cannot delete categories that contain documents
- Cannot delete categories that have subcategories
- Provides clear error messages with usage counts

**Tag Deletion Protection:**

- Cannot delete tags that are assigned to documents
- Shows usage count in error messages

```typescript
// Example: Category deletion with usage protection
const { data: documentsUsingCategory } = await supabase
  .from("documents")
  .select("id")
  .eq("category_id", id)

const documentCount = documentsUsingCategory?.length || 0

if (documentCount > 0) {
  return NextResponse.json(
    {
      error: `Cannot delete category "${category.name}" because it contains ${documentCount} document(s)`,
    },
    { status: 409 },
  )
}
```

### Default Categories

The system includes pre-seeded categories to provide immediate structure:

- **Getting Started** - Essential guides for new users
- **API Reference** - Comprehensive API documentation
- **Tutorials** - Step-by-step tutorials and examples
- **FAQ** - Frequently asked questions
- **Internal Docs** - Private documentation (is_public: false)

### Trade-offs & Future Considerations

**Current Benefits:**

- Simple implementation and maintenance
- Collaborative taxonomy management
- Consistent content organization
- Effective for team-based documentation

**Potential Limitations:**

- No user isolation (suitable for trusted teams)
- Potential for conflicts in large organizations
- No ownership tracking or audit trail

**Future Enhancements Considered:**

- **Audit Trail:** Track all taxonomy changes for accountability
  - Decided to skip for MVP due to time constraints
  - Would implement in production for compliance/debugging
- **User Ownership:** Individual category/tag ownership with sharing
  - Current shared model works well for team collaboration
  - Could add if user base scales significantly

## 10. User Data Isolation & Dashboard Architecture

### Private vs Public Data Access Pattern

The platform implements a clear separation between user-private and globally-public data access to ensure proper data isolation and consistent user experience:

**Private Dashboard (User-Scoped):**
- Document statistics filtered by `auth.uid() = user_id` 
- Document management limited to user's own content
- API endpoints: `/api/documents`, `/api/dashboard/stats`
- Ensures users only see and manage their own documents

**Public Documentation (Global):**
- All published documents visible regardless of author
- API endpoints: Functions in `/lib/data/public.ts`
- SEO-optimized pages for content discovery
- Enables shared knowledge base across all users

### Dashboard Statistics Implementation

Dashboard stats are user-specific to ensure consistency between displayed counts and actual document lists:

```typescript
// User-scoped document counts in /api/dashboard/stats
const [
  { count: totalDocs },
  { count: publishedDocs },
  { count: draftDocs }
] = await Promise.all([
  supabase.from('documents').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
  supabase.from('documents').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('status', 'published'),
  supabase.from('documents').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('status', 'draft')
])
```

**Why User-Scoped Dashboard:**
- **Consistency:** Prevents confusion where global counts don't match user's document list
- **Data Privacy:** Maintains proper isolation between users' content
- **Performance:** Scales better as platform grows (constant time per user vs. linear growth)
- **Industry Standards:** Follows established patterns for content management systems
- **User Experience:** Users see statistics that reflect what they can actually manage

### Data Access Architecture

**User-Isolated Resources:**
- Documents: Filtered by `user_id` in all dashboard operations
- Document statistics: Scoped to current user's content
- Document management: Create, read, update, delete only user's own documents

**Shared Global Resources:**
- Categories: Shared taxonomy across all users with `is_public` visibility control
- Tags: Global tag system for consistent content organization
- Published content: Accessible to all users on public documentation site

### Row Level Security (RLS) Implementation

Supabase RLS policies enforce data isolation at the database level:

```sql
-- Users can only access their own documents in dashboard context
CREATE POLICY "Users can manage their own documents" ON documents
  FOR ALL USING (auth.uid() = user_id);

-- Published documents are viewable by everyone on public pages
CREATE POLICY "Published documents are viewable by everyone" ON documents
  FOR SELECT USING (status = 'published');
```

### API Endpoint Data Scoping

**User-Scoped Endpoints:**
- `GET /api/documents` - Returns only current user's documents
- `GET /api/dashboard/stats` - Counts only current user's documents
- `POST /api/documents` - Creates documents with current user's ID
- `PUT /api/documents/[id]` - Updates only if user owns the document

**Global Endpoints:**
- `getRecentPublishedDocuments()` - All published documents for public homepage
- `getPublishedDocumentBySlug()` - Any published document for public pages
- `getAllPublishedDocuments()` - All published documents for public browsing

### Architectural Decision Context

This user-scoped approach was chosen to resolve a specific inconsistency where:
- Dashboard showed global document counts (e.g., "5 total documents")
- Document list showed only user's documents (e.g., 2 actual documents)
- Users were confused about missing documents

**Alternative Considered:**
- Global dashboard showing all users' documents
- **Rejected because:** Would require complex permission system, role management, and potential security risks

**Implementation Benefits:**
- Simple and secure by default
- Consistent user experience
- Clear separation of concerns
- Easier to reason about and maintain
