-- Add published flag to items (default false so new items are drafts)
ALTER TABLE items ADD COLUMN published BOOLEAN NOT NULL DEFAULT false;

-- Index for filtering published items
CREATE INDEX idx_items_published ON items(published);

-- Set all existing items as published
UPDATE items SET published = true;
