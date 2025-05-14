// src/App.tsx
import LoginPage from "./pages/LoginPage/LoginPage";
import MoviePage from "./pages/MoviePage/MoviePage";

import { Routes, Route, Link } from 'react-router-dom';
import AuthProvider from './components/common/AuthProvider';
import SessionsPage from './testPages/SessionPage';

const App = () => {
    return (
        <AuthProvider>
            <div>
                {/* <nav style={{ padding: 10, borderBottom: '1px solid #ccc' }}>
                    <Link to="/" style={{ marginRight: 10 }}>
                        Login
                    </Link>
                </nav> */}

                <Routes>
                    <Route path="/s" element={<SessionsPage />} />
                    <Route path="/movies/:id" element={<MoviePage />} />
                    <Route path="/login" element={<LoginPage />} />

                </Routes>
            </div>
        </AuthProvider>
    );
};

export default App;