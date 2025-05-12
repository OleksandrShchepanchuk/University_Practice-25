import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store'; // типи store
import { loginUser, logoutUser } from '../store/slices/usersSlice';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { user, loading, error } = useSelector((state: RootState) => state.users);

  const login = (email: string, password: string) => {
    dispatch(loginUser({ email, password }));
  };

  const logout = () => {
    dispatch(logoutUser());
  };

  return {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
  };
};
