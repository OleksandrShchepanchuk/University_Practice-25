import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import MoviePosterDet from '../../components/layout/MoviePosterDet/MoviePosterDet';
import Carousel from '../../components/layout/Carousel/Carousel';
import { Movie } from '../../types/movie';
import { getMovieById } from '../../api/movies';
import Loader from '../../components/common/Loader/Loader';
import { loadSessions } from '../../store/slices/sessionsSlice';
import { useDispatch, useSelector } from 'react-redux';

import type { RootState } from '../../store';
import { AppDispatch } from '../../store';
import './MoviePage.scss';
import { useAuth } from '../../hooks/useAuth';
import { MoviesSession } from '../../types/movies-session';

const MoviePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [movie, setMovie] = useState<Movie | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { isAuthenticated } = useAuth();

    const {
        list: sessions,
        loading: sessionsLoading,
        error: sessionsError,
        hasLoaded: sessionLoaded,
    } = useSelector((state: RootState) => state.sessions);

    useEffect(() => {
        if (!sessionLoaded && !sessionsLoading && isAuthenticated) {
            dispatch(loadSessions());
        }
    }, [sessionLoaded, sessionsLoading, isAuthenticated, dispatch]);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        getMovieById(id)
            .then(setMovie)
            .catch(() => setError('Movie not found'))
            .finally(() => setLoading(false));
    }, [id]);

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

    const showButton = rmovies.some((m: Movie) => m.id === id);

    if (loading) return <Loader />;
    if (error || !movie) return <div>{error || 'Movie not found'}</div>;

    const backgroundImage = movie.photos?.[0] || movie.poster;

    return (
        <div className="movie-page-full" style={{ backgroundImage: `url(${backgroundImage})` }}>
            <div className="movie-page-full__overlay">
                <div className="movie-page-full__content">
                    <div className="movie-page-full__maininfo">
                        <MoviePosterDet movie={movie} />
                        {showButton ? (
                            <button onClick={() => navigate(`/tickets/${id}`)} className="movie-page-full__buy-button">
                                Придбати квиток
                            </button>
                        ) : (
                            <div className="movie-page-full__no-session">Фільму немає у прокаті</div>
                        )}
                    </div>
                    <div className="movie-page-full__extra">
                        <Carousel images={movie.photos?.length ? movie.photos : [movie.poster]} />
                        <p className="movie-page-full__description">{movie.description}</p>
                        <p className="movie-page-full__cast">У ролях: {movie.cast.join(', ')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MoviePage;
