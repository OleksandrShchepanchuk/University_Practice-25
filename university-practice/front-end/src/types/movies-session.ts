import { Schedule } from './schedule';
import { Movie } from './movie';

export interface MoviesSession {
    id?: string;
    movie: Movie;
    price: number;
    bookedSeats: number[];
    maxSeats: number;
    schedule: Schedule;
}

export const toCreateMoviesSessionDto = (session: MoviesSession) => ({
    movieId: session.movie.id,
    price: session.price,
    schedule: session.schedule,
    maxSeats: session.maxSeats,
    bookedSeats: session.bookedSeats ?? [],
});

export const toUpdateMoviesSessionDto = (session: Partial<MoviesSession>) => ({
    ...(session.movie ? { movieId: session.movie.id } : {}),
    ...(session.price !== undefined ? { price: session.price } : {}),
    ...(session.schedule ? { schedule: session.schedule } : {}),
    ...(session.maxSeats !== undefined ? { maxSeats: session.maxSeats } : {}),
    ...(session.bookedSeats ? { bookedSeats: session.bookedSeats } : {}),
});
