--USAGE: psql -f skrypt_bazowy.sql

CREATE DATABASE maps;

\c maps

CREATE USER pg WITH PASSWORD 'pg';
ALTER ROLE pg SET client_encoding TO 'utf8';
ALTER ROLE pg SET default_transaction_isolation TO 'read committed';
ALTER ROLE pg SET timezone TO 'UTC';
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO pg;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO pg;

-- TODO: rethink types and subtypes
CREATE TYPE possible_type as ENUM ('natura', 'urbanistyka');
CREATE TYPE subtypes as ENUM ('park','zamek','ruiny'); 

CREATE TABLE attractions (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    coords POINT NOT NULL,
    type possible_type NOT NULL,
    subtype subtypes NOT NULL,
    interactivity INTEGER NOT NULL CHECK (interactivity>0 and interactivity<11),
    time_it_takes INTEGER NOT NULL,
    rating FLOAT,
    description TEXT NOT NULL DEFAULT 'Amazing place worth checking out.'
);

CREATE TABLE photos (
    id SERIAL PRIMARY KEY,
    attraction_id INTEGER NOT NULL REFERENCES attractions(id),
    photo TEXT,
    caption TEXT DEFAULT 'Check out this amazing photo I took.'
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL DEFAULT 'Jan',
    surname TEXT NOT NULL DEFAULT 'Kowalski',
    mail TEXT UNIQUE NOT NULL DEFAULT 'jan@kowalski.com'
);

CREATE TYPE role AS ENUM ('admin','user');

CREATE TABLE logins (
    user_id INTEGER PRIMARY KEY REFERENCES users(id),
    login TEXT UNIQUE NOT NULL DEFAULT 'jankowalski',
    password TEXT NOT NULL,
    role role NOT NULL DEFAULT 'user'
);

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    author INTEGER NOT NULL REFERENCES users(id),
    content TEXT NOT NULL DEFAULT 'I agree.',
    votes INTEGER NOT NULL DEFAULT 0,
    attraction INTEGER NOT NULL REFERENCES attractions(id),
    parent INTEGER REFERENCES comments(id)
);

CREATE TABLE rankings (
    user_id INTEGER REFERENCES users(id),
    points INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE challenges (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL DEFAULT 'Amazing challenge',
    description TEXT NOT NULL,
    points INTEGER NOT NULL DEFAULT 10
);

CREATE TABLE challenges_finished (
    user_id INTEGER NOT NULL REFERENCES users(id),
    challenge_id INTEGER NOT NULL REFERENCES challenges(id)
);

CREATE TABLE challenge_attractions (
    challenge_id INTEGER NOT NULL REFERENCES challenges(id),
    attraction_id INTEGER NOT NULL REFERENCES attractions(id)
);

CREATE OR REPLACE FUNCTION update_total_amount()
RETURNS TRIGGER AS $$
DECLARE
  row RECORD;
BEGIN
    FOR row IN SELECT id FROM users LOOP
      UPDATE rankings
      SET points = (SELECT SUM(points) FROM challenges_finished JOIN challenges ON challenge_id=id WHERE user_id=row.id)
      WHERE user_id=row.id;
    END LOOP;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ranking_trigger
AFTER INSERT OR UPDATE OR DELETE ON challenges_finished
FOR EACH STATEMENT
EXECUTE FUNCTION update_total_amount();




-- Inserting sample data into the attractions table
INSERT INTO attractions (name, coords, type, subtype, interactivity, time_it_takes, rating, description) 
VALUES 
  ('Central Park', POINT(40.785091, -73.968285), 'natura', 'park', 8, 120, 4.5, 'A beautiful park in the heart of New York City.'),
  ('Wawel Castle', POINT(50.054622, 19.937156), 'urbanistyka', 'zamek', 7, 90, 4.7, 'Historic castle located in Krakow, Poland.'),
  ('Roman Forum', POINT(41.892166, 12.485004), 'urbanistyka', 'ruiny', 6, 60, 4.3, 'Ancient ruins of the Roman Forum in Rome, Italy.');

-- Inserting sample data into the photos table
INSERT INTO photos (attraction_id, caption) 
VALUES 
  (1, 'Beautiful scenery of Central Park.'),
  (2, 'A breathtaking view of Wawel Castle.'),
  (3, 'Amazing ancient ruins of the Roman Forum.');

-- Inserting sample data into the users table
INSERT INTO users (name, surname, mail) 
VALUES 
  ('John', 'Doe', 'john.doe@example.com'),
  ('Alice', 'Smith', 'alice.smith@example.com');

-- Inserting sample data into the logins table
INSERT INTO logins (user_id, login, password, role) 
VALUES 
  (1, 'johndoe', 'password123', 'admin'),
  (2, 'alicesmith', 'password456', 'user');

-- Inserting sample data into the comments table
INSERT INTO comments (author, content, votes, attraction) 
VALUES 
  (1, 'Great place!', 10, 1),
  (2, 'I love this castle!', 8, 2),
  (1, 'Amazing history here.', 5, 3);

-- Inserting sample data into the challenges table
INSERT INTO challenges (description) 
VALUES 
  ('First challenge'),
  ('Second challenge'),
  ('Third challenge');

-- Initialize rankings
INSERT INTO rankings (user_id)
SELECT id FROM users;


-- Inserting sample data into the challenges_finished table
INSERT INTO challenges_finished (user_id, challenge_id) 
VALUES 
  (1, 1),
  (2, 2),
  (1, 3);



