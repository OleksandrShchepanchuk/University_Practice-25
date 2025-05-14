import Header from './components/layout/Header/Header.js';
import { Routes, Route, Link } from 'react-router-dom';
import AuthProvider from './components/common/AuthProvider';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from './store';
import { useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { loadFavourites } from './store/slices/favouriteSlice'; 
import LoginPage from './pages/LoginPage/LoginPage';
import MainPage from './pages/Main/Main';
import SessionsPage from './pages/Sessions/Sessions';

const App = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { isAuthenticated } = useAuth();
    const { hasLoaded, loading, error } = useSelector((state: RootState) => state.favourites);

    useEffect(() => {
        if (isAuthenticated && !hasLoaded && !loading && !error) {
            dispatch(loadFavourites());
        }
    }, [dispatch, isAuthenticated, hasLoaded, loading, error]);

    return (
        <AuthProvider>
            <Header></Header>
            <div>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/" element={<MainPage />} />
                    <Route path="/sessions" element={<SessionsPage />} />
                </Routes>
            </div>
        </AuthProvider>
    );
};

export default App;
