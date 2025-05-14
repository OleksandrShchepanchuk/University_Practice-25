import React, { useEffect, useState } from 'react';
import MovieCard from '../MovieCard/MovieCard';
import { MovieWithSession } from '../../../types/movie';
import './MoviesView.scss';
import { useAuth } from '../../../hooks/useAuth';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
type MoviesViewProps = {
    title?: string;
    movies: MovieWithSession[];
    loading?: boolean;
    error?: string | null;
    variant?: 'default' | 'session';
};

const MOVIES_PER_PAGE = 10;

const MoviesView: React.FC<MoviesViewProps> = ({
    title = 'All Movies',
    movies,
    loading,
    error,
    variant = 'default',
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const { isAuthenticated } = useAuth();

    const totalPages = Math.ceil(movies.length / MOVIES_PER_PAGE);
    const startIdx = (currentPage - 1) * MOVIES_PER_PAGE;
    const currentMovies = movies.slice(startIdx, startIdx + MOVIES_PER_PAGE);
    const favourites = useSelector((state: RootState) => state.favourites.list);

    console.log('favourites', favourites);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <section className="movies-view">
            <h1 className="movies-view__title">{title}</h1>

            {loading && <p className="movies-view__status">Loading movies...</p>}
            {error && <p className="movies-view__status movies-view__status--error">Error: {error}</p>}
            {!loading && !error && currentMovies.length === 0 && (
                <p className="movies-view__status">No movies available.</p>
            )}

            <div className="movies-view__grid">
                {currentMovies.map((movie) => (
                    <MovieCard
                        key={movie.id}
                        movie={movie}
                        variant={variant}
                        showTimes={variant === 'session' ? movie.schedule?.[0]?.times : undefined}
                        isFavorite={Array.isArray(favourites) && favourites.some((f) => f.id === movie.id)}
                        showFavouriteButton={isAuthenticated}
                    />
                ))}
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
