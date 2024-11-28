CREATE TABLE IF NOT EXISTS "public"."stores" (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  description VARCHAR(256),
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "store_name_idx" ON "public"."stores"("name");

-- enabling row level security so no anon user can make changes to database
ALTER TABLE "public"."stores" ENABLE ROW LEVEL SECURITY;

-- creating viewable policy for users with anon_key
CREATE POLICY "Anonymous user can view stores"
ON "public"."stores" for SELECT
TO anon
USING (TRUE);




CREATE TABLE IF NOT EXISTS "public"."items" (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  stock_count INT,
  store_id BIGINT,
  is_active BOOLEAN DEFAULT TRUE,

  CONSTRAINT "stock_count_gte_0" CHECK ("stock_count" >= 0),
  FOREIGN KEY (store_id) REFERENCES "public"."stores"("id")
);

CREATE INDEX IF NOT EXISTS "item_name_idx" ON "public"."items"("name");

-- enabled RLS only user with service key can make changes
ALTER TABLE "public"."items" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anon users can view items"
ON "public"."items" FOR SELECT
TO anon
USING (TRUE);




CREATE TYPE "order_status" AS ENUM ('pending', 'fulfilled');

CREATE TABLE IF NOT EXISTS "public"."orders" (
  id BIGSERIAL PRIMARY KEY,
  total NUMERIC(10, 2) NOT NULL,
  status order_status,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE "public"."orders" ENABLE ROW LEVEL SECURITY;

-- this policy allows anon user to create orders
CREATE POLICY "Anon user can create orders"
ON "public"."orders" FOR INSERT
TO anon
WITH CHECK ( TRUE );

-- policy for anon users to view orders
CREATE POLICY "Anon users can view orders"
ON "public"."orders" FOR SELECT
TO anon
USING (TRUE);



CREATE TABLE IF NOT EXISTS "public"."orders_items" (
  order_id BIGINT NOT NULL,
  item_id BIGINT NOT NULL,
  quantity INT NOT NULL CHECK(quantity > 0),

  PRIMARY KEY ("order_id", "item_id"),
  FOREIGN KEY (order_id) REFERENCES "public"."orders"("id"),
  FOREIGN KEY (item_id) REFERENCES "public"."items"("id")
);

ALTER TABLE "public"."orders_items" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anon users add items in orders"
ON "public"."orders_items" FOR INSERT
TO anon
WITH CHECK ( TRUE );

-- policy to view orders for anon users
CREATE POLICY "Anon users can view orders items"
ON "public"."orders_items" FOR SELECT
TO anon
USING (TRUE);