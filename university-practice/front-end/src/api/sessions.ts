// api/sessions.ts

import axiosInstance from './axiosInstance';
import { MoviesSession } from '../types/movies-session'; // Вказуємо шлях до типу

// Отримати всі сеанси
export const getSessions = async (): Promise<MoviesSession[]> => {
    const response = await axiosInstance.get('/api/movies-session');
    return response.data;
};

// Отримати конкретний сеанс за ID
export const getSessionById = async (id: string): Promise<MoviesSession> => {
    const response = await axiosInstance.get(`/api/movies-session/${id}`);
    return response.data;
};

// Створити новий сеанс
export const createSession = async (session: MoviesSession): Promise<MoviesSession> => {
    const response = await axiosInstance.post('/api/movies-session', session);
    return response.data;
};

// Оновити існуючий сеанс
export const updateSession = async (id: string, session: Partial<MoviesSession>): Promise<MoviesSession> => {
    const response = await axiosInstance.patch(`/api/movies-session/${id}`, session);
    return response.data;
};

// Видалити сеанс
export const deleteSession = async (id: string): Promise<void> => {
    await axiosInstance.delete(`/api/movies-session/${id}`);
};
