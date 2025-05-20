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

    const { isAuthenticated } = useAuth();
    const favourites = useSelector((state: RootState) => state.favourites.list);
    const [searchQuery, setSearchQuery] = useState('');

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const q = searchQuery.trim().toLowerCase();

    const filteredMovies = movies.filter(
        (m) =>
            m.title.toLowerCase().includes(q) ||
            m.genre?.some((g) => g.toLowerCase().includes(q)) ||
            m.year.toString().includes(q),
    );

    const totalPages = Math.ceil(filteredMovies.length / MOVIES_PER_PAGE);
    const startIdx = (currentPage - 1) * MOVIES_PER_PAGE;
    const currentMovies = filteredMovies.slice(startIdx, startIdx + MOVIES_PER_PAGE);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    return (
        <section className="movies-view">
            {/* <h1 className="movies-view__title">{title}</h1> */}

            {loading && <Loader />}
            {error && <p className="movies-view__status movies-view__status--error">Error: {error}</p>}
            {!loading && !error && currentMovies.length === 0 && (
                <p className="movies-view__status">Немає доступних фільмів.</p>
            )}

            <div className="movies-view__search">
                <input
                    type="text"
                    placeholder="Пошук"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="movies-view__search-input"
                />
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
