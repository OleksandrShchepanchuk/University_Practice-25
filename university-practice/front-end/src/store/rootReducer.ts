import { combineReducers } from '@reduxjs/toolkit';
import moviesReducer from './slices/movieSlice';
import favouriteReducer from './slices/favouriteSlice';
import sessionsReducer from './slices/sessionsSlice';
import usersReducer from './slices/usersSlice';

const rootReducer = combineReducers({
  movies: moviesReducer,
  favourites: favouriteReducer,
  sessions: sessionsReducer,
  users: usersReducer,
});

export default rootReducer;
