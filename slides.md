---
theme: ./theme
highlighter: shiki
lineNumbers: false
info: |
  ## Introduction to query planning

  First presented at [GPN21](https://entropia.de/GPN21).
drawings:
  persist: false
transition: slide-left
css: unocss
layout: cover
background: https://source.unsplash.com/collection/94734566/1920x1080
title: Postgres Query Planning
---

# Postgres Query Planning
## *How I learned to love the Query Planner*


---
layout: statement
---

# Two parts

## Some fundamentals

## How does Postgres do it?

<!--
* some theory, relational Algebra, some ideas for optimisation
* actual postgres query plans, how to read them, how the planner works
-->

---
layout: section
---

# Part I: Relational Algebra

*yawn*

<!--
* theoretical foundation
* won't go super in depth, but some useful concepts
-->

---
layout: default
---

## A simple database

### `customer`
@src: ./markdown/tables/customer_full.md

<br />
<br />

### `orders`
@src: ./markdown/tables/order_full.md

---
layout: two-cols
---

## Projection Π

```sql {|1}
SELECT id, name
FROM customer;
```

::right::

@src: ./markdown/tables/customer_full.md

<div class='text-center text-3xl p-5'>
    <tabler-arrow-down /> Π<sub>customer_id, name</sub>
</div>

@src: ./markdown/tables/customer_projected.md

---
layout: two-cols
---

## Selection σ

```sql {|3}
SELECT id, name
FROM customer
WHERE registration_date > 2021-01-01;
```

::right::

@src: ./markdown/tables/customer_full.md

<div class='text-center text-3xl p-5'>
    <tabler-arrow-down /> σ<sub>registration_date > 2021-01-01</sub>
</div>

@src: ./markdown/tables/customer_selected.md

---
layout: two-cols
---

## Join ⋈<sub>θ</sub>

```sql {|3}
SELECT name, product_id, order_time
FROM customer
JOIN orders ON (customer.id = orders.customer_id)
```

@src: ./markdown/tables/customer_full.md

<div class='text-center text-3xl p-5'>
    <tabler-plus />
</div>

@src: ./markdown/tables/order_full.md

::right::

<div class='text-center text-3xl p-5'>
    <tabler-arrow-down /> ⋈<sub>id = customer_id</sub>
</div>

@src: ./markdown/tables/customer_order_join.md

---
layout: section
---

## Expression Trees

<!--
so far: just parts of queries.
Now: entire queries.
-->

---
layout: two-cols
---

```sql
SELECT name
FROM customer
WHERE registration_date > 2021-01-01;
```

::right::

```mermaid
flowchart TB
    tb(customer) --> sl
    sl(σ<sub>registration_date > 2021-01-01</sub>) -->  pr(Π<sub>name</sub>) 

```

---
layout: default
---

## Rule: Splitting Projections

$R$ with columns $a, b, c$.

$\Pi_{a}(R) = \Pi_{a}(\Pi_{a,b}(R))$

<v-click>

We can *throw away* some columns earlier if we want to.
</v-click>

---
layout: two-cols
---

## Optimisation: Project early

```sql
SELECT name
FROM customer
WHERE registration_date > 2021-01-01;
```

<v-clicks>

* throw away columns we don't need as early as possible
* keep selections, joins, … in mind!
</v-clicks>

::right::

```mermaid
flowchart TB
    tb(customer) --> pr1
    pr1(Π<sub>name, registration_date</sub>) --> sl
    sl(σ<sub>registration_date > 2021-01-01</sub>) -->  pr2(Π<sub>name</sub>) 
```

---
layout: two-cols
---

## Join, where

```sql
SELECT name, product_id, order_time
FROM customer
JOIN orders ON (customer.id = orders.customer_id)
WHERE name = 'Eve Entropia'
AND order_time > 2022-01-01;
```

::right::

```mermaid
flowchart TB
    tb1(customer) --> j
    tb2(orders) --> j
    j("⋈<sub>id = customer_id</sub>") --> sl
    sl("σ<sub>name = 'Eve Entropia' ∧ order_time > 2022-01-01</sub>") --> pr
    pr(Π<sub>name, product_id, order_time</sub>)
```

---
layout: default
---

## Rule: Splitting Selections

$$
\sigma_{a \wedge b}(R) = \\
\sigma_{a}(\sigma_{b}(R)) = \\
\sigma_{b}(\sigma_{a}(R))
$$

<v-clicks>

* conditions joined by *and* can be split
* order does not matter
</v-clicks>

---
layout: two-cols
---

## Optimisation: Push up selection

```sql {|5}
SELECT name, product_id, order_time
FROM customer
JOIN orders ON (customer.id = orders.customer_id)
WHERE name = 'Eve Entropia'
AND order_time > 2022-01-01;
```

::right::

```mermaid
flowchart TB
    tb1(customer) --> j
    tb2(orders) --> j
    j("⋈<sub>id = customer_id</sub>") --> sl1
    sl1("σ<sub>name = 'Eve Entropia'</sub>") --> sl2
    sl2("σ<sub>order_time > 2022-01-01</sub>") --> pr
    pr(Π<sub>name, product_id, order_time</sub>)
```

---
layout: two-cols
---

## Optimisation: Push up selection
```mermaid
flowchart TB
    tb1(customer) --> j
    tb2(orders) --> j
    j("⋈<sub>id = customer_id</sub>") --> sl1
    sl1("σ<sub>name = 'Eve Entropia'</sub>") --> sl2
    sl2("σ<sub>order_time > 2022-01-01</sub>") --> pr
    pr(Π<sub>name, product_id, order_time</sub>)
```

::right::

```mermaid
flowchart TB
    tb1(customer) --> sl1
    tb2(orders) --> sl2
    sl1("σ<sub>name = 'Eve Entropia'</sub>") --> j
    sl2("σ<sub>order_time > 2022-01-01</sub>") --> j
    j("⋈<sub>id = customer_id</sub>") --> pr
    pr(Π<sub>name, product_id, order_time</sub>)
```

<!--
* Reduce size of intermediary sets!
* Don't need to join all customers with all orders ever (potentially huge!)
* Helps actual databases even more, as we'll see later
-->

---
layout: two-cols
---

## More complex join
```sql {|3-4}
SELECT *
FROM customer
JOIN orders ON (customer.id = orders.customer_id)
JOIN product ON (orders.product_id = product.id);
```

<v-click>

* Or… the other way around?
</v-click>

::right::

```mermaid
flowchart TB
    tb1(customer) --> j1
    tb2(orders) --> j1
    j1("⋈<sub>id = customer_id</sub>") --> j2
    tb3(product) --> j2
    j2("⋈<sub>product_id = id</sub>") --> pr
    pr(Π<sub>*</sub>)
```

---
layout: section
---

## Choices

<v-click>

sigh…
</v-click>

<!--
* suddenly, we have choices to make
-->

---
layout: default
---

## Ambiguities…

<v-clicks>

* Which is more efficient depends on
    * Table sizes
    * WHERE-conditions
    * actual data in the tables (!)
* And it gets worse:
    * Different join implementations
    * Indices?
</v-clicks>

---
layout: default
---

## Where we are

* Some optimisations (almost) always make sense
    * Pushing up selections
    * Projecting early
* Some choices are harder and less obvious
    * Simple rules not enough
    * But: Relational Algebra as basis for *correctnes*

<!--
* Worst thing that could happen: We optimize a query and it's *incorrect*
* So, we get a different result than the one from the 'naive' plan
ca. 20 min
-->

---
layout: default
class: bootstrap
---

<pev2 :plan-source="`
[
  {
    &quot;Plan&quot;: {
      &quot;Node Type&quot;: &quot;Seq Scan&quot;,
      &quot;Parallel Aware&quot;: false,
      &quot;Async Capable&quot;: false,
      &quot;Relation Name&quot;: &quot;product&quot;,
      &quot;Schema&quot;: &quot;public&quot;,
      &quot;Alias&quot;: &quot;product&quot;,
      &quot;Startup Cost&quot;: 0.00,
      &quot;Total Cost&quot;: 1791.00,
      &quot;Plan Rows&quot;: 924,
      &quot;Plan Width&quot;: 9,
      &quot;Output&quot;: [&quot;id&quot;, &quot;has_foo&quot;, &quot;length_of_bar&quot;],
      &quot;Filter&quot;: &quot;(product.length_of_bar < '1'::double precision)&quot;,
      &quot;Shared Hit Blocks&quot;: 0,
      &quot;Shared Read Blocks&quot;: 0,
      &quot;Shared Dirtied Blocks&quot;: 0,
      &quot;Shared Written Blocks&quot;: 0,
      &quot;Local Hit Blocks&quot;: 0,
      &quot;Local Read Blocks&quot;: 0,
      &quot;Local Dirtied Blocks&quot;: 0,
      &quot;Local Written Blocks&quot;: 0,
      &quot;Temp Read Blocks&quot;: 0,
      &quot;Temp Written Blocks&quot;: 0
    },
    &quot;Planning&quot;: {
      &quot;Shared Hit Blocks&quot;: 0,
      &quot;Shared Read Blocks&quot;: 0,
      &quot;Shared Dirtied Blocks&quot;: 0,
      &quot;Shared Written Blocks&quot;: 0,
      &quot;Local Hit Blocks&quot;: 0,
      &quot;Local Read Blocks&quot;: 0,
      &quot;Local Dirtied Blocks&quot;: 0,
      &quot;Local Written Blocks&quot;: 0,
      &quot;Temp Read Blocks&quot;: 0,
      &quot;Temp Written Blocks&quot;: 0
    }
  }
]
`" plan-query="query"></pev2>


---
layout: default
---

## Recipe: Slow query
* EXPLAIN ANALYZE
    * look for big mismatches between estimated and actual rows
    * not using indices you think it should?
* Turn off certain planning nodes
    * compare costs with original plan
    * only ever do this for debugging!
