--USAGE: psql -f db_script.sql

CREATE DATABASE maps;

\c maps

DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_user WHERE usename = 'pg') THEN
        CREATE USER pg WITH PASSWORD 'pg';
    ELSE
        ALTER USER pg WITH PASSWORD 'pg';
    END IF;
END $$;

ALTER ROLE pg SET client_encoding TO 'utf8';
ALTER ROLE pg SET default_transaction_isolation TO 'read committed';
ALTER ROLE pg SET timezone TO 'UTC';
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO pg;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO pg;

---------- TABLES ----------------------------------------------------------------------------------------
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
    'bazylika',
    'krasnal'
);

CREATE TABLE attractions (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    coords POINT NOT NULL,
    type possible_type NOT NULL,
    subtype subtypes NOT NULL,
    interactivity INTEGER NOT NULL CHECK (interactivity>0 and interactivity<11),
    time_it_takes INTEGER NOT NULL,
    rating FLOAT NOT NULL CHECK (rating >= 0 and rating <= 10),
    description TEXT NOT NULL 
);

CREATE TABLE photos (
    id SERIAL PRIMARY KEY,
    attraction_id INTEGER NOT NULL REFERENCES attractions(id) ON DELETE CASCADE,
    photo TEXT NOT NULL,
    caption TEXT 
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    surname TEXT NOT NULL,
    mail TEXT UNIQUE NOT NULL
);

CREATE TABLE blocked_users (
    user_id INTEGER PRIMARY KEY,
    since timestamp NOT NULL
);

CREATE TABLE favourites (
    user_id INTEGER REFERENCES users(id),
    attraction_id INTEGER REFERENCES attractions(id) ON DELETE CASCADE
);

CREATE TABLE wants_to_visit (
    user_id INTEGER REFERENCES users(id),
    attraction_id INTEGER REFERENCES attractions(id) ON DELETE CASCADE
);

CREATE TYPE role AS ENUM ('admin','user');

CREATE TABLE logins (
    user_id INTEGER PRIMARY KEY REFERENCES users(id),
    login TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role role NOT NULL DEFAULT 'user'
);

CREATE TABLE ratings (
    user_id INTEGER REFERENCES users(id) NOT NULL,
    attraction_id INTEGER NOT NULL REFERENCES attractions(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 0 and rating <= 10),
    UNIQUE (user_id, attraction_id)
);

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    author INTEGER NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    attraction INTEGER NOT NULL REFERENCES attractions(id) ON DELETE CASCADE,
    vote_sum INTEGER DEFAULT 0
);

CREATE TYPE approval_type AS ENUM ('approve', 'disapprove');
CREATE TABLE comment_approvals (
    comment_id INTEGER NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
    voter INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    approval_status approval_type NOT NULL,
    UNIQUE (comment_id, voter)
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
    challenge_id INTEGER NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    start_date timestamp NOT NULL,
    finished_date timestamp,
    points INTEGER NOT NULL DEFAULT 0,
    bonus_points INTEGER NOT NULL DEFAULT 0,
    UNIQUE (user_id, challenge_id)
);

CREATE TABLE challenge_attractions (
    challenge_id INTEGER NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    attraction_id INTEGER NOT NULL REFERENCES attractions(id) ON DELETE CASCADE,
    points INTEGER NOT NULL DEFAULT 10,
    UNIQUE (challenge_id, attraction_id)
);

CREATE TABLE visited_challenge_attractions (
    challenge_id INTEGER NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    attraction_id INTEGER NOT NULL REFERENCES attractions(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id),
    UNIQUE (challenge_id, attraction_id, user_id)
);

----------  TRIGGERS -------------------------------------------------------------------------------------
--- CHALLENGE POINTS ---
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

CREATE OR REPLACE FUNCTION subtract_user_points()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE challenges_started
    SET points = points - (SELECT points FROM challenge_attractions 
        WHERE challenge_attractions.challenge_id = OLD.challenge_id AND 
        challenge_attractions.attraction_id = OLD.attraction_id)
    WHERE user_id = OLD.user_id AND challenge_id = OLD.challenge_id;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_points_delete_trigger
AFTER DELETE ON visited_challenge_attractions
FOR EACH ROW
EXECUTE FUNCTION subtract_user_points();

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

CREATE OR REPLACE FUNCTION subtract_challenge_points()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE challenges
    SET points = points - OLD.points
    WHERE id = OLD.challenge_id;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER challenge_points_delete_trigger
AFTER DELETE ON challenge_attractions
FOR EACH ROW
EXECUTE FUNCTION subtract_challenge_points();

--- RATING ---
CREATE OR REPLACE FUNCTION calculate_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE attractions
    SET rating = (
        SELECT AVG(rating)
        FROM ratings
        WHERE NEW.attraction_id = ratings.attraction_id
    )
    WHERE id = NEW.attraction_id;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_rating_trigger
AFTER INSERT OR UPDATE ON ratings
FOR EACH ROW
EXECUTE FUNCTION calculate_rating();

--- COMMENT APPROVAL ---
CREATE OR REPLACE FUNCTION handle_comment_approval_insert()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE comments
  SET vote_sum = vote_sum + CASE NEW.approval_status
                               WHEN 'approve' THEN 1
                               WHEN 'disapprove' THEN -1
                             END
  WHERE id = NEW.comment_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION handle_comment_approval_update()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.approval_status <> NEW.approval_status THEN
    UPDATE comments
    SET vote_sum = vote_sum + CASE NEW.approval_status
                                 WHEN 'approve' THEN 2
                                 WHEN 'disapprove' THEN -2
                               END
    WHERE id = NEW.comment_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION handle_comment_approval_delete()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE comments
  SET vote_sum = vote_sum + CASE OLD.approval_status
                               WHEN 'approve' THEN -1
                               WHEN 'disapprove' THEN 1
                             END
  WHERE id = OLD.comment_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER comment_approvals_insert
AFTER INSERT ON comment_approvals
FOR EACH ROW
EXECUTE FUNCTION handle_comment_approval_insert();

CREATE TRIGGER comment_approvals_update
AFTER UPDATE ON comment_approvals
FOR EACH ROW
EXECUTE FUNCTION handle_comment_approval_update();

CREATE TRIGGER comment_approvals_delete
AFTER DELETE ON comment_approvals
FOR EACH ROW
EXECUTE FUNCTION handle_comment_approval_delete();
