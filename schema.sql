-- FULL-FLEDGED MEDIBLINK SCHEMA WITH INVENTORY MANAGEMENT

DROP TABLE IF EXISTS inventory CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS medicines CASCADE;
DROP TABLE IF EXISTS dark_stores CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS order_status CASCADE;

-- ENUMS
CREATE TYPE user_role AS ENUM ('patient', 'admin', 'picker', 'rider', 'doctor');
CREATE TYPE order_status AS ENUM ('pending', 'rx_verification', 'picking', 'out_for_delivery', 'completed');

-- USERS (Extends Supabase Auth)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  role user_role NOT NULL DEFAULT 'patient',
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  created_at TIMESTAMP DEFAULT NOW()
);

-- DARK STORES
CREATE TABLE dark_stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  location_lat DECIMAL(10, 8) NOT NULL,
  location_lng DECIMAL(11, 8) NOT NULL,
  service_radius_km DECIMAL(5,2) DEFAULT 5.0
);

-- MEDICAL SKU CATALOG
CREATE TABLE medicines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  molecule_salt TEXT NOT NULL,
  category VARCHAR(100),
  generic_for UUID REFERENCES medicines(id),
  rx_required BOOLEAN DEFAULT false,
  dosage_details TEXT,
  warnings TEXT,
  price DECIMAL(10,2) NOT NULL
);

-- INVENTORY
CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medicine_id UUID REFERENCES medicines(id) UNIQUE,
  store_id UUID REFERENCES dark_stores(id),
  stock_level INT DEFAULT 100,
  total_sold INT DEFAULT 0,
  reorder_threshold INT DEFAULT 20
);

-- ORDERS
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES users(id),
  store_id UUID REFERENCES dark_stores(id),
  status order_status DEFAULT 'pending',
  total_amount DECIMAL(10,2),
  rx_file_url TEXT,
  delivery_address TEXT,
  items JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- REALTIME CONFIGURATION
alter publication supabase_realtime add table orders;
alter publication supabase_realtime add table inventory;

-- INSERT MOCK DARK STORE
INSERT INTO dark_stores (id, name, location_lat, location_lng)
VALUES ('11111111-1111-1111-1111-111111111111', 'MediBlink Hub - Central', 28.6139, 77.2090);

-- INSERT MASSIVE MEDICINE CATALOG
-- OTC
INSERT INTO medicines (id, name, molecule_salt, category, price, rx_required) VALUES
('22222222-2222-2222-2222-222222222221', 'Paracetamol 500mg', 'Paracetamol', 'otc', 20.00, false),
('22222222-2222-2222-2222-222222222222', 'Pan 40', 'Pantoprazole', 'otc', 55.00, false),
('22222222-2222-2222-2222-222222222223', 'Vicks Action 500', 'Paracetamol + Caffeine', 'otc', 40.00, false);

-- Chronic
INSERT INTO medicines (id, name, molecule_salt, category, price, rx_required) VALUES
('33333333-3333-3333-3333-333333333331', 'Amlodipine 5mg', 'Amlodipine Besylate', 'chronic', 80.00, true),
('33333333-3333-3333-3333-333333333332', 'Metformin 500mg', 'Metformin Hydrochloride', 'chronic', 60.00, true);

-- Vet & Pets
INSERT INTO medicines (id, name, molecule_salt, category, price, rx_required) VALUES
('44444444-4444-4444-4444-444444444441', 'Bravecto 1000mg', 'Fluralaner', 'vet', 1500.00, true),
('44444444-4444-4444-4444-444444444442', 'Drontal Plus Dog', 'Praziquantel', 'vet', 450.00, false);

-- Antibiotics
INSERT INTO medicines (id, name, molecule_salt, category, price, rx_required) VALUES
('55555555-5555-5555-5555-555555555551', 'Augmentin 625 Duo', 'Amoxicillin + Clavulanic Acid', 'antibiotics', 200.00, true),
('55555555-5555-5555-5555-555555555552', 'Moxikind-CV 625 (Generic)', 'Amoxicillin + Clavulanic Acid', 'antibiotics', 120.00, true);

-- First Aid / Allergies
INSERT INTO medicines (id, name, molecule_salt, category, price, rx_required) VALUES
('66666666-6666-6666-6666-666666666661', 'Betadine Ointment 20g', 'Povidone Iodine', 'allergies', 90.00, false),
('66666666-6666-6666-6666-666666666662', 'Band-Aid Washproof (Pack of 20)', 'Adhesive Plaster', 'allergies', 50.00, false);

-- SEED INVENTORY (Set generic for generic links if needed, but omitted for brevity)
UPDATE medicines SET generic_for = '55555555-5555-5555-5555-555555555551' WHERE id = '55555555-5555-5555-5555-555555555552';

-- Populate Inventory for all medicines
INSERT INTO inventory (medicine_id, store_id, stock_level, total_sold)
SELECT id, '11111111-1111-1111-1111-111111111111', 100, 0 FROM medicines;

-- SQL FUNCTION & TRIGGER TO DEDUCT STOCK ON ORDER CREATION
CREATE OR REPLACE FUNCTION deduct_inventory_on_order()
RETURNS TRIGGER AS $$
DECLARE
  item JSONB;
  med_id UUID;
  med_qty INT;
BEGIN
  -- Loop through the JSONB array of items
  FOR item IN SELECT * FROM jsonb_array_elements(NEW.items)
  LOOP
    med_id := (item->'medicine'->>'id')::UUID;
    med_qty := (item->>'qty')::INT;
    
    -- Update the inventory table
    UPDATE inventory 
    SET stock_level = stock_level - med_qty,
        total_sold = total_sold + med_qty
    WHERE medicine_id = med_id;
  END LOOP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_deduct_inventory
AFTER INSERT ON orders
FOR EACH ROW
EXECUTE FUNCTION deduct_inventory_on_order();
