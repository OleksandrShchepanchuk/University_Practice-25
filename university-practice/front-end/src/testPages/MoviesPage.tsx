import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadMovies } from "../store/slices/movieSlice";
import type { AppDispatch, RootState } from "../store";

const MoviesPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { list, loading, error } = useSelector(
        (state: RootState) => state.movies
    );

    useEffect(() => {
        dispatch(loadMovies());
    }, [dispatch]);

    return (
        <div style={{ padding: 20 }}>
            <h1>Movies</h1>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            {list.map((movie) => (
                <div key={movie.title}>
                    <h2>{movie.title}</h2>
                    <p>{movie.description}</p>
                    <img
                        src={movie.poster}
                        alt={movie.title}
                        width={200}
                    />
                </div>
            ))}
        </div>
    );
};

export default MoviesPage;
