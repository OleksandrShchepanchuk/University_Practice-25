import React, { useState, useEffect } from 'react';
import { MoviesSession, toCreateMoviesSessionDto, toUpdateMoviesSessionDto } from '../../types/movies-session';
import { getSessions, createSession, updateSession, deleteSession } from '../../api/sessions';
import './SessionManagement.scss';
import { Movie } from '../../types/movie';
import { Schedule } from '../../types/schedule';

interface SessionFormData {
    movie: Movie;
    price: number;
    bookedSeats: number[];
    maxSeats: number;
    schedule: Schedule;
}

const SessionManagement: React.FC = () => {
    const [sessions, setSessions] = useState<MoviesSession[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingSession, setEditingSession] = useState<MoviesSession | null>(null);
    const [formData, setFormData] = useState<SessionFormData>({
        movie: {} as Movie, // This should be populated from movie selection
        price: 0,
        bookedSeats: [],
        maxSeats: 100,
        schedule: {
            date: '',
            times: '' // Changed from time to times
        }
    });

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            setLoading(true);
            const data = await getSessions();
            setSessions(data);
        } catch (err) {
            setError('Помилка завантаження сеансів');
            console.error('Error fetching sessions:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        
        if (name === 'date' || name === 'times') { // Changed from 'time' to 'times'
            setFormData(prev => ({
                ...prev,
                schedule: {
                    ...prev.schedule,
                    [name]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: name === 'price' || name === 'maxSeats' 
                    ? Number(value) 
                    : value
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingSession?.id) {
                await updateSession(
                    editingSession.id, 
                    toUpdateMoviesSessionDto(formData)
                );
            } else {
                console.log('Creating session with data:');
                // await createSession(
                //     // toCreateMoviesSessionDto(formData)
                // );

            }
            await fetchSessions();
            setIsFormVisible(false);
            setEditingSession(null);
        } catch (err) {
            setError('Помилка при збереженні сеансу');
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Ви впевнені, що хочете видалити цей сеанс?')) {
            try {
                await deleteSession(id);
                setSessions(sessions.filter(session => session.id !== id));
            } catch (err) {
                setError('Помилка при видаленні сеансу');
            }
        }
    };

    return (
        <div className="session-management">
            <button 
                className="add-button"
                onClick={() => setIsFormVisible(true)}
            >
                Додати новий сеанс
            </button>

            {isFormVisible && (
                <form className="session-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="movie"
                        value={formData.movie.id}
                        onChange={handleInputChange}
                        placeholder="ID фільму"
                        required
                    />
                    <input
                        type="date"
                        name="date"
                        value={formData.schedule.date}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        type="time"
                        name="time"
                        value={formData.schedule.times}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="Ціна"
                        min="0"
                        required
                    />
                    <input
                        type="number"
                        name="maxSeats"
                        value={formData.maxSeats}
                        onChange={handleInputChange}
                        placeholder="Кількість місць"
                        min="1"
                        required
                    />
                    <div className="form-buttons">
                        <button type="submit">
                            {editingSession ? 'Оновити' : 'Створити'}
                        </button>
                        <button 
                            type="button" 
                            onClick={() => setIsFormVisible(false)}
                        >
                            Скасувати
                        </button>
                    </div>
                </form>
            )}

            {loading && <div className="loading">Завантаження...</div>}
            {error && <div className="error">{error}</div>}
            
            {!loading && !error && (
                <div className="sessions-list">
                    {sessions.length === 0 ? (
                        <div className="no-sessions">Сеансів не знайдено</div>
                    ) : (
                        sessions.map(session => (
                            <div key={session.id} className="session-item">
                                <div className="session-info">
                                    <h3>Фільм: {session.movie.title}</h3>
                                    <p>Дата: {session.schedule.date}</p>
                                    <p>Час: {session.schedule.times}</p>
                                    <p>Ціна: {session.price} грн</p>
                                    <p>Місць: {session.maxSeats}</p>
                                    <p>Заброньовано: {session.bookedSeats.length}</p>
                                </div>
                                <div className="session-actions">
                                    <button 
                                        className="edit-button"
                                        onClick={() => setEditingSession(session)}
                                    >
                                        Редагувати
                                    </button>
                                    <button 
                                        className="delete-button"
                                        onClick={() => session.id && handleDelete(session.id)}
                                    >
                                        Видалити
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default SessionManagement;