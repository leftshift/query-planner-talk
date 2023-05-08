SELECT customer_id, name, order_id, time 
FROM customer
NATURAL JOIN order
WHERE age < 25;
