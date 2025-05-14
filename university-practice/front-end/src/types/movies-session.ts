import { Schedule } from './schedule';
import { Movie } from './movie';

export interface MoviesSession {
    id?: string;
    movie: Movie;
    price: number;
    schedule: Schedule;
}

export const toCreateMoviesSessionDto = (session: MoviesSession) => ({
    movieId: session.movie.id,
    price: session.price,
    schedule: session.schedule,
});

export const toUpdateMoviesSessionDto = (session: Partial<MoviesSession>) => ({
    ...(session.movie ? { movieId: session.movie.id } : {}),
    price: session.price,
    schedule: session.schedule,
});
