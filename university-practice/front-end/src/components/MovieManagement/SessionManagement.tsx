//  src/pages/admin/SessionManagement.tsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadSessions, addSession, editSession, removeSession } from '../../store/slices/sessionsSlice';
import { loadMovies } from '../../store/slices/movieSlice';
import { MoviesSession, toCreateMoviesSessionDto, toUpdateMoviesSessionDto } from '../../types/movies-session';
import { Movie } from '../../types/movie';
import { Schedule } from '../../types/schedule';
import type { RootState, AppDispatch } from '../../store';
import './SessionManagement.scss';
import Loader from '../common/Loader/Loader';

interface SessionFormData {
    movie: Movie;
    price: number;
    bookedSeats: number[];
    maxSeats: number;
    schedule: Schedule;
}

const blankForm: SessionFormData = {
    movie: {} as Movie,
    price: 0,
    bookedSeats: [],
    maxSeats: 30,
    schedule: { date: '', times: '' },
};

const PER_PAGE = 6;

const SessionManagement = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { list: sessions, loading, error, hasLoaded } = useSelector((s: RootState) => s.sessions);
    const {
        list: movies,
        hasLoaded: hasLoadedMovies,
        error: movieError,
        loading: movieLoading,
    } = useSelector((s: RootState) => s.movies);

    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editing, setEditing] = useState<MoviesSession | null>(null);
    const [form, setForm] = useState<SessionFormData>(blankForm);

    // pagination
    const [page, setPage] = useState(1);
    const pageCount = Math.max(1, Math.ceil(sessions.length / PER_PAGE));
    const paginated = sessions.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    useEffect(() => {
        if (!hasLoaded && !loading && !error) dispatch(loadSessions());
        if (!hasLoadedMovies && !movieLoading && !movieError) dispatch(loadMovies());
    }, [dispatch, hasLoaded, loading, error, hasLoadedMovies, movieLoading, movieError]);

    const resetForm = () => {
        setEditing(null);
        setForm(blankForm);
        setIsFormVisible(false);
    };

    const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === 'movieId') {
            setForm((p) => ({ ...p, movie: { ...p.movie, id: value } }));
        } else if (name === 'date' || name === 'times') {
            setForm((p) => ({ ...p, schedule: { ...p.schedule, [name]: value } }));
        } else if (name === 'price' || name === 'maxSeats') {
            setForm((p) => ({ ...p, [name]: Number(value) }));
        }
    };

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (editing) {
            await dispatch(editSession({ id: editing.id!, session: toUpdateMoviesSessionDto(form) })).unwrap();
        } else {
            const tmp: MoviesSession = {
                movie: { id: form.movie.id } as Movie,
                price: form.price > 0 ? form.price : 0,
                bookedSeats: form.bookedSeats || [],
                maxSeats: form.maxSeats,
                schedule: form.schedule,
            };
            await dispatch(addSession(tmp)).unwrap();
        }

        resetForm();
    };

    const startEdit = (s: MoviesSession) => {
        setEditing(s);
        setForm({
            movie: s.movie,
            price: s.price,
            bookedSeats: s.bookedSeats ?? [],
            maxSeats: s.maxSeats,
            schedule: s.schedule,
        });
        setIsFormVisible(true);
    };

    const del = (id: string) => {
        if (confirm('Ви впевнені, що хочете видалити цей сеанс?')) {
            dispatch(removeSession(id));
        }
    };

    const isCreate = !editing;

    return (
        <div className="session-management">
            <button className="add-button" onClick={() => setIsFormVisible(true)}>
                Додати новий сеанс
            </button>

            {isFormVisible && (
                <form className="session-form" onSubmit={submit}>
                    {isCreate ? (
                        <select name="movieId" value={form.movie.id || ''} onChange={handleInput} required>
                            <option value="" disabled>
                                Оберіть фільм
                            </option>
                            {movies.map((m) => (
                                <option key={m.id} value={m.id}>
                                    {m.title} ({m.year})
                                </option>
                            ))}
                        </select>
                    ) : (
                        <input type="text" value={`${editing.movie.title} (${editing.movie.year})`} disabled readOnly />
                    )}

                    <input type="date" name="date" value={form.schedule.date} onChange={handleInput} />
                    <input type="time" name="times" value={form.schedule.times} onChange={handleInput} />
                    <input type="number" name="price" value={form.price} onChange={handleInput} placeholder="Ціна" />
                    <input
                        type="number"
                        name="maxSeats"
                        value={form.maxSeats}
                        onChange={handleInput}
                        placeholder="Кількість місць"
                        min="1"
                    />

                    <div className="form-buttons">
                        <button type="submit">{isCreate ? 'Створити' : 'Оновити'}</button>
                        <button type="button" onClick={resetForm}>
                            Скасувати
                        </button>
                    </div>
                </form>
            )}

            {loading && <Loader />}
            {error && <div className="error">{error}</div>}

            {!loading && !error && (
                <>
                    <div className="sessions-list">
                        {paginated.length === 0 ? (
                            <div className="no-sessions">Сеансів не знайдено</div>
                        ) : (
                            paginated.map((s) => (
                                <div key={s.id} className="session-item">
                                    <div className="session-info">
                                        <h3>Фільм: {s.movie.title}</h3>
                                        <p>Дата: {s.schedule.date}</p>
                                        <p>Час: {s.schedule.times}</p>
                                        <p>Ціна: {s.price > 0 ? s.price : 0} грн</p>
                                        <p>Місць: {s.maxSeats}</p>
                                        <p>Заброньовано: {s.bookedSeats?.length || 0}</p>
                                    </div>
                                    <div className="session-actions">
                                        <button className="edit-button" onClick={() => startEdit(s)}>
                                            Редагувати
                                        </button>
                                        <button className="delete-button" onClick={() => s.id && del(s.id)}>
                                            Видалити
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Пагінація */}
                    {pageCount > 1 && (
                        <div className="pagination">
                            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                                ‹
                            </button>
                            {[...Array(pageCount)].map((_, i) => (
                                <button
                                    key={i}
                                    className={page === i + 1 ? 'active' : ''}
                                    onClick={() => setPage(i + 1)}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                                disabled={page === pageCount}
                            >
                                ›
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default SessionManagement;
