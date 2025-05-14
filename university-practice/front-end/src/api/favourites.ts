// src/api/favourites.ts

import axios from './axiosInstance';
import type { Favorites } from '../types/favorites';

export const getFavourites = async (): Promise<Favorites[]> => {
    const response = await axios.get('/api/favorites');
    return response.data;
};

export const addFavourite = async (favourite: Favorites): Promise<void> => {
    console.log(favourite.movie.id);
    await axios.post('/api/favorites', { movieId: favourite.movie.id });
};

export const removeFavourite = async (favourite: Favorites): Promise<void> => {
    const { id } = favourite.movie;
    await axios.delete(`/api/favorites/${id}`);
};
