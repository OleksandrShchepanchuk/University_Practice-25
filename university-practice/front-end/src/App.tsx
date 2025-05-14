import Header from './components/layout/Header/Header.js';
import { Routes, Route, Link } from 'react-router-dom';
import LoginPage from './testPages/LoginPage';
import AuthProvider from './components/common/AuthProvider';
import SessionsPage from './testPages/SessionPage';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from './store';
import { useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { loadFavourites } from './store/slices/favouriteSlice'; 

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
                {/* <nav style={{ padding: 10, borderBottom: '1px solid #ccc' }}>
                    <Link to="/" style={{ marginRight: 10 }}>
                        Login
                    </Link>
                    <Link to="/s">Sessions</Link>
                </nav> */}

                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/s" element={<SessionsPage />} />
                    {/* <Route path='/header' element={<Header />} />  */}
                </Routes>
            </div>
        </AuthProvider>
    );
};

export default App;
