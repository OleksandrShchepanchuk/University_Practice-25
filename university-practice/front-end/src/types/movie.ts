import { Schedule } from './schedule';

export interface Movie {
    id: string;
    title: string;
    poster: string;
    description: string;
    genre: string;
    rating: number;
    year: number;
    trailer: string;
    cast: string[];
    photos: string[];
    duration: number;
}

export interface MovieWithSession extends Movie {
    price?: number;
    schedule?: Schedule[];
}
