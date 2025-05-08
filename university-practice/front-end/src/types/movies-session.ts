import { Schedule } from "./schedule.ts";

export interface MoviesSession {
    movieId: string;
    price: number;
    schedule: Schedule[];
}
