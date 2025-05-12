import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import MoviesView from '../components/Movies/MoviesView/MoviesView';
import { loadMovies } from '../store/slices/movieSlice';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [localError, setLocalError] = useState<string | null>(null);
    const dispatch = useDispatch<AppDispatch>();

    const { user, login, logout, loading: authLoading, error, isAuthenticated } = useAuth();
    const {
        list: movies,
        loading: moviesLoading,
        error: moviesError,
        hasLoaded,
    } = useSelector((state: RootState) => state.movies);
    useSelector((state: RootState) => console.log(state));

    useEffect(() => {
        if (!hasLoaded) {
            dispatch(loadMovies());
        }
    });

    const handleLogin = async () => {
        try {
            setLocalError(null);
            await login(email, password);
        } catch (err: any) {
            setLocalError(err.message || 'Login failed');
        }
    };

    const handleLogout = () => {
        logout();
    };

    return (
        <div style={{ padding: 20 }}>
            <h1>Login (Dev Only)</h1>

            {!isAuthenticated ? (
                <>
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button onClick={handleLogin} disabled={authLoading}>
                        {authLoading ? 'Logging in...' : 'Login'}
                    </button>
                    {(localError || error) && <p style={{ color: 'red' }}>{localError || error}</p>}
                </>
            ) : (
                <>
                    <p>Welcome, {user?.email}</p>
                    <button onClick={handleLogout}>Logout</button>
                </>
            )}

            {/* Render Movies */}
            <MoviesView title="All Movies" movies={movies} loading={moviesLoading} error={moviesError} />
        </div>
    );
};

export default LoginPage;
