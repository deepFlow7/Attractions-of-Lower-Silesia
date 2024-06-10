--USAGE: psql -f skrypt_bazowy.sql

CREATE DATABASE maps;

\c maps

CREATE OR UPDATE USER pg WITH PASSWORD 'pg';
ALTER ROLE pg SET client_encoding TO 'utf8';
ALTER ROLE pg SET default_transaction_isolation TO 'read committed';
ALTER ROLE pg SET timezone TO 'UTC';
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO pg;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO pg;

CREATE TYPE possible_type as ENUM ('natura', 'urbanistyka');
CREATE TYPE subtypes AS ENUM (
    'zamek',
    'kościół',
    'muzeum',
    'szczyt górski',
    'formacja skalna',
    'kopalnia',
    'jaskinia',
    'twierdza',
    'sanktuarium',
    'wodospad',
    'ruiny',
    'kompleks podziemny',
    'ogród botaniczny',
    'zabytek architektury',
    'ogród',
    'makieta kolejowa',
    'centrum edukacyjne',
    'ogród zoologiczny',
    'zbiorniki wodne',
    'bazylika'
);

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

CREATE TYPE thoughts AS ENUM ('been there', 'want to visit', 'indifferent', 'not interested');

CREATE TABLE favourites (
  user_id INTEGER REFERENCES users(id),
  attraction_id INTEGER REFERENCES attractions(id),
  favourite BOOLEAN NOT NULL DEFAULT false,
  interest thoughts NOT NULL DEFAULT 'indifferent',
  UNIQUE (user_id,attraction_id)
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

CREATE OR REPLACE FUNCTION insert_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO rankings(user_id) VALUES (NEW.id);
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE TRIGGER users_trigger
AFTER INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION insert_new_user();
