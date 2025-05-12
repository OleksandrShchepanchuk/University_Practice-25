import React from 'react';
import { Movie } from '../../../types/movie';
import './MoviePosterDet.scss';

import { FaStar, FaRegStar } from 'react-icons/fa';
import { FaPlay } from 'react-icons/fa';
interface Props {
    movie: Movie;
}

const MoviePosterDet: React.FC<Props> = ({ movie }) => (
   <div className="movie-card">
    <img src={movie.poster} alt={movie.title} className="poster" />
    <div className="movie-info">
      <p className="genres">{movie.genre.split(' ').join('    ')}</p>
      <div className="title-row">
        <h2 className="title">{movie.title}</h2>
        <div className="icon-buttons">
          <button className="icon-button">
            <FaPlay />
          </button>
          <button className="icon-button">
            <FaRegStar />
          </button>
        </div>
      </div>
      <p className="details">
        {movie.year}<span className="separator"> </span>
        IMDb {movie.rating}/10<span className="separator"></span>
        {movie.duration} хв
      </p>    
    </div>
  </div>
);

export default MoviePosterDet;
