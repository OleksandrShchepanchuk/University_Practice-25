import React,{ useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import MoviePosterDet from '../../components/layout/MoviePosterDet/MoviePosterDet';
import Carousel from '../../components/layout/Carousel/Carousel';
import { Movie } from '../../types/movie';
import './MoviePage.scss';
import { getMovieById } from '../../api/movies';



// const movie: Movie = {
//     title: "The Batman",
//     year: 2022,
//     rating: 7.8,
//     duration: 60,
//     genre: "Драма Бойовик",
//     description: "Коли садистський серійний вбивця починає вбивати ключових політичних фігур у Ґотемі,Коли садистський серійний вбивця починає вбивати ключових політичних фігур у ҐотеміКоли садистський серійний вбивця починає вбивати ключових політичних фігур у Ґотемі",
//     cast: ["Роберт Паттінсон", "Зої Кравіц", "Пол Дано"],
//     poster: '../../public/images/batman.jpg',
//     photos: ['../../public/images/batman.jpg', '../../public/images/mbu.jpg'],
//     trailer: 'https://www.youtube.com/watch?v=Hh3g1j0v2xA',
// };

const MoviePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [movie, setMovie] = useState<Movie | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        if (!id) return;
        setLoading(true);
        getMovieById(id)
          .then(setMovie)
          .catch(() => setError('Movie not found'))
          .finally(() => setLoading(false));
      }, [id]);
    
      if (loading) return <div>Loading...</div>;
      if (error || !movie) return <div>{error || 'Movie not found'}</div>;
    return(
    
    <div className="movie-page">
        <div className="movie-content">
            <div className="movie-maininfo">
                <MoviePosterDet movie={movie} />
                <button className="buy-button">Придбати квиток</button>
            </div>
            <div className="movie-extra">
                <Carousel images={movie.photos} />
                <p className="movie-description">{movie.description}</p>
                <p className="movie-cast">У ролях: {movie.cast.join(', ')}</p>
            </div>
        </div>
    </div>
);
}

export default MoviePage;
