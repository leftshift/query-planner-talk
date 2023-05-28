TRUNCATE product;

INSERT INTO product
    SELECT
        id,
        floor(random() * 4) as number_of_foos,
        random() * 100 as length_of_bar
    FROM
        generate_series(1, 100000) as id;
