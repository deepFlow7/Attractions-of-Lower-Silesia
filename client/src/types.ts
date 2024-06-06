export interface Photo {
    id: number;
    attraction_id: number;
    photo: string;
    caption?: string;
  }

export interface Attraction {
  id: number;
  name: string;
  coords: { x: number; y: number };
  type: possible_type;
  subtype: subtypes;
  interactivity: number;
  time_it_takes: number;
  rating?: number;
  description?: string;
  photos: Photo[];
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

export interface Comment {
  id: number;
  author: User['id'];
  content: string;
  votes: number;
  attraction: number;
  parent?: number | null;
}


export interface Ranking {
  user_id: User['id'];
  points: number;
}

export interface Challenge {
  id: number;
  name: string;
  description: string;
  points: number;
  attractions: Attraction[];
}


export type possible_type = "Type1" | "Type2" | "Type3" | "Muzeum" | "Park Rozrywki" | "Natura" | "Urbanistyka";
export type subtypes = "Subtype1" | "Subtype2" | "Subtype3" | "Historia" | "Rozrywka";

