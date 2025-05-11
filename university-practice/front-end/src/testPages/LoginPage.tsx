import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser, logoutUser } from "../store/slices/usersSlice";
import { auth } from "../firebaseConfig";
import type { AppDispatch } from "../store";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const dispatch = useDispatch<AppDispatch>();

    const user = auth.currentUser;

    const handleLogin = async () => {
        try {
            await dispatch(loginUser({ email, password })).unwrap();
            setError(null);
        } catch (err: any) {
            setError(err.message || "Login failed");
        }
    };

    const handleLogout = () => {
        dispatch(logoutUser());
    };

    return (
        <div style={{ padding: 20 }}>
            <h1>Login (Dev Only)</h1>
            {!user ? (
                <>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button onClick={handleLogin}>Login</button>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                </>
            ) : (
                <>
                    <p>Welcome, {user.email}</p>
                    <button onClick={handleLogout}>Logout</button>
                </>
            )}
        </div>
    );
};

export default LoginPage;
