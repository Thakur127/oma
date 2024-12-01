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


CREATE TRIGGER set_updated_at_items
BEFORE UPDATE ON public.items
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


CREATE TRIGGER set_updated_at_orders
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();



CREATE TYPE public.order_item_type AS (
    item_id bigint,
    quantity int
);

-- this function creates order internally
create or replace function create_order(
    o_store_id bigint, 
    o_items order_item_type[], 
    o_status order_status default 'pending'::order_status
    )
returns table(
    "id" bigint, 
    "total" numeric(10, 2), 
    "status" order_status, 
    "created_at" timestamp, 
    "store_id" bigint
    )
as $$
declare new_order_id bigint;
declare item order_item_type;
declare order_total numeric(10, 2) := 0;
declare item_total numeric(10, 2) := 0;
begin

    -- create the order
    insert into public.orders(store_id, total, status) 
    values (o_store_id, '0', o_status) returning orders.id into new_order_id;

    -- add items in the order
    foreach item in array o_items
    loop
        insert into public.order_items(order_id, item_id, quantity) values (new_order_id, item.item_id, item.quantity);
        
        -- calculate item total
        select price * item.quantity into item_total from public.items where items.id = item.item_id;

        -- add item total into order total
        order_total := order_total + item_total;
    end loop;

    -- update the order total
    update public.orders set total = order_total where orders.id = new_order_id;

    -- return the order details
    return query 
        select 
            public.orders.id, 
            public.orders.total, 
            public.orders.status, 
            public.orders.created_at, 
            public.orders.store_id 
        from public.orders 
        where public.orders.id = new_order_id;
end;
$$ language plpgsql;