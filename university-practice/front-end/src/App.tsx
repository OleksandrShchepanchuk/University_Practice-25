// src/App.tsx
import { Routes, Route, Link } from "react-router-dom";
import LoginPage from "./testPages/LoginPage";

const App = () => {
    return (
        <div>
            <nav style={{ padding: 10, borderBottom: "1px solid #ccc" }}>
                <Link to="/" style={{ marginRight: 10 }}>
                    Login
                </Link>
            </nav>

            <Routes>
                <Route path="/" element={<LoginPage />} />
            </Routes>
        </div>
    );
};

export default App;
