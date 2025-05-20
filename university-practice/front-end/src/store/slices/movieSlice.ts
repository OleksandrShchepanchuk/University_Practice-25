// src/store/slices/moviesSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getMovies, getMovieById, createMovie, updateMovie, deleteMovie } from '../../api/movies';
import { Movie } from '../../types/movie';

interface MoviesState {
    list: Movie[];
    loading: boolean;
    error: string | null;
    hasLoaded: boolean;
}

const initialState: MoviesState = {
    list: [],
    loading: false,
    error: null,
    hasLoaded: false,
};

export const loadMovies = createAsyncThunk('movies/load', getMovies);

export const addMovie = createAsyncThunk<Movie, Movie>('movies/add', createMovie);

export const editMovie = createAsyncThunk<Movie, { id: string; movie: Partial<Movie> }>(
    'movies/edit',
    ({ id, movie }) => updateMovie(id, movie as Movie),
);

export const removeMovie = createAsyncThunk<string, string>('movies/remove', async (id) => {
    await deleteMovie(id);
    return id;
});

const moviesSlice = createSlice({
    name: 'movies',
    initialState,
    reducers: {},
    extraReducers: (b) => {
        b.addCase(loadMovies.pending, (s) => {
            s.loading = true;
            s.error = null;
        })
            .addCase(loadMovies.fulfilled, (s, a) => {
                s.loading = false;
                s.list = a.payload;
                s.hasLoaded = true;
            })
            .addCase(loadMovies.rejected, (s, a) => {
                s.loading = false;
                s.error = a.error.message ?? 'Failed to load movies';
            })

            .addCase(addMovie.fulfilled, (s, a) => {
                s.list.push(a.payload);
            })

            .addCase(editMovie.fulfilled, (s, a) => {
                const i = s.list.findIndex((m) => m.id === a.payload.id);
                if (i !== -1) s.list[i] = a.payload;
            })

            .addCase(removeMovie.fulfilled, (s, a) => {
                s.list = s.list.filter((m) => m.id !== a.payload);
            });
    },
});

export default moviesSlice.reducer;
