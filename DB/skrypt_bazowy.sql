--USAGE: psql -f skrypt_bazowy.sql

CREATE DATABASE maps;

\c maps

ALTER USER pg WITH PASSWORD 'pg';
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
    description TEXT NOT NULL 
);

CREATE TABLE photos (
    id SERIAL PRIMARY KEY,
    attraction_id INTEGER NOT NULL REFERENCES attractions(id),
    photo TEXT NOT NULL,
    caption TEXT 
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    surname TEXT NOT NULL,
    mail TEXT UNIQUE NOT NULL
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
    login TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role role NOT NULL DEFAULT 'user'
);

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    author INTEGER NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    votes INTEGER NOT NULL DEFAULT 0,
    attraction INTEGER NOT NULL REFERENCES attractions(id),
    parent INTEGER REFERENCES comments(id)
);

CREATE TABLE challenges (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    coords POINT NOT NULL,
    zoom INTEGER NOT NULL,
    points INTEGER NOT NULL DEFAULT 0 
);

CREATE TABLE challenges_started (
    user_id INTEGER NOT NULL REFERENCES users(id),
    challenge_id INTEGER NOT NULL REFERENCES challenges(id),
    start_date timestamp NOT NULL,
    finished_date timestamp,
    points INTEGER NOT NULL DEFAULT 0,
    bonus_points INTEGER NOT NULL DEFAULT 0,
    UNIQUE (user_id, challenge_id)
);

CREATE TABLE challenge_attractions (
    challenge_id INTEGER NOT NULL REFERENCES challenges(id),
    attraction_id INTEGER NOT NULL REFERENCES attractions(id),
    points INTEGER NOT NULL DEFAULT 10,
    UNIQUE (challenge_id, attraction_id)
);

CREATE TABLE visited_challenge_attractions (
    challenge_id INTEGER NOT NULL REFERENCES challenges(id),
    attraction_id INTEGER NOT NULL REFERENCES attractions(id),
    user_id INTEGER NOT NULL REFERENCES users(id),
    UNIQUE (challenge_id, attraction_id, user_id)
);

CREATE OR REPLACE FUNCTION update_challenge_points()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE challenges
    SET points = points - COALESCE(OLD.points, 0) + NEW.points
    WHERE challenges.id = NEW.challenge_id;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER challenge_points_trigger
AFTER INSERT OR UPDATE ON challenge_attractions
FOR EACH ROW
EXECUTE FUNCTION update_challenge_points();

CREATE OR REPLACE FUNCTION update_user_points()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE challenges_started
    SET points = points + (SELECT points FROM challenge_attractions 
        WHERE challenge_attractions.challenge_id = NEW.challenge_id AND 
        challenge_attractions.attraction_id = NEW.attraction_id)
    WHERE user_id = NEW.user_id AND challenge_id = NEW.challenge_id;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_points_trigger
AFTER INSERT ON visited_challenge_attractions
FOR EACH ROW
EXECUTE FUNCTION update_user_points();


CREATE OR REPLACE FUNCTION update_bonus_points()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE challenges_started
    SET bonus_points = GREATEST((120 - EXTRACT(EPOCH FROM (NEW.finished_date - NEW.start_date)) / 3600) * 5, 0)
    WHERE user_id = NEW.user_id and challenge_id = NEW.challenge_id;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_bonus_points
AFTER UPDATE OF finished_date ON challenges_started
FOR EACH ROW
EXECUTE FUNCTION update_bonus_points();