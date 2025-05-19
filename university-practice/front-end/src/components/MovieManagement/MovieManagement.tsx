import React, { useState, useEffect } from 'react';
import { Movie } from '../../types/movie';
import './MovieManagement.scss';
import { getMovies } from '../../api/movies';


interface MovieFormData {
    title: string;
    description: string;
    genre: string;
    rating: number;
    year: number;
    duration: number;
    poster: string;
    trailer: string;
    cast: string;
    photos: string;
}

const MovieManagement: React.FC = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
    const [formData, setFormData] = useState<MovieFormData>({
        title: '',
        description: '',
        genre: '',
        rating: 0,
        year: new Date().getFullYear(),
        duration: 0,
        poster: '',
        trailer: '',
        cast: '',
        photos: ''
    });
    useEffect(() => {
        const fetchMovies = async () => {
            try {
                setLoading(true);
                const data = await getMovies();
                setMovies(data);
            } catch (err) {
                setError('Помилка завантаження фільмів');
                console.error('Error fetching movies:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    const handleEditClick = (movie: Movie) => {
        setFormData({
            title: movie.title,
            description: movie.description || '',
            genre: movie.genre || '',
            rating: movie.rating || 0,
            year: movie.year || new Date().getFullYear(),
            duration: movie.duration || 0,
            poster: movie.poster || '',
            trailer: movie.trailer || '',
            cast: movie.cast?.join(', ') || '',
            photos: movie.photos?.join(', ') || ''
        });
        setEditingMovie(movie);
        setIsFormVisible(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Add API call to create/edit movie
    };

    const handleDelete = async (id: string) => {
        // TODO: Add API call to delete movie
    };

    return (
        <div className="movie-management">
            <button 
                className="add-button"
                onClick={() => setIsFormVisible(true)}
            >
                Додати новий фільм
            </button>

            {isFormVisible && (
                <form className="movie-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Назва фільму"
                        required
                    />
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Опис"
                        required
                    />
                    <input
                        type="text"
                        name="genre"
                        value={formData.genre}
                        onChange={handleInputChange}
                        placeholder="Жанр"
                        required
                    />
                    <input
                        type="number"
                        name="rating"
                        value={formData.rating}
                        onChange={handleInputChange}
                        placeholder="Рейтинг"
                        min="0"
                        max="10"
                        step="0.1"
                        required
                    />
                    <input
                        type="number"
                        name="year"
                        value={formData.year}
                        onChange={handleInputChange}
                        placeholder="Рік"
                        required
                    />
                    <input
                        type="number"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        placeholder="Тривалість (хв)"
                        required
                    />
                    <input
                        type="url"
                        name="poster"
                        value={formData.poster}
                        onChange={handleInputChange}
                        placeholder="URL постера"
                        required
                    />
                    <input
                        type="url"
                        name="trailer"
                        value={formData.trailer}
                        onChange={handleInputChange}
                        placeholder="URL трейлера"
                        required
                    />
                    <input
                        type="text"
                        name="cast"
                        value={formData.cast}
                        onChange={handleInputChange}
                        placeholder="Актори (через кому)"
                        required
                    />
                    <input
                        type="text"
                        name="photos"
                        value={formData.photos}
                        onChange={handleInputChange}
                        placeholder="URLs фото (через кому)"
                        required
                    />
                    <div className="form-buttons">
                        <button type="submit">
                            {editingMovie ? 'Оновити' : 'Створити'}
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
                <div className="movies-list">
                    {movies.length === 0 ? (
                        <div className="no-movies">Фільмів не знайдено</div>
                    ) : (
                        movies.map(movie => (
                            <div key={movie.id} className="movie-item">
                                <img src={movie.poster} alt={movie.title} />
                                <div className="movie-info">
                                    <h3>{movie.title}</h3>
                                    <p>{movie.genre}</p>
                                    <p>{movie.year}</p>
                                </div>
                                <div className="movie-actions">
                                    <button 
                                        className="edit-button"
                                        onClick={() => handleEditClick(movie)}
                                    >
                                        Редагувати
                                    </button>
                                    <button 
                                        className="delete-button"
                                        onClick={() => handleDelete(movie.id)}
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

export default MovieManagement;