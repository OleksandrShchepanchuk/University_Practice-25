import React from "react";
import styles from "./Main.module.scss";

// interface Movie {
//   id: number;
//   title: string;
//   poster: string;
//   description: string;
// }

const featuredMovie = {
  title: "The Batman",
  year: 2022,
  rating: 7.9,
  duration: "2h 56m",
  genres: ["Драма", "Бойовик"],
  description:
    "Коли садистський серійний вбивця починає вбивати ключових політичних фігур у Ґотемі...",
  poster: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg",
  background: "https://image.tmdb.org/t/p/w500/bVm6udIB6iKsRqgMdQh6HywuEBj.jpg",
};

// const movies: Movie[] = [
//   {
//     id: 1,
//     title: "Wonder Woman",
//     poster: "https://image.tmdb.org/t/p/w500/`imekS7f1OuHyUP2LAiTEM0zBzUz.jpg",
//     description: "",
//   },
//   {
//     id: 2,
//     title: "Bullet Train",
//     poster: "https://image.tmdb.org/t/p/w500/tVxDe01Zy3kZqaZRNiXFGDICdZk.jpg",
//     description: "",
//   },
//   {
//     id: 3,
//     title: "Me Before You",
//     poster: "https://image.tmdb.org/t/p/w500/7QshG75xKCmClghQDU1ta2BTaja.jpg",
//     description: "",
//   },
//   // повтор для демонстрації
//   {
//     id: 4,
//     title: "Bullet Train",
//     poster: "https://image.tmdb.org/t/p/w500/tVxDe01Zy3kZqaZRNiXFGDICdZk.jpg",
//     description: "",
//   },
//   {
//     id: 5,
//     title: "Wonder Woman",
//     poster: "https://image.tmdb.org/t/p/w500/imekS7f1OuHyUP2LAiTEM0zBzUz.jpg",
//     description: "",
//   },
//   {
//     id: 6,
//     title: "Me Before You",
//     poster: "https://image.tmdb.org/t/p/w500/7QshG75xKCmClghQDU1ta2BTaja.jpg",
//     description: "",
//   },
// ];

const Main: React.FC = () => {
  return (
    <div className={styles.main}>
      <div className={styles.background}></div>
      <div className={styles.page}>
        <div
          className={styles["background-image"]}
          style={{ backgroundImage: `url(${featuredMovie.background})` }}
        >
          <div className={styles.overlay}>
            <img
              src={featuredMovie.poster}
              alt={featuredMovie.title}
              className={styles.poster}
            />
            <div className={styles.details}>
              <div className={styles.meta}>
                <span>{featuredMovie.year}</span>
                <span>IMDb {featuredMovie.rating}/10</span>
                <span>{featuredMovie.duration}</span>
              </div>
              <h1>{featuredMovie.title}</h1>
              <div className={styles.genres}>
                {featuredMovie.genres.map((genre, index) => (
                  <span key={index} className={styles.genre}>
                    {genre}
                  </span>
                ))}
              </div>
              <p>{featuredMovie.description}</p>
              <div className={styles.buttons}>
                <button className={styles.more}>Дізнатися більше</button>
                <button className={styles.buy}>Придбати квиток</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
