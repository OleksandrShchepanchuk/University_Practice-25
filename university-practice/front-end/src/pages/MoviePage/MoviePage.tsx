import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

import MoviePosterDet from '../../components/layout/MoviePosterDet/MoviePosterDet';
import Carousel from '../../components/layout/Carousel/Carousel';
import { Movie } from '../../types/movie';
import './MoviePage.scss';
import { getMovieById } from '../../api/movies';
import Loader from '../../components/common/Loader/Loader';

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
    const navigate = useNavigate();
    useEffect(() => {
        if (!id) return;
        setLoading(true);
        getMovieById(id)
            .then((data) => {
                setMovie(data);
                console.log('Movie Poster URL:', data.poster); // <-- ADD THIS
            })
            .catch(() => setError('Movie not found'))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <Loader />;
    if (error || !movie) return <div>{error || 'Movie not found'}</div>;
    return (
        <div className="movie-page" style={{ '--movie-bg': `url(${movie.poster})` } as React.CSSProperties}>
            <div className="movie-content">
                <div className="movie-maininfo">
                    <MoviePosterDet movie={movie} />
                    <button onClick={() => navigate('/sessions')} className="buy-button">
                        Придбати квиток
                    </button>
                </div>
                <div className="movie-extra">
                    <Carousel
                        images={
                            movie.photos && movie.photos.length > 0
                                ? movie.photos
                                : [
                                      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_3H1BY4bIYR8000Z5yP0YjspdG7DQ61N3Zg&s',
                                      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_3H1BY4bIYR8000Z5yP0YjspdG7DQ61N3Zg&s',
                                      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_3H1BY4bIYR8000Z5yP0YjspdG7DQ61N3Zg&s',
                                      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_3H1BY4bIYR8000Z5yP0YjspdG7DQ61N3Zg&s',
                                      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_3H1BY4bIYR8000Z5yP0YjspdG7DQ61N3Zg&s',
                                      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_3H1BY4bIYR8000Z5yP0YjspdG7DQ61N3Zg&s',
                                      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_3H1BY4bIYR8000Z5yP0YjspdG7DQ61N3Zg&s',
                                      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_3H1BY4bIYR8000Z5yP0YjspdG7DQ61N3Zg&s',
                                      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_3H1BY4bIYR8000Z5yP0YjspdG7DQ61N3Zg&s',
                                  ]
                        }
                    />
                    <p className="movie-description">{movie.description}</p>
                    <p className="movie-cast">У ролях: {movie.cast.join(', ')}</p>
                </div>
            </div>
        </div>
    );
};

export default MoviePage;
