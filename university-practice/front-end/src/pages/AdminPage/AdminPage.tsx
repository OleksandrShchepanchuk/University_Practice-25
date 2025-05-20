import React, { useState } from 'react';
import MovieManagement from '../../components/MovieManagement/MovieManagement';
import SessionManagement from '../../components/MovieManagement/SessionManagement';
import './AdminPage.scss';

const AdminPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'movies' | 'sessions'>('movies');

    return (
        <div className="admin-page">
            {/* фонова багатокутна заливка */}
            <div className="admin-page__background" />

            {/* основна «картка» з контентом */}
            <div className="admin-page__page">
                <h1 className="admin-page__title">Панель адміністратора</h1>

                <div className="admin-page__tabs">
                    <button
                        className={`admin-page__tab ${activeTab === 'movies' ? 'admin-page__tab--active' : ''}`}
                        onClick={() => setActiveTab('movies')}
                    >
                        Фільми
                    </button>
                    <button
                        className={`admin-page__tab ${activeTab === 'sessions' ? 'admin-page__tab--active' : ''}`}
                        onClick={() => setActiveTab('sessions')}
                    >
                        Сеанси
                    </button>
                </div>

                <div className="admin-page__content">
                    {activeTab === 'movies' ? <MovieManagement /> : <SessionManagement />}
                </div>
            </div>
        </div>
    );
};

export default AdminPage;