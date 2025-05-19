import React, { useState, useEffect } from 'react';
import './LoginPage.scss';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../api/users';
import { useAuth } from '../../hooks/useAuth';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
    const [currentBg, setCurrentBg] = useState(0);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, loading, error, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [regFullName, setRegFullName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [regConfirm, setRegConfirm] = useState('');
    const [regError, setRegError] = useState<string | null>(null);
    const [regLoading, setRegLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showRegPassword, setShowRegPassword] = useState(false);
    const [showRegConfirm, setShowRegConfirm] = useState(false);

    const backgrounds = ['/images/batman.jpg', '/images/mbu.jpg', '/images/oc.jpg'];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBg((prev) => (prev + 1) % backgrounds.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            console.error(err);
            console.error(error);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setRegError(null);
        if (regPassword !== regConfirm) {
            setRegError('Паролі не співпадають');
            return;
        }
        setRegLoading(true);
        try {
            await registerUser({
                firstName: regFullName.split(' ')[0] || '',
                lastName: regFullName.split(' ').slice(1).join(' ') || '',
                email: regEmail,
                password: regPassword,
            });
            setActiveTab('login');
        } catch (err: any) {
            setRegError(err.response?.data?.message || 'Registration failed');
        } finally {
            setRegLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="background-slideshow">
                {backgrounds.map((bg, index) => (
                    <div
                        key={index}
                        className={`slide ${index === currentBg ? 'active' : ''}`}
                        style={{ backgroundImage: `url(${bg})` }}
                    />
                ))}
            </div>
            <div className="auth-container">
                <div className="auth-tabs">
                    <button
                        className={`tab ${activeTab === 'login' ? 'active' : ''}`}
                        onClick={() => setActiveTab('login')}
                    >
                        Увійти
                    </button>
                    <button
                        className={`tab ${activeTab === 'register' ? 'active' : ''}`}
                        onClick={() => setActiveTab('register')}
                    >
                        Зареєструватися
                    </button>
                </div>
                <div className="auth-form">
                    {activeTab === 'login' ? (
                        <form className="login-form" onSubmit={handleLogin}>
                            <input
                                type="email"
                                placeholder="Електронна пошта"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <div className="password-input-wrapper">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Пароль"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={() => setShowPassword((v) => !v)}
                                    tabIndex={-1}
                                    aria-label="Toggle password visibility"
                                >
                                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                                </button>
                            </div>
                            <button type="submit" disabled={loading}>
                                {loading ? 'Зачекайте...' : 'Увійти'}
                            </button>
                            {error && <div className="error">{error}</div>}
                        </form>
                    ) : (
                        <form className="register-form" onSubmit={handleRegister}>
                            <input
                                type="text"
                                placeholder="Повне ім'я"
                                value={regFullName}
                                onChange={(e) => setRegFullName(e.target.value)}
                                required
                            />
                            <input
                                type="email"
                                placeholder="Електронна пошта"
                                value={regEmail}
                                onChange={(e) => setRegEmail(e.target.value)}
                                required
                            />

                            <div className="password-input-wrapper">
                                <input
                                    type={showRegPassword ? 'text' : 'password'}
                                    placeholder="Пароль"
                                    value={regPassword}
                                    onChange={(e) => setRegPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={() => setShowRegPassword((v) => !v)}
                                    tabIndex={-1}
                                    aria-label="Toggle password visibility"
                                >
                                    {showRegPassword ? <FaEye /> : <FaEyeSlash />}
                                </button>
                            </div>

                            <div className="password-input-wrapper">
                                <input
                                    type={showRegConfirm ? 'text' : 'password'}
                                    placeholder="Підтвердження пароля"
                                    value={regConfirm}
                                    onChange={(e) => setRegConfirm(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={() => setShowRegConfirm((v) => !v)}
                                    tabIndex={-1}
                                    aria-label="Toggle confirm password visibility"
                                >
                                    {showRegConfirm ? <FaEye /> : <FaEyeSlash />}
                                </button>
                            </div>

                            <button type="submit" disabled={regLoading}>
                                {regLoading ? 'Зачекайте...' : 'Зареєструватися'}
                            </button>
                            {regError && <div className="error">{regError}</div>}
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
