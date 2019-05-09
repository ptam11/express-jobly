CREATE TABLE users (
    username text PRIMARY KEY,
    password text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    photo_url text,
    email text NOT NULL,
    is_admin boolean NOT NULL DEFAULT false
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
    company_handle text NOT NULL REFERENCES companies ON DELETE CASCADE, 
    date_posted TIMESTAMP without time zone
);
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
INSERT INTO jobs
              (title, salary, equity, company_handle, date_posted)
            Values ('peon', 1.00, 0, 'c', CURRENT_TIMESTAMP);
INSERT INTO jobs
              (title, salary, equity, company_handle, date_posted)
            Values ('tester', 1000.00, 0, 'b', CURRENT_TIMESTAMP);
INSERT INTO users
              (username, first_name, last_name, email, photo_url, is_admin)
            Values ('ptam', 'parco', 'tam', 'ptam@rithm.com', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCZRdW_GBvY_lzXhuDxX--xTn7CmoBBIU3kpmMOj6gBTF2lLmp', false);
INSERT INTO users
              (username, first_name, last_name, email, photo_url, is_admin)
            Values ('jmatthias', 'json', 'mattttttt', 'jmatt@rithm.com', 'http://japamat.com/imgs/headshot.jpg', true);
INSERT INTO users
              (username, first_name, last_name, email, photo_url, is_admin)
            Values ('rb', 'ricky', 'b', 'rb@rithm.com', 'https://www.guidedogs.org/wp-content/uploads/2018/01/Mobile.jpg', false);