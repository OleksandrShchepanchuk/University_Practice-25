import axios from './axiosInstance';
import { Booking } from '../types/booking';

export const createBooking = async (data: Booking): Promise<Booking> => {
    const response = await axios.post<Booking>('/api/bookings', data);
    return response.data;
};
