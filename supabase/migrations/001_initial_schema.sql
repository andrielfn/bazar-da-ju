-- Items table
CREATE TABLE items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  category TEXT NOT NULL CHECK (category IN ('moveis','eletronicos','cozinha','decoracao','roupas','outros')),
  is_donation BOOLEAN NOT NULL DEFAULT false,
  condition TEXT NOT NULL CHECK (condition IN ('novo','bom_estado','com_defeito')),
  status TEXT NOT NULL DEFAULT 'disponivel' CHECK (status IN ('disponivel','reservado','vendido')),
  photos TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Reservations table
CREATE TABLE reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  reserved_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '24 hours'),
  status TEXT NOT NULL DEFAULT 'ativa' CHECK (status IN ('ativa','cancelada','expirada','concluida'))
);

-- Indexes
CREATE INDEX idx_items_status ON items(status);
CREATE INDEX idx_items_category ON items(category);
CREATE INDEX idx_reservations_item_id ON reservations(item_id);
CREATE INDEX idx_reservations_status ON reservations(status);
CREATE INDEX idx_reservations_whatsapp ON reservations(whatsapp);

-- RLS
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Public read access for items
CREATE POLICY "Items are viewable by everyone"
  ON items FOR SELECT
  USING (true);

-- Public read access for reservations (needed to check availability)
CREATE POLICY "Reservations are viewable by everyone"
  ON reservations FOR SELECT
  USING (true);

-- Public insert for reservations (validated via server action)
CREATE POLICY "Anyone can create a reservation"
  ON reservations FOR INSERT
  WITH CHECK (true);

-- Updated_at trigger for items
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER items_updated_at
  BEFORE UPDATE ON items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Storage bucket for photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', true)
ON CONFLICT DO NOTHING;

-- Public read access for photos
CREATE POLICY "Photos are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'photos');

-- Allow uploads to photos bucket (via service role, no auth needed)
CREATE POLICY "Anyone can upload photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'photos');
