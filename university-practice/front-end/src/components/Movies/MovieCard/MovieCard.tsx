import React from 'react';
import { Link } from 'react-router-dom';
// import { useSelector } from 'react-redux';

const FilmCard = ({ filmId }: { filmId: number }) => {
    // const film = useSelector((state: RootState) => state.films.find((f) => f.id === filmId));

    return (
        <Link to={`/films/${id}`} className="film-card">
            <div className="film-card__image">
                <img src={imageUrl} alt={title}></img>
            </div>
        </Link>
    );
};

export default FilmCard;
