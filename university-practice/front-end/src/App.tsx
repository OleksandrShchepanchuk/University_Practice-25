// src/App.tsx
import LoginPage from "./testPages/LoginPage";
import MoviePage from "./pages/MoviePage/MoviePage";

import { Routes, Route, Link } from 'react-router-dom';
import AuthProvider from './components/common/AuthProvider';
import SessionsPage from './testPages/SessionPage';

const App = () => {
    return (
        <AuthProvider>
            <div>
                <nav style={{ padding: 10, borderBottom: '1px solid #ccc' }}>
                    <Link to="/" style={{ marginRight: 10 }}>
                        Login
                    </Link>
                </nav>

                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/s" element={<SessionsPage />} />
                    <Route path="/movies/:id" element={<MoviePage />} />

                </Routes>
            </div>
        </AuthProvider>
    );
};

export default App;