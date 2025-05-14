import axiosInstance from './axiosInstance';

export interface RegisterDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }

export const registerUser = async (data: RegisterDto) => {
    const response = await axiosInstance.post('/api/auth/signup', data);
    return response.data;
  };