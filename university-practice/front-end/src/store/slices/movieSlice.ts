import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getMovies, getMovieById } from '../../api/movies';
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

export const loadMovies = createAsyncThunk('movies/load', async () => {
    return await getMovies();
});

export const fetchMovieById = createAsyncThunk<Movie, string>('movies/fetchById', async (id, { rejectWithValue }) => {
    try {
        return await getMovieById(id);
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch movie');
    }
});

const moviesSlice = createSlice({
    name: 'movies',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Load all movies
            .addCase(loadMovies.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loadMovies.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
                state.hasLoaded = true;
            })
            .addCase(loadMovies.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to load movies';
            });
    },
});

export default moviesSlice.reducer;
