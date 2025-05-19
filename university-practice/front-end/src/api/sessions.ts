// api/sessions.ts

import axiosInstance from './axiosInstance';
import {
  MoviesSession,
  toCreateMoviesSessionDto,
  toUpdateMoviesSessionDto,
} from '../types/movies-session';

export const getSessions = async (): Promise<MoviesSession[]> => {
  const response = await axiosInstance.get('/api/movies-session');
  return response.data;
};

export const getSessionById = async (id: string): Promise<MoviesSession> => {
  const response = await axiosInstance.get(`/api/movies-session/${id}`);
  return response.data;
};

export const createSession = async (session: MoviesSession): Promise<MoviesSession> => {
  const dto = toCreateMoviesSessionDto(session);
  const response = await axiosInstance.post('/api/movies-session', dto);
  return response.data;
};

export const updateSession = async (id: string, session: Partial<MoviesSession>): Promise<MoviesSession> => {
  const dto = toUpdateMoviesSessionDto(session);
  const response = await axiosInstance.patch(`/api/movies-session/${id}`, dto);
  return response.data;
};

export const deleteSession = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/api/movies-session/${id}`);
};