import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

import './Header.scss';
import { UserIcon } from 'lucide-react'; // або SVG, якщо без бібліотеки

const Header: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  return (
    <header className="header">
      <div className="nav-group">
        <nav className="nav">
          <a href="/">Головна</a>
          <a href="/sessions">Розклад сеансів</a>
          <a href="#">Обрані</a>
          <a href="/admin">Панель адміністратора</a>
        </nav>
        <div className="user-menu" ref={dropdownRef}>
          <button 
            className="user-icon-button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            aria-label="User menu"
          >
            <UserIcon size={24} />
          </button>
          {isDropdownOpen && (
            <div className="user-dropdown">
              <Link to="/bookinghistory" className="dropdown-item">
                Історія покупок
              </Link>
              <Link to="/login" className="dropdown-item">
                Вийти
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
