CREATE TABLE customer (
    id serial PRIMARY KEY,
    name text,
    registration_date date
);

CREATE TABLE orders (
    id serial PRIMARY KEY,
    customer_id integer,
    product_id integer,
    order_time date
);
