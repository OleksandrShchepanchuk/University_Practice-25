// src/api/favourites.ts

import axios from 'axios';
import type { Favorites } from '../types/favorites';

// Отримати список улюблених
export const getFavourites = async (): Promise<Favorites[]> => {
  const response = await axios.get('/api/favourites'); // або URL до Firebase
  return response.data;
};

// Додати фільм в улюблені
export const addFavourite = async (favourite: Favorites): Promise<void> => {
  await axios.post('/api/favourites', favourite); // або через Firebase
};

// Видалити фільм з улюблених
export const removeFavourite = async (movieId: string): Promise<void> => {
  await axios.delete(`/api/favourites/${movieId}`); // або через Firebase
};
