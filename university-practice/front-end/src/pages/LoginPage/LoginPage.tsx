import React, { useState, useEffect } from 'react';
import './LoginPage.scss';

const LoginPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [currentBg, setCurrentBg] = useState(0);

  const backgrounds = [
    '/images/bg1.jpg',
    '/images/bg2.jpg',
    '/images/bg3.jpg'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

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
            Login
          </button>
          <button
            className={`tab ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => setActiveTab('register')}
          >
            Register
          </button>
        </div>

        <div className="auth-form">
          {activeTab === 'login' ? (
            <form className="login-form">
              <input type="email" placeholder="Email" required />
              <input type="password" placeholder="Password" required />
              <button type="submit">Login</button>
            </form>
          ) : (
            <form className="register-form">
              <input type="text" placeholder="Full Name" required />
              <input type="email" placeholder="Email" required />
              <input type="password" placeholder="Password" required />
              <input type="password" placeholder="Confirm Password" required />
              <button type="submit">Register</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;