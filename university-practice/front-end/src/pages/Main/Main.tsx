import React, { useEffect, useMemo } from 'react';
import './Main.scss';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { AppDispatch } from '../../store';
import { loadMovies } from '../../store/slices/movieSlice';
import MoviesView from '../../components/Movies/MoviesView/MoviesView';
import FeaturedMovie from '../../components/Movies/FeaturedMovie/FeaturedMovie';
import { useAuth } from '../../hooks/useAuth';
import type { Movie } from '../../types/movie'; // adjust import if needed

const Main: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { isAuthenticated } = useAuth();

    const {
        list: movies,
        loading: moviesLoading,
        error: moviesError,
        hasLoaded,
    } = useSelector((state: RootState) => state.movies);

    useEffect(() => {
        if (!hasLoaded && !moviesLoading && isAuthenticated) {
            dispatch(loadMovies());
        }
    }, [hasLoaded, moviesLoading, isAuthenticated, dispatch]);

    const randomFeatured = useMemo(() => {
        if (!movies || movies.length === 0) return null;

        const randomIndex = Math.floor(Math.random() * movies.length);
        const movie: Movie = movies[randomIndex];

        return movie;
    }, [movies]);

    return (
        <div className="main">
            <div className="main__background"></div>
            <div className="main__page">
                {randomFeatured && <FeaturedMovie movie={randomFeatured} />}
                <MoviesView title="All Movies" movies={movies} loading={moviesLoading} error={moviesError} />
            </div>
        </div>
    );
};

export default Main;
