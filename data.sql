CREATE TABLE users (
    username text PRIMARY KEY,
    password text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    photo_url text,
    email text NOT NULL,
    is_admin boolean NOT NULL
);

CREATE TABLE companies (
    handle text PRIMARY KEY,
    name text NOT NULL UNIQUE,
    num_employees integer,
    description text,
    logo_url text
);
CREATE TABLE jobs (
    id SERIAL PRIMARY KEY, 
    title text NOT NULL,
    salary float NOT NULL,
    equity float NOT NULL CHECK (equity <= 1), 
    company_handle text REFERENCES NOT NULL companies ON DELETE CASCADE, 
    date_posted date DATETIME, 
)
INSERT INTO companies 
            (handle, name, num_employees, description, logo_url)
            VALUES ('a', 'a', 1, 'a1 sauce', 'sauce') 
            RETURNING handle, name, num_employees, description, logo_url;
INSERT INTO companies 
              (handle, name, num_employees, description, logo_url)
            VALUES ('b', 'b', 2, 'b2 vitamins', 'vitamins') 
            RETURNING handle, name, num_employees, description, logo_url;
INSERT INTO companies 
              (handle, name, num_employees, description, logo_url)
            VALUES ('c', 'c', 3, 'c3po', 'androids') 
            RETURNING handle, name, num_employees, description, logo_url;