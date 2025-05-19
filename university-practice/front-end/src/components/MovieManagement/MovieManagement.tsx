//  src/pages/admin/MovieManagement.tsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadMovies, addMovie, editMovie, removeMovie } from '../../store/slices/movieSlice';
import { Movie } from '../../types/movie';
import type { RootState, AppDispatch } from '../../store';
import Loader from '../common/Loader/Loader';
import './MovieManagement.scss';

interface MovieFormData {
    title: string;
    description: string;
    genre: string;
    rating: string;
    year: string;
    duration: string;
    poster: string;
    trailer: string;
    cast: string;
    photos: string;
}

const blankForm: MovieFormData = {
    title: '',
    description: '',
    genre: '',
    rating: '',
    year: '',
    duration: '',
    poster: '',
    trailer: '',
    cast: '',
    photos: '',
};

const PER_PAGE = 6;

const MovieManagement = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { list: movies, loading, error, hasLoaded } = useSelector((s: RootState) => s.movies);

    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editing, setEditing] = useState<Movie | null>(null);
    const [form, setForm] = useState<MovieFormData>(blankForm);

    // pagination
    const [page, setPage] = useState(1);
    const pageCount = Math.max(1, Math.ceil(movies.length / PER_PAGE));
    const paginated = movies.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    useEffect(() => {
        if (!hasLoaded && !error && !loading) dispatch(loadMovies());
    }, [dispatch, movies.length]);

    const resetForm = () => {
        setEditing(null);
        setForm(blankForm);
        setIsFormVisible(false);
    };

    const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleEditClick = (m: Movie) => {
        setEditing(m);
        setForm({
            title: m.title,
            description: m.description ?? '',
            genre: m.genre.join(', '),
            rating: m.rating?.toString() ?? '',
            year: m.year?.toString() ?? '',
            duration: m.duration?.toString() ?? '',
            poster: m.poster ?? '',
            trailer: m.trailer ?? '',
            cast: m.cast?.join(', ') ?? '',
            photos: m.photos?.join(', ') ?? '',
        });
        setIsFormVisible(true);
    };

    const buildPayload = (): Omit<Movie, 'id'> => ({
        title: form.title,
        description: form.description,
        genre: form.genre
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
        rating: Number(form.rating.replace(',', '.')) || 0,
        year: Number(form.year) || new Date().getFullYear(),
        duration: Number(form.duration) || 0,
        poster: form.poster || 'https://via.placeholder.com/400x600',
        trailer: form.trailer || 'https://example.com',
        cast: form.cast
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
        photos:
            form.photos.trim() === ''
                ? []
                : form.photos
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean),
    });

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (editing) {
            await dispatch(editMovie({ id: editing.id, movie: buildPayload() })).unwrap();
        } else {
            await dispatch(addMovie(buildPayload() as Movie)).unwrap();
        }

        resetForm();
    };

    const del = (id: string) => {
        if (confirm('Ви впевнені, що хочете видалити цей фільм?')) {
            dispatch(removeMovie(id));
        }
    };

    return (
        <div className="movie-management">
            <button className="add-button" onClick={() => setIsFormVisible(true)}>
                Додати новий фільм
            </button>

            {isFormVisible && (
                <form className="movie-form" onSubmit={submit}>
                    <input name="title" value={form.title} onChange={handleInput} placeholder="Назва фільму" required />
                    <textarea name="description" value={form.description} onChange={handleInput} placeholder="Опис" />
                    <input name="genre" value={form.genre} onChange={handleInput} placeholder="Жанри (через кому)" />
                    <input
                        type="number"
                        name="rating"
                        value={form.rating}
                        onChange={handleInput}
                        placeholder="Рейтинг"
                        min="0"
                        max="10"
                        step="0.1"
                    />
                    <input type="number" name="year" value={form.year} onChange={handleInput} placeholder="Рік" />
                    <input
                        type="number"
                        name="duration"
                        value={form.duration}
                        onChange={handleInput}
                        placeholder="Тривалість (хв)"
                    />
                    <input
                        type="url"
                        name="poster"
                        value={form.poster}
                        onChange={handleInput}
                        placeholder="URL постера"
                    />
                    <input
                        type="url"
                        name="trailer"
                        value={form.trailer}
                        onChange={handleInput}
                        placeholder="URL трейлера"
                    />
                    <input name="cast" value={form.cast} onChange={handleInput} placeholder="Актори (через кому)" />
                    <input
                        name="photos"
                        value={form.photos}
                        onChange={handleInput}
                        placeholder="URLs фото (через кому)"
                    />

                    <div className="form-buttons">
                        <button type="submit">{editing ? 'Оновити' : 'Створити'}</button>
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
                    <div className="movies-list">
                        {paginated.length === 0 ? (
                            <div className="no-movies">Фільмів не знайдено</div>
                        ) : (
                            paginated.map((m) => (
                                <div key={m.id} className="movie-item">
                                    <img src={m.poster} alt={m.title} />
                                    <div className="movie-info">
                                        <h3>{m.title}</h3>
                                        <p>{m.genre.join(', ')}</p>
                                        <p>{m.year}</p>
                                    </div>
                                    <div className="movie-actions">
                                        <button className="edit-button" onClick={() => handleEditClick(m)}>
                                            Редагувати
                                        </button>
                                        <button className="delete-button" onClick={() => del(m.id)}>
                                            Видалити
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

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

export default MovieManagement;
