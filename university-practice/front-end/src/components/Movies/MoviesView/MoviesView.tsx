import React, { useState, useEffect } from 'react';
import MovieCard from '../MovieCard/MovieCard';
import { MovieWithSession } from '../../../types/movie';
import { Movie } from '../../../types/movie';
import './MoviesView.scss';
import { useAuth } from '../../../hooks/useAuth';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import Loader from '../../common/Loader/Loader';

type MoviesViewProps = {
    title?: string;
    movies: (Movie | MovieWithSession)[];
    loading?: boolean;
    error?: string | null;
    variant?: 'default' | 'session';
};

const MOVIES_PER_PAGE = 10;

const isMovieWithSession = (movie: Movie | MovieWithSession): movie is MovieWithSession => {
    return (
        'schedule' in movie &&
        Array.isArray(movie.schedule) &&
        movie.schedule.length > 0 &&
        Array.isArray(movie.schedule[0].times)
    );
};

const MoviesView: React.FC<MoviesViewProps> = ({ title = 'Movies', movies, loading, error, variant = 'default' }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGenre, setSelectedGenre] = useState<string>('');
    const [selectedYear, setSelectedYear] = useState<string>('');
    const [selectedRating, setSelectedRating] = useState<string>('');

    const { isAuthenticated } = useAuth();
    const favourites = useSelector((state: RootState) => state.favourites.list);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const allGenres = Array.from(
        new Set(movies.flatMap(movie => movie.genre || []))
    ).sort();

    const allYears = Array.from(
        new Set(movies.map(movie => movie.year.toString()))
    ).sort((a, b) => parseInt(b) - parseInt(a));

    // Опції для рейтингу
    const ratingOptions = [
        { value: '', label: 'Будь-який рейтинг' },
        { value: '9', label: '9+ Відмінно' },
        { value: '8', label: '8+ Дуже добре' },
        { value: '7', label: '7+ Добре' },
        { value: '6', label: '6+ Задовільно' },
        { value: '5', label: '5+ Посередньо' },
    ];

    const q = searchQuery.trim().toLowerCase();

    const filteredMovies = movies.filter((m) => {
        const matchesTitle = m.title.toLowerCase().includes(q);
        const matchesGenre = selectedGenre ? m.genre?.includes(selectedGenre) : true;
        const matchesYear = selectedYear ? m.year.toString() === selectedYear : true;
        const matchesRating = selectedRating ? 
            m.rating !== undefined && m.rating >= parseFloat(selectedRating) : true;
        
        return matchesTitle && matchesGenre && matchesYear && matchesRating;
    });

    const totalPages = Math.ceil(filteredMovies.length / MOVIES_PER_PAGE);
    const startIdx = (currentPage - 1) * MOVIES_PER_PAGE;
    const currentMovies = filteredMovies.slice(startIdx, startIdx + MOVIES_PER_PAGE);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedGenre, selectedYear, selectedRating]);

    return (
        <section className="movies-view">
            {loading && <Loader />}
            {error && <p className="movies-view__status movies-view__status--error">Error: {error}</p>}
            {!loading && !error && currentMovies.length === 0 && (
                <p className="movies-view__status">Немає доступних фільмів.</p>
            )}

            <div className="movies-view__filters">
                <div className="movies-view__search">
                    <input
                        type="text"
                        placeholder="Пошук за назвою"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="movies-view__search-input"
                    />
                </div>

                <div className="movies-view__selectors">
                    <select
                        value={selectedRating}
                        onChange={(e) => setSelectedRating(e.target.value)}
                        className="movies-view__select"
                    >
                        {ratingOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>

                    <select
                        value={selectedGenre}
                        onChange={(e) => setSelectedGenre(e.target.value)}
                        className="movies-view__select"
                    >
                        <option value="">Усі жанри</option>
                        {allGenres.map((genre) => (
                            <option key={genre} value={genre}>
                                {genre}
                            </option>
                        ))}
                    </select>

                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="movies-view__select"
                    >
                        <option value="">Усі роки</option>
                        {allYears.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="movies-view__grid">
                {currentMovies.map((movie) => {
                    const showTimes =
                        variant === 'session' && isMovieWithSession(movie) ? movie.schedule[0]?.times : undefined;

                    return (
                        <MovieCard
                            key={movie.id}
                            movie={movie}
                            variant={variant}
                            showTimes={showTimes}
                            isFavorite={Array.isArray(favourites) && favourites.some((f) => f.id === movie.id)}
                            showFavouriteButton={isAuthenticated}
                        />
                    );
                })}
            </div>

            {!loading && totalPages > 1 && (
                <div className="movies-view__pagination">
                    <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                        ← Prev
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={page === currentPage ? 'active' : ''}
                        >
                            {page}
                        </button>
                    ))}
                    <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                        Next →
                    </button>
                </div>
            )}
        </section>
    );
};

export default MoviesView;