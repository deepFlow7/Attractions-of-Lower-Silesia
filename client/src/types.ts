export interface Photo {
  id: number;
  attraction_id: number;
  photo: string;
  caption?: string;
}

export interface Attraction extends NewAttraction {
  id: number;
  rating: number;
  photos: Photo[];
}

export interface NewPhoto {
  photo: string;
  caption?: string;
}

export interface NewAttraction {
  name: string;
  coords: { x: number; y: number };
  type: PossibleType;
  subtype: Subtypes;
  interactivity: number;
  timeItTakes: number;
  description: string;
  photos: NewPhoto[];
}

export interface AttractionWithComments {
  attraction: Attraction;
  comments: Comment[];
}

interface UserData {
  name: string;
  surname: string;
  mail: string;
}

export interface User extends UserData {
  id: number;
}

export interface UserWithLogin extends UserData {
  login: string;
  id: number;
}

export interface Login {
  user_id: number;
  login: string;
  password: string;
  role: 'admin' | 'user';
}

export interface NewUser {
  name: string;
  surname: string;
  mail: string;
  login: string;
  password: string;
}

export interface Comment {
  id: number;
  author: User['id'];
  content: string;
  attraction: number;
  vote_sum: number;
  approval_status?: string | null;
}

export interface ChallengeRanking {
  login: string;
  score: number;
}

export interface ChallengeAttraction extends Attraction {
  points: number;
}

export interface Challenge {
  id: number;
  name: string;
  description: string;
  coords: { x: number; y: number };
  zoom: number;
  attractions: ChallengeAttraction[];
}

export interface BasicChallengeInfo {
  id: number;
  name: string;
  points: number;
}

export interface ChallengeAttractionInput {
  id: number;
  points: number;
}

export interface ChallengeForm {
  name: string;
  description: string;
  coords: { x: number; y: number };
  zoom: number;
  attractions: ChallengeAttractionInput[];
}

export interface Route {
  coords: { x: number; y: number };
  zoom: number;
  attractions: number[];
}

export type Role = 'admin' | 'user';

export type PossibleType = "natura" | "urbanistyka";

export type Subtypes =
  | "zamek"
  | "kościół"
  | "muzeum"
  | "szczyt górski"
  | "formacja skalna"
  | "kopalnia"
  | "jaskinia"
  | "twierdza"
  | "sanktuarium"
  | "wodospad"
  | "ruiny"
  | "kompleks podziemny"
  | "ogród botaniczny"
  | "zabytek architektury"
  | "ogród"
  | "makieta kolejowa"
  | "centrum edukacyjne"
  | "ogród zoologiczny"
  | "zbiorniki wodne"
  | "krasnal"
  | "bazylika";

export const possibleTypes: PossibleType[] = ["natura", "urbanistyka"];

export const possibleSubtypes: Subtypes[] = [
  "zamek",
  "kościół",
  "muzeum",
  "szczyt górski",
  "formacja skalna",
  "kopalnia",
  "jaskinia",
  "twierdza",
  "sanktuarium",
  "wodospad",
  "ruiny",
  "kompleks podziemny",
  "ogród botaniczny",
  "zabytek architektury",
  "ogród",
  "makieta kolejowa",
  "centrum edukacyjne",
  "ogród zoologiczny",
  "zbiorniki wodne",
  "krasnal",
  "bazylika",
];

export type Preferences = "wszystkie" | "ulubione" | "do odwiedzenia";
export const possiblePreferences = ["wszystkie", "ulubione", "do odwiedzenia"];

