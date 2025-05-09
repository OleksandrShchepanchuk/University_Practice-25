import FilmCard from '../MovieCard/MovieCard';
import type { Movie } from '../../../types/movie.ts';
import FilmCard from '../MovieCard/MovieCard';
import type { Movie } from '../../../types/movie';

const films: Movie[] = [
    {
        title: 'Inception',
        poster: '/images/inception.jpg',
        description: 'A thief who steals corporate secrets through dream-sharing.',
        genre: 'Sci-Fi',
        rating: 8.8,
        year: 2010,
        trailer: 'https://youtube.com/trailer/inception',
        cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt'],
    },
    {
        title: 'Interstellar',
        poster: '/images/interstellar.jpg',
        description: 'A team of explorers travel through a wormhole in space.',
        genre: 'Sci-Fi',
        rating: 8.6,
        year: 2014,
        trailer: 'https://youtube.com/trailer/interstellar',
        cast: ['Matthew McConaughey', 'Anne Hathaway'],
    },
];

const FilmsView = () => {
    return (
        <div className="films-view">
            {films.map((film) => (
                <FilmCard key={film.title} film={film} />
            ))}
        </div>
    );
};
export default FilmsView;
