// src/App.tsx
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadMovies } from './store/slices/movieSlice';
import { loginUser, logoutUser } from './store/slices/usersSlice';
import { fetchSessions } from './store/slices/sessionsSlice';
import { Movie } from './types/movie';
import type { AppDispatch, RootState } from './store';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();

  // Redux state
  const { list, loading: moviesLoading, error: movieError } = useSelector((state: RootState) => state.movies);
  const { user, loading: userLoading, error: userError } = useSelector((state: RootState) => state.users);
  const { sessions } = useSelector((state: RootState) => state.sessions);
  const handleLogin = async () => {
    try {
      await dispatch(loginUser({ email, password })).unwrap();
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  useEffect(() => {
    if (user) {
      dispatch(loadMovies());
      dispatch(fetchSessions());
    }
  }, [user, dispatch]);

  // Debug (опційно)
  useEffect(() => {
    console.log('Sessions from store:', sessions);
  }, [sessions]);

  return (
    <div style={{ padding: 20 }}>
      <h1>Login</h1>

      {!user ? (
        <>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ display: 'block', marginBottom: 10 }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ display: 'block', marginBottom: 10 }}
          />
          <button onClick={handleLogin} disabled={userLoading}>
            {userLoading ? 'Logging in...' : 'Login'}
          </button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </>
      ) : (
        <div>
          <p>Welcome, {user.displayName || user.email}</p>
          <p>User ID: {user.uid}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}

      {userError && <p style={{ color: 'red' }}>{userError}</p>}

      <h2>Movies</h2>
      {moviesLoading && <p>Loading movies...</p>}
      {movieError && <p style={{ color: 'red' }}>{movieError}</p>}
      {list.length > 0 ? (
        <ul>
          {list.map((movie: Movie) => (
            <li key={movie.title}>
              <h3>{movie.title}</h3>
              <p>{movie.description}</p>
              <img src={movie.poster} alt={movie.title} style={{ width: '200px' }} />
            </li>
          ))}
        </ul>
      ) : (
        !moviesLoading && <p>No movies available</p>
      )}
    </div>
  );
}

export default App;
