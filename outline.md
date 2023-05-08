# Short intro about contents:
* Why is query planning interesting?
    * How the heck do we go from SQL to a result?
    * Will talk about some of the basics involved
* Optimisation
    * How to get to query plan
    * How to read query plans
    * fast -> slow: Small change in query, suddenly super slow

## Relational Algebra (the boring part)

### Aside: Note about nomenclature:
I will try to use the words Postgres uses wherever possible. There will be some inaccuracies and hand-waving. This might make people who are very particular about relational theory very unhappy.

### Relational algebra
* Theoretical foundation for relational databases
* Basic operators
* Basic rules for *correctly* rearranging these operators

```sql
SELECT id, name, age
FROM customer
WHERE age < 25;
```
