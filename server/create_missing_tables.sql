
-- Create missing tables from schema.ts

-- Price Lists table
CREATE TABLE IF NOT EXISTS price_lists (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_default BOOLEAN NOT NULL DEFAULT false,
  valid_from TIMESTAMPTZ,
  valid_to TIMESTAMPTZ,
  store_code VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Price List Items table
CREATE TABLE IF NOT EXISTS price_list_items (
  id SERIAL PRIMARY KEY,
  price_list_id INTEGER REFERENCES price_lists(id) ON DELETE CASCADE NOT NULL,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  store_code VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Order Change History table
CREATE TABLE IF NOT EXISTS order_change_history (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  changed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  ip_address VARCHAR(45) NOT NULL,
  user_id INTEGER,
  user_name VARCHAR(255) NOT NULL,
  action VARCHAR(50) NOT NULL DEFAULT 'edit',
  detailed_description TEXT NOT NULL,
  store_code VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Purchase Orders table
CREATE TABLE IF NOT EXISTS purchase_orders (
  id SERIAL PRIMARY KEY,
  order_number VARCHAR(50) NOT NULL,
  supplier_id INTEGER REFERENCES suppliers(id),
  status VARCHAR(20) DEFAULT 'pending',
  expected_delivery_date TIMESTAMPTZ,
  notes TEXT,
  total NUMERIC(10,2) DEFAULT 0,
  store_code VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- General Settings table
CREATE TABLE IF NOT EXISTS general_settings (
  id SERIAL PRIMARY KEY,
  setting_code VARCHAR(50) NOT NULL UNIQUE,
  setting_name VARCHAR(255) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_price_lists_code ON price_lists(code);
CREATE INDEX IF NOT EXISTS idx_price_lists_is_active ON price_lists(is_active);
CREATE INDEX IF NOT EXISTS idx_price_lists_is_default ON price_lists(is_default);

CREATE INDEX IF NOT EXISTS idx_price_list_items_price_list_id ON price_list_items(price_list_id);
CREATE INDEX IF NOT EXISTS idx_price_list_items_product_id ON price_list_items(product_id);

CREATE INDEX IF NOT EXISTS idx_order_change_history_order_id ON order_change_history(order_id);
CREATE INDEX IF NOT EXISTS idx_order_change_history_changed_at ON order_change_history(changed_at);

CREATE INDEX IF NOT EXISTS idx_purchase_orders_order_number ON purchase_orders(order_number);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_supplier_id ON purchase_orders(supplier_id);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_status ON purchase_orders(status);

CREATE INDEX IF NOT EXISTS idx_general_settings_setting_code ON general_settings(setting_code);
CREATE INDEX IF NOT EXISTS idx_general_settings_is_active ON general_settings(is_active);

-- Add price_list_id column to store_settings if it doesn't exist
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS price_list_id INTEGER REFERENCES price_lists(id);
