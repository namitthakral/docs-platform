-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE document_status AS ENUM ('draft', 'published');

-- Categories table for hierarchical organization
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    parent_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    sort_order INTEGER DEFAULT 0,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Documents table
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) NOT NULL,
    content TEXT NOT NULL DEFAULT '',
    description TEXT,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    status document_status DEFAULT 'draft',
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(slug, category_id)
);

-- Tags table
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Junction table for document tags (many-to-many)
CREATE TABLE document_tags (
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (document_id, tag_id)
);

-- Document versions for history tracking
CREATE TABLE document_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    description TEXT,
    version INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Indexes for performance
CREATE INDEX idx_documents_status ON documents(status);
CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_documents_category_id ON documents(category_id);
CREATE INDEX idx_documents_slug_category ON documents(slug, category_id);
CREATE INDEX idx_documents_published_at ON documents(published_at);
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_public ON categories(is_public);
CREATE INDEX idx_document_versions_document_id ON document_versions(document_id);
CREATE INDEX idx_document_versions_version ON document_versions(document_id, version);

-- Weighted full-text search index for better ranking
CREATE INDEX idx_documents_search_weighted ON documents USING GIN (
    (setweight(to_tsvector('english', title), 'A') ||
    setweight(to_tsvector('english', content), 'B') ||
    setweight(to_tsvector('english', COALESCE(description, '')), 'C'))
);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_versions ENABLE ROW LEVEL SECURITY;

-- Categories policies
CREATE POLICY "Public categories are viewable by everyone" ON categories
    FOR SELECT USING (is_public = true);

CREATE POLICY "Authenticated users can view all categories" ON categories
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage categories" ON categories
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update categories" ON categories
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete categories" ON categories
    FOR DELETE USING (auth.role() = 'authenticated');

-- Documents policies
CREATE POLICY "Published documents are viewable by everyone" ON documents
    FOR SELECT USING (status = 'published');

CREATE POLICY "Users can view their own documents" ON documents
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own documents" ON documents
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own documents" ON documents
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own documents" ON documents
    FOR DELETE USING (auth.uid() = user_id);

-- Tags policies
CREATE POLICY "Tags are viewable by everyone" ON tags
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage tags" ON tags
    FOR ALL USING (auth.role() = 'authenticated');

-- Document tags policies
CREATE POLICY "Document tags are viewable by everyone for published docs" ON document_tags
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM documents 
            WHERE documents.id = document_tags.document_id 
            AND documents.status = 'published'
        )
    );

CREATE POLICY "Users can manage tags for their own documents" ON document_tags
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM documents 
            WHERE documents.id = document_tags.document_id 
            AND documents.user_id = auth.uid()
        )
    );

-- Document versions policies
CREATE POLICY "Users can view versions of their own documents" ON document_versions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM documents 
            WHERE documents.id = document_versions.document_id 
            AND documents.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create versions for their own documents" ON document_versions
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM documents 
            WHERE documents.id = document_versions.document_id 
            AND documents.user_id = auth.uid()
        )
    );

-- Functions and triggers

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to set published_at when status changes to published
CREATE OR REPLACE FUNCTION update_published_at()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'published' AND OLD.status != 'published' THEN
        NEW.published_at = NOW();
    ELSIF NEW.status != 'published' THEN
        NEW.published_at = NULL;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to create document version on update
CREATE OR REPLACE FUNCTION create_document_version()
RETURNS TRIGGER AS $$
BEGIN
    -- Only create version if content actually changed
    IF OLD.title != NEW.title OR OLD.content != NEW.content OR OLD.description != NEW.description THEN
        -- Increment version number
        NEW.version = OLD.version + 1;
        
        -- Insert previous version into versions table
        INSERT INTO document_versions (
            document_id, 
            title, 
            content, 
            description, 
            version, 
            created_by
        ) VALUES (
            OLD.id, 
            OLD.title, 
            OLD.content, 
            OLD.description, 
            OLD.version,
            auth.uid()
        );
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers
CREATE TRIGGER update_categories_updated_at 
    BEFORE UPDATE ON categories 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at 
    BEFORE UPDATE ON documents 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_published_at 
    BEFORE UPDATE ON documents 
    FOR EACH ROW EXECUTE FUNCTION update_published_at();

CREATE TRIGGER create_documents_version 
    BEFORE UPDATE ON documents 
    FOR EACH ROW EXECUTE FUNCTION create_document_version();

-- Enhanced hybrid search function combining full-text search with pattern matching
-- Supports both public search (published docs only) and admin search (user's docs including drafts)
CREATE OR REPLACE FUNCTION search_documents(
    search_query TEXT,
    user_uuid UUID DEFAULT NULL,
    include_drafts BOOLEAN DEFAULT FALSE
)
RETURNS TABLE (
    id UUID,
    title VARCHAR(500),
    slug VARCHAR(500),
    description TEXT,
    highlighted_snippet TEXT,
    category_name VARCHAR(255),
    category_slug VARCHAR(255),
    status document_status,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    relevance_score REAL
) AS $$
DECLARE
    query_tsquery tsquery;
    clean_query TEXT;
BEGIN
    -- Clean and prepare the search query
    clean_query := trim(search_query);
    
    -- Convert search query to tsquery
    query_tsquery := plainto_tsquery('english', clean_query);
    
    -- Hybrid approach: Combine full-text search with pattern matching
    -- This gives us the best of both worlds: precision + recall
    RETURN QUERY
    WITH base_filter AS (
        SELECT 
            d.id, d.title, d.slug, d.description, d.content, d.status, 
            d.created_at, d.updated_at, d.user_id, d.category_id,
            c.name as category_name, c.slug as category_slug
        FROM documents d
        LEFT JOIN categories c ON d.category_id = c.id 
            AND (user_uuid IS NULL AND c.is_public = true OR user_uuid IS NOT NULL)
        WHERE 
            -- Filter by user if specified (admin search)
            (user_uuid IS NULL OR d.user_id = user_uuid)
            -- Filter by status based on search type
            AND (
                (user_uuid IS NULL AND d.status = 'published') OR  -- Public: only published
                (user_uuid IS NOT NULL AND (include_drafts = true OR d.status = 'published'))  -- Admin: published + drafts if requested
            )
    ),
    fts_results AS (
        -- Full-text search results (high precision, good for complex queries)
        SELECT 
            bf.id,
            bf.title,
            bf.slug,
            bf.description,
            ts_headline(
                'english', 
                bf.content, 
                query_tsquery,
                'MaxWords=50, MinWords=20, StartSel=<mark>, StopSel=</mark>'
            ) as highlighted_snippet,
            bf.category_name,
            bf.category_slug,
            bf.status,
            bf.created_at,
            bf.updated_at,
            -- Higher base score for FTS results (1.0-2.0 range)
            (1.0 + ts_rank_cd(
                setweight(to_tsvector('english', bf.title), 'A') ||
                setweight(to_tsvector('english', bf.content), 'B') ||
                setweight(to_tsvector('english', COALESCE(bf.description, '')), 'C'),
                query_tsquery
            ))::real as relevance_score,
            'fts' as match_type
        FROM base_filter bf
        WHERE 
            query_tsquery IS NOT NULL 
            AND query_tsquery != ''::tsquery
            AND (
                setweight(to_tsvector('english', bf.title), 'A') ||
                setweight(to_tsvector('english', bf.content), 'B') ||
                setweight(to_tsvector('english', COALESCE(bf.description, '')), 'C')
            ) @@ query_tsquery
    ),
    pattern_results AS (
        -- Pattern matching results (high recall, good for partial matches)
        SELECT 
            bf.id,
            bf.title,
            bf.slug,
            bf.description,
            -- Simple snippet with basic highlighting for pattern matches
            CASE 
                WHEN length(bf.content) > 200 THEN 
                    regexp_replace(
                        substring(bf.content from 1 for 200),
                        '(' || clean_query || ')',
                        '<mark>\1</mark>',
                        'gi'
                    ) || '...'
                ELSE 
                    regexp_replace(
                        bf.content,
                        '(' || clean_query || ')',
                        '<mark>\1</mark>',
                        'gi'
                    )
            END as highlighted_snippet,
            bf.category_name,
            bf.category_slug,
            bf.status,
            bf.created_at,
            bf.updated_at,
            -- Lower base score for pattern results (0.3-0.9 range)
            CASE 
                WHEN bf.title ILIKE '%' || clean_query || '%' THEN 0.9
                WHEN bf.description ILIKE '%' || clean_query || '%' THEN 0.7
                ELSE 0.5
            END::real as relevance_score,
            'pattern' as match_type
        FROM base_filter bf
        WHERE 
            (
                bf.title ILIKE '%' || clean_query || '%' OR
                bf.content ILIKE '%' || clean_query || '%' OR
                bf.description ILIKE '%' || clean_query || '%'
            )
            -- Exclude documents already found by FTS to avoid duplicates
            AND bf.id NOT IN (SELECT fts_results.id FROM fts_results)
    )
    -- Combine results with FTS results ranked higher
    SELECT 
        fts_results.id, fts_results.title, fts_results.slug, fts_results.description, fts_results.highlighted_snippet,
        fts_results.category_name, fts_results.category_slug, fts_results.status, fts_results.created_at, fts_results.updated_at, fts_results.relevance_score
    FROM fts_results
    UNION ALL
    SELECT 
        pattern_results.id, pattern_results.title, pattern_results.slug, pattern_results.description, pattern_results.highlighted_snippet,
        pattern_results.category_name, pattern_results.category_slug, pattern_results.status, pattern_results.created_at, pattern_results.updated_at, pattern_results.relevance_score
    FROM pattern_results
    ORDER BY relevance_score DESC, updated_at DESC
    LIMIT 50;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get category breadcrumbs
CREATE OR REPLACE FUNCTION get_category_breadcrumbs(category_uuid UUID)
RETURNS TABLE (
    id UUID,
    name VARCHAR(255),
    slug VARCHAR(255),
    level INTEGER
) AS $$
WITH RECURSIVE breadcrumbs AS (
    -- Base case: start with the given category
    SELECT 
        c.id,
        c.name,
        c.slug,
        c.parent_id,
        0 as level
    FROM categories c
    WHERE c.id = category_uuid AND c.is_public = true
    
    UNION ALL
    
    -- Recursive case: get parent categories
    SELECT 
        c.id,
        c.name,
        c.slug,
        c.parent_id,
        b.level + 1
    FROM categories c
    INNER JOIN breadcrumbs b ON c.id = b.parent_id
    WHERE c.is_public = true
)
SELECT 
    breadcrumbs.id,
    breadcrumbs.name,
    breadcrumbs.slug,
    breadcrumbs.level
FROM breadcrumbs
ORDER BY breadcrumbs.level DESC;
$$ LANGUAGE sql SECURITY DEFINER;

-- Insert some sample categories
INSERT INTO categories (name, slug, description, sort_order, is_public) VALUES
('Getting Started', 'getting-started', 'Essential guides to get you up and running', 1, true),
('API Reference', 'api-reference', 'Comprehensive API documentation', 2, true),
('Tutorials', 'tutorials', 'Step-by-step tutorials and examples', 3, true),
('FAQ', 'faq', 'Frequently asked questions', 4, true),
('Internal Docs', 'internal', 'Internal documentation (private)', 5, false);