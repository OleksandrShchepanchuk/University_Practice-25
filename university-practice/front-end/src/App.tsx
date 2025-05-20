// src/App.tsx
import MoviePage from './pages/MoviePage/MoviePage';
import Header from './components/layout/Header/Header.js';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import AuthProvider from './components/common/AuthProvider';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from './store';
import { useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import LoginPage from './pages/LoginPage/LoginPage';
import Main from './pages/Main/Main';
import SessionsPage from './pages/Sessions/Sessions';
import { loadFavourites } from './store/slices/favouriteSlice';

import BookingPage from './pages/BookingPage/BookingPage.js';
import AdminPage from './pages/AdminPage/AdminPage.js';
import BookingHistoryPage from './pages/BookingHistoryPage/BookingHistoryPage.js';
import Favourites from './pages/Favourites/Favourites';
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
            <Header />

            <Routes>
                {isAuthenticated ? (
                    <>
                        <Route path="/" element={<Main />} />
                        <Route path="/sessions" element={<SessionsPage />} />
                        <Route path="/movies/:id" element={<MoviePage />} />
                        <Route path="/tickets/:movieId" element={<BookingPage />} />
                        <Route path="/admin" element={<AdminPage />} />
                        <Route path="/bookinghistory" element={<BookingHistoryPage />} />
                        <Route path="/favourites" element={<Favourites />} />

                        {/* fallback */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </>
                ) : (
                    <>
                        <Route path="/login" element={<LoginPage />} />
                        {/* redirect everything else to /login */}
                        <Route path="*" element={<Navigate to="/login" replace />} />
                    </>
                )}
            </Routes>
        </AuthProvider>
    );
};

export default App;
