import axios from './axiosInstance';
import { Booking } from '../types/booking';

export const getBookings = async (): Promise<Booking[]> => {
    const response = await axios.get<Booking[]>('/api/bookings');
    return response.data;
};

export const createBooking = async (data: Booking): Promise<Booking> => {
    const response = await axios.post<Booking>('/api/bookings', data);
    return response.data;
};

export const cancelBooking = async (id: string): Promise<void> => {
    await axios.delete(`/api/bookings/${id}`);
};