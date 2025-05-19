import React, { useState } from 'react';
import { Movie } from '../../../types/movie';
import './MoviePosterDet.scss';
import type { AppDispatch } from '../../../store';
import { useDispatch } from 'react-redux';
import { toggleFavourite } from '../../../store/slices/favouriteSlice';

import { FaStar, FaRegStar } from 'react-icons/fa';
import { FaPlay } from 'react-icons/fa';
interface Props {
    movie: Movie;
}

const MoviePosterDet: React.FC<Props> = ({ movie }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsFavorite(!isFavorite);

        dispatch(toggleFavourite(movie));
    };

    console.log(movie.genre);
    return (
        <div className="movie-card">
            <img src={movie.poster} alt={movie.title} className="poster" />
            <div className="movie-info">
                <p className="genres">{movie.genre?.join('    ')}</p>
                <div className="title-row">
                    <h2 className="title">{movie.title}</h2>
                    <div className="icon-buttons">
                        <button className="icon-button" onClick={() => window.open(movie.trailer, '_blank')}>
                            <FaPlay />
                        </button>
                        <button className={`icon-button ${isFavorite ? 'active' : ''}`} onClick={handleFavoriteClick}>
                            {isFavorite ? <FaStar /> : <FaRegStar />}
                        </button>
                    </div>
                </div>
                <p className="details">
                    {movie.year}
                    <span className="separator"> </span>
                    IMDb {movie.rating}/10<span className="separator"></span>
                    {movie.duration} хв
                </p>
            </div>
        </div>
    );
};

export default MoviePosterDet;
