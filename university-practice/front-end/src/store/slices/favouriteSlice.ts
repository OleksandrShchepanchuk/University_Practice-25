// src/store/slices/favouriteSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Favorites } from '../../types/favorites';

interface FavouriteState {
  favourites: Favorites[];
}

const initialState: FavouriteState = {
  favourites: [],
};

const favouriteSlice = createSlice({
  name: 'favourite',
  initialState,
  reducers: {
    addFavourite(state, action: PayloadAction<Favorites>) {
      const exists = state.favourites.some(f => f.movieId === action.payload.movieId);
      if (!exists) {
        state.favourites.push(action.payload);
      }
    },
    removeFavourite(state, action: PayloadAction<string>) {
      state.favourites = state.favourites.filter(f => f.movieId !== action.payload);
    },
    clearFavourites(state) {
      state.favourites = [];
    },
  },
});

export const { addFavourite, removeFavourite, clearFavourites } = favouriteSlice.actions;
export default favouriteSlice.reducer;
