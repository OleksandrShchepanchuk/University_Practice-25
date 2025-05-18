import React from 'react';
import './FeaturedMovie.scss';
import { Link } from 'react-router-dom';
import { Movie } from '../../../types/movie';

export interface FeaturedMovieProps {
    movie: Movie;
}

const FeaturedMovie: React.FC<FeaturedMovieProps> = ({ movie }) => {
    const genres = Array.isArray(movie.genre) ? movie.genre : [movie.genre];
    const backgroundImage = movie.photos?.[0] || movie.poster;
    const id = movie.id;

    return (
        <div className="featured-movie__background" style={{ backgroundImage: `url(${backgroundImage})` }}>
            <div className="featured-movie__overlay">
                <img src={movie.poster} alt={movie.title} className="featured-movie__poster" />
                <div className="featured-movie__details">
                    <div className="featured-movie__details-meta">
                        <span>{movie.year}</span>
                        <span>IMDb {movie.rating}/10</span>
                        <span>{movie.duration}</span>
                    </div>
                    <h1 className="featured-movie__details-title">{movie.title}</h1>
                    <div className="featured-movie__details-genres">
                        {genres.map((genre, index) => (
                            <span key={index}>{genre}</span>
                        ))}
                    </div>
                    <p className="featured-movie__details-description">{movie.description}</p>
                    <div className="featured-movie__details-buttons">
                        <Link to={`movies/${id}`} className="featured-movie__details-buttons--more">
                            Дізнатися більше
                        </Link>
                        <button className="featured-movie__details-buttons--buy">Придбати квиток</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeaturedMovie;
