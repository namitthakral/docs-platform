-- Complete Database Cleanup Script
-- This will remove all tables, functions, triggers, and data created by the docs platform
-- WARNING: This will delete ALL data! Use with caution.

-- Drop all functions first (to avoid dependency issues)
DROP FUNCTION IF EXISTS search_documents(TEXT, UUID, BOOLEAN) CASCADE;
DROP FUNCTION IF EXISTS search_admin_documents(TEXT, UUID) CASCADE;
DROP FUNCTION IF EXISTS get_category_breadcrumbs(UUID) CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS update_published_at() CASCADE;
DROP FUNCTION IF EXISTS create_document_version() CASCADE;

-- Drop all triggers
DROP TRIGGER IF EXISTS update_categories_updated_at ON categories CASCADE;
DROP TRIGGER IF EXISTS update_documents_updated_at ON documents CASCADE;
DROP TRIGGER IF EXISTS update_documents_published_at ON documents CASCADE;
DROP TRIGGER IF EXISTS create_documents_version ON documents CASCADE;

-- Drop all tables (in reverse dependency order)
DROP TABLE IF EXISTS document_versions CASCADE;
DROP TABLE IF EXISTS document_tags CASCADE;
DROP TABLE IF EXISTS tags CASCADE;
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- Drop custom types
DROP TYPE IF EXISTS document_status CASCADE;

-- Drop any indexes that might remain
DROP INDEX IF EXISTS idx_documents_status CASCADE;
DROP INDEX IF EXISTS idx_documents_user_id CASCADE;
DROP INDEX IF EXISTS idx_documents_category_id CASCADE;
DROP INDEX IF EXISTS idx_documents_published_at CASCADE;
DROP INDEX IF EXISTS idx_documents_updated_at CASCADE;
DROP INDEX IF EXISTS idx_categories_parent_id CASCADE;
DROP INDEX IF EXISTS idx_categories_slug CASCADE;
DROP INDEX IF EXISTS idx_documents_slug CASCADE;
DROP INDEX IF EXISTS idx_document_tags_document_id CASCADE;
DROP INDEX IF EXISTS idx_document_tags_tag_id CASCADE;
DROP INDEX IF EXISTS idx_tags_slug CASCADE;

-- Drop any sequences that might remain
DROP SEQUENCE IF EXISTS categories_sort_order_seq CASCADE;

-- Clean up any remaining objects related to full-text search
DROP INDEX IF EXISTS documents_fts_idx CASCADE;
DROP INDEX IF EXISTS documents_title_idx CASCADE;
DROP INDEX IF EXISTS documents_content_idx CASCADE;

-- Note: This script does NOT drop:
-- - The auth schema (Supabase managed)
-- - System tables and functions
-- - Extensions (like uuid-ossp, pg_trgm if installed)
-- - RLS policies (they're dropped with tables)

-- Verify cleanup (these should return 0 rows after cleanup)
-- SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('documents', 'categories', 'tags', 'document_tags', 'document_versions');
-- SELECT count(*) FROM information_schema.routines WHERE routine_schema = 'public' AND routine_name LIKE '%document%';

COMMIT;

-- Success message
SELECT 'Database cleanup completed successfully! All docs platform tables, functions, and data have been removed.' as cleanup_status;