// import { useEffect } from 'react';
// import { useAppDispatch, useAppSelector } from '../hooks/useAuth';
// import { loadMovies } from '../store/slices/movieSlice';

// const MovieList = () => {
//   const dispatch = useAppDispatch();
//   const { list, loading, error } = useAppSelector((state) => state.movies);

//   useEffect(() => {
//     dispatch(loadMovies());
//   }, [dispatch]);

//   if (loading) return <p>Завантаження...</p>;
//   if (error) return <p>Помилка: {error}</p>;

//   return (
//     <ul>
//       {list.map((movie) => (
//         <li key={movie.title}>{movie.title}</li>
//       ))}
//     </ul>
//   );
// };

// export default MovieList;
