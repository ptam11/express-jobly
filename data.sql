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
    num_employes integer,
    description text,
    logo_url text
);
