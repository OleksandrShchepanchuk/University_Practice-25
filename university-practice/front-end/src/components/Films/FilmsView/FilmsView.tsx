import FilmCard from '../FilmCard/FilmCard';


const movie = []: Movie[]; // Assuming you have a Film type defined somewhere 

const FilmsView =
    () =>
    ({ films }: Movie) => {
        return (
            <div className="films-view">
                {films.map((film) => (
                    <FilmCard key={film.id} film={film} />
                ))}
            </div>
        );
    };

export default FilmsView;
