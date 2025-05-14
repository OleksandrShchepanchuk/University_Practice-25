// src/store/slices/favouriteSlice.ts

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFavourites, addFavourite, removeFavourite } from '../../api/favourites';
import type { Favorites } from '../../types/favorites';

interface FavouriteState {
  list: Favorites[];
  loading: boolean;
  error: string | null;
  hasLoaded: boolean;
}

const initialState: FavouriteState = {
  list: [],
  loading: false,
  error: null,
  hasLoaded: false,
};

// Async thunk: load all favourites
export const loadFavourites = createAsyncThunk(
  'favourites/load',
  async (_, { rejectWithValue }) => {
    try {
      return await getFavourites();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to load favourites');
    }
  }
);

// Async thunk: toggle favourite (add/remove from server)
export const toggleFavourite = createAsyncThunk(
  'favourites/toggle',
  async ({ movieId }: { movieId: string }, { getState, rejectWithValue }) => {
    const { list } = (getState() as { favourite: FavouriteState }).favourite;
    const exists = list.some(f => f.movieId === movieId);

    try {
      if (exists) {
        await removeFavourite(movieId); // серверне видалення
        return { movieId, action: 'remove' };
      } else {
        await addFavourite({ movieId }); // додавання фільму (тільки id)
        return { movieId, action: 'add' };
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to toggle favourite');
    }
  }
);


const favouriteSlice = createSlice({
  name: 'favourites',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Load all favourites
      .addCase(loadFavourites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadFavourites.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
        state.hasLoaded = true;
      })
      .addCase(loadFavourites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to load favourites';
      })
      // Toggle favourite (add/remove)
      .addCase(toggleFavourite.fulfilled, (state, action) => {
        const { movieId, action: toggleAction } = action.payload;
        if (toggleAction === 'add') {
          state.list.push({ movieId } as Favorites); // додавання
        } else {
          state.list = state.list.filter(f => f.movieId !== movieId); // видалення
        }
      })
      .addCase(toggleFavourite.rejected, (state, action) => {
        state.error = action.payload as string || 'Failed to toggle favourite';
      });
  },
});

export default favouriteSlice.reducer;
