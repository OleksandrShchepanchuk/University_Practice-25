// src/App.tsx
import { Routes, Route, Link } from "react-router-dom";
import LoginPage from "./testPages/LoginPage";
import MoviesPage from "./testPages/MoviesPage";
import SessionsPage from "./testPages/SessionsPage";

const App = () => {
    return (
        <div>
            <nav style={{ padding: 10, borderBottom: "1px solid #ccc" }}>
                <Link to="/" style={{ marginRight: 10 }}>
                    Login
                </Link>
                <Link to="/movies" style={{ marginRight: 10 }}>
                    Movies
                </Link>
                <Link to="/sessions">Sessions</Link>
            </nav>

            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/movies" element={<MoviesPage />} />
                <Route path="/sessions" element={<SessionsPage />} />
            </Routes>
        </div>
    );
};

export default App;
