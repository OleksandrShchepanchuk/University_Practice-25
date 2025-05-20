import React, { useEffect, useMemo, useRef, useState } from 'react';
import './Main.scss';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { AppDispatch } from '../../store';
import MoviesView from '../../components/Movies/MoviesView/MoviesView';
import FeaturedMovie from '../../components/Movies/FeaturedMovie/FeaturedMovie';
import { useAuth } from '../../hooks/useAuth';
import type { Movie } from '../../types/movie';
import { loadSessions } from '../../store/slices/sessionsSlice';
import { loadMovies } from '../../store/slices/movieSlice';
import { MoviesSession } from '../../types/movies-session';

const Main: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { isAuthenticated } = useAuth();
    const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
    const featuredSet = useRef(false); // ✅ запобігає подвійному встановленню

    const {
        list: sessions,
        loading: sessionsLoading,
        error: sessionsError,
        hasLoaded: sessionLoaded,
    } = useSelector((state: RootState) => state.sessions);

    const {
        list: movies,
        loading: moviesLoading,
        error: moviesError,
        hasLoaded: movieLoaded,
    } = useSelector((state: RootState) => state.movies);

    useEffect(() => {
        if (!movieLoaded && !moviesLoading && isAuthenticated) {
            dispatch(loadMovies());
        }
    }, [movieLoaded, moviesLoading, isAuthenticated, dispatch]);

    useEffect(() => {
        if (!sessionLoaded && !sessionsLoading && isAuthenticated) {
            dispatch(loadSessions());
        }
    }, [sessionLoaded, sessionsLoading, isAuthenticated, dispatch]);

    const rmovies = useMemo(() => {
        const now = new Date();
        const futureSessions = sessions.filter((session: MoviesSession) => {
            const { date, times } = session.schedule;
            const sessionDate = new Date(`${date}T${times}`);
            return sessionDate > now;
        });

        const uniqueMoviesMap = new Map<string, Movie>();
        for (const session of futureSessions) {
            uniqueMoviesMap.set(session.movie.id, session.movie);
        }

        return Array.from(uniqueMoviesMap.values());
    }, [sessions]);

    useEffect(() => {
        if (rmovies.length > 0 && !featuredSet.current) {
            featuredSet.current = true;
            const randomIndex = Math.floor(Math.random() * rmovies.length);
            const selectedMovie = rmovies[randomIndex];
            setFeaturedMovie(selectedMovie);
        }
    }, [rmovies]);

    return (
        <div className="main">
            <div className="main__background"></div>
            <div className="main__page">
                {featuredMovie && <FeaturedMovie movie={featuredMovie} />}
                <MoviesView
                    title="All Movies"
                    movies={movies}
                    loading={sessionsLoading}
                    error={sessionsError}
                />
            </div>
        </div>
    );
};

export default Main;
