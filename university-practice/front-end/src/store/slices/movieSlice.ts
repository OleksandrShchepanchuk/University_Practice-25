import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getMovies } from '../../api/movies';
import { Movie } from '../../types/movie';

interface MoviesState {
  list: Movie[];
  loading: boolean;
  error: string | null;
}

const initialState: MoviesState = {
  list: [],
  loading: false,
  error: null,
};

export const loadMovies = createAsyncThunk('movies/load', async () => {
  return await getMovies();
});

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(loadMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load movies';
      });
  },
});

export default moviesSlice.reducer;
