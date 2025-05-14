import React from 'react';
import { Link } from 'react-router-dom';
import './MovieCard.scss';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import type { MovieWithSession } from '../../../types/movie';
import type { AppDispatch } from '../../../store';
import { toggleFavourite } from '../../../store/slices/favouriteSlice';

type Variant = 'default' | 'session';

interface MovieCardProps {
    movie: MovieWithSession;
    showTimes?: string[];
    variant?: Variant;
    isFavorite: boolean;
    showFavouriteButton: boolean;
}

const MovieCard: React.FC<MovieCardProps> = ({
    movie,
    showTimes,
    variant = 'default',
    isFavorite,
    showFavouriteButton,
}) => {
    const dispatch = useDispatch<AppDispatch>();

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.preventDefault();

        dispatch(toggleFavourite(movie));
    };
    const link = variant === 'session' ? `/tickets/${movie.id}` : `/movies/${movie.id}`;

    return (
        <Link to={link} className="movie-card">
            <div className="movie-card__image">
                <img src={movie.poster} alt={movie.title} />
            </div>
            <div className="movie-card__info">
                {showFavouriteButton && (
                    <button
                        className={isFavorite ? 'movie-card__fav-btn active' : 'movie-card__fav-btn'}
                        onClick={handleFavoriteClick}
                    >
                        {isFavorite ? <FaStar /> : <FaRegStar />}
                    </button>
                )}
                <div className="movie-card__title">{movie.title}</div>
                {variant === 'session' && showTimes && (
                    <div className="movie-card__times">
                        {showTimes.map((time) => (
                            <span key={time}>{time}</span>
                        ))}
                    </div>
                )}
                {variant === 'session' && movie.price !== undefined && (
                    <div className="movie-card__price">{movie.price} ₴</div>
                )}
            </div>
        </Link>
    );
};

export default MovieCard;
