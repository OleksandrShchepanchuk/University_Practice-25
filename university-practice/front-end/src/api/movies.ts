// api/movies.ts

import axiosInstance from './axiosInstance';
import { Movie } from '../types/movie';

export const getMovies = async (): Promise<Movie[]> => {
  const response = await axiosInstance.get('/api/movies');
  return response.data;
};

export const getMovieById = async (id: string): Promise<Movie> => {
  const response = await axiosInstance.get(`/api/movies/${id}`);
  return response.data;
};

export const createMovie = async (movie: Movie): Promise<Movie> => {
  const response = await axiosInstance.post('/api/movies', movie);
  return response.data;
};

export const updateMovie = async (id: string, movie: Movie): Promise<Movie> => {
  const response = await axiosInstance.patch(`/api/movies/${id}`, movie);
  return response.data;
};

export const deleteMovie = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/api/movies/${id}`);
};
