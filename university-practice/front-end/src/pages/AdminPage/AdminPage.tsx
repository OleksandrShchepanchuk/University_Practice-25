import React, { useState } from 'react';
import MovieManagement from '../../components/MovieManagement/MovieManagement';
import SessionManagement from '../../components/MovieManagement/SessionManagement';

import './AdminPage.scss'

const AdminPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'movies' | 'sessions'>('movies');

    return (
        <div className="admin-panel">
            <div className="admin-header">
                <h1>Панель адміністратора</h1>
                <div className="admin-tabs">
                    <button 
                        className={`tab ${activeTab === 'movies' ? 'active' : ''}`}
                        onClick={() => setActiveTab('movies')}
                    >
                        Фільми
                    </button>
                    <button 
                        className={`tab ${activeTab === 'sessions' ? 'active' : ''}`}
                        onClick={() => setActiveTab('sessions')}
                    >
                        Сеанси
                    </button>
                </div>
            </div>

            <div className="admin-content">
                {activeTab === 'movies' ? (
                    <MovieManagement />
                ) : (
                    <SessionManagement />
                )}
            </div>
        </div>
    );
};

export default AdminPage;