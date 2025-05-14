import React from 'react';
import './Header.scss';
import { UserIcon } from 'lucide-react'; // або SVG, якщо без бібліотеки

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="nav-group">
        <nav className="nav">
          <a href="/">Головна</a>
          <a href="/sessions">Розклад сеансів</a>
          <a href="#">Обрані</a>
          <a href="#">Панель адміністратора</a>
        </nav>
        <div className="user-icon">
          <a href=""><UserIcon size={24} color="white" /></a>
        </div>
      </div>
    </header>
  );
};

export default Header;
