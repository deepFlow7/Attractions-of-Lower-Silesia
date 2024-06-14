export interface Photo {
    id: number;
    attraction_id: number;
    photo: string;
    caption?: string;
  }

export interface Attraction extends NewAttraction {
  id: number;
  rating: number;
}

export interface NewPhoto {
  photo: string;
  caption?: string;
}

export interface NewAttraction {
  name: string;
  coords: { x: number; y: number };
  type: possible_type;
  subtype: subtypes;
  interactivity: number;
  time_it_takes: number;
  description: string;
  photos: NewPhoto[];
}

export interface User {
  id: number;
  name: string;
  surname: string;
  mail: string;
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
  votes: number;
  attraction: number;
  parent?: number | null;
}


export interface ChallengeRanking {
  login: string;
  score: number;
}

export interface ChallengeAttraction extends Attraction {
  points: number;
}

export interface challengeAttractionInput {
  attraction_id: number;
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

export interface ChallengeForm {
  name: string;
  description: string;
  coords: { x: number; y: number };
  zoom: number;
  attractions: challengeAttractionInput[];
}


export type possible_type = "natura" | "urbanistyka";
export type subtypes = 
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
  | "bazylika";

export const possibleTypes: possible_type[] = ["natura", "urbanistyka"];
export const possibleSubtypes: subtypes[] = [
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
  "bazylika"
];