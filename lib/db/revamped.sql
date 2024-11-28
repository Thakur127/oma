create table if not exists public.stores (
    id bigserial primary key,
    name varchar(128) not null,
    description varchar(256),
    image_url text,
    is_active boolean default true,
    is_deleted boolean default false,
    updated_at timestamp default current_timestamp,
    created_at timestamp default current_timestamp
);


create index if not exists "stores_name_idx" on public.stores(id);

alter table stores enable row level security;

-- all user view policy
create policy "Everyone allowed to view stores"
on public.stores for select
to anon
using (true);



--------------------------------------------------------------------------------

create table if not exists public.categories (
    id bigserial primary key,
    name varchar(128) not null,
    image_url text,
    is_active boolean default true,
    is_deleted boolean default false,
    store_id bigint not null references stores(id),
    updated_at timestamp default current_timestamp,
    created_at timestamp default current_timestamp
);

create index if not exists "categories_name_idx" on public.categories(id);
create index if not exists "categories_store_id_idx" on public.categories(store_id);

alter table categories enable row level security;


-- all user view policy
create policy "Everyone allowed to view categories"
on public.categories for select
to anon
using (true);



----------------------------------------------------------------------------------


create table if not exists public.items (
    id bigserial primary key,
    name varchar(128) not null,
    price numeric(10, 2) not null,
    stock_count int check(stock_count >= 0),
    category_id bigint not null references categories(id),
    store_id bigint not null references stores(id),
    is_active boolean default true,
    is_deleted boolean default false,
    updated_at timestamp default current_timestamp,
    created_at timestamp default current_timestamp
);


create index if not exists "items_name_idx" on public.items(id);
create index if not exists "items_store_id_idx" on public.items(store_id);

alter table items enable row level security;

-- all user view policy
create policy "Everyone allowed to view items"
on public.items for select
to anon
using (true);


----------------------------------------------------------------------------------

create type "order_status" as enum ('pending', 'fulfilled');


create table if not exists public.orders (
    id bigserial primary key,
    store_id bigint not null references stores(id),
    total numeric(10, 2) not null,
    status order_status not null,
    is_deleted boolean default false,
    updated_at timestamp default current_timestamp,
    created_at timestamp default current_timestamp
);

create index if not exists "orders_store_id_idx" on public.orders(store_id);



-----------------------------------------------------------------------------------

create table if not exists public.order_items (
    order_id bigint not null references orders(id),
    item_id bigint not null references items(id),
    quantity int check(quantity > 0),
    primary key (order_id, item_id),
    constraint "unique_order_item" unique (order_id, item_id)
)


-- triggers to update the update_at column

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER set_updated_at_stores
BEFORE UPDATE ON public.stores
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


CREATE TRIGGER set_updated_at_categories
BEFORE UPDATE ON public.categories
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


-- since the items table and order table has frequent updates
-- this way is not so optimised, we will update value manually
-- during data updation

-- CREATE TRIGGER set_updated_at_items
-- BEFORE UPDATE ON public.items
-- FOR EACH ROW
-- EXECUTE FUNCTION update_updated_at_column();


-- CREATE TRIGGER set_updated_at_orders
-- BEFORE UPDATE ON public.orders
-- FOR EACH ROW
-- EXECUTE FUNCTION update_updated_at_column();
