import React from "react";
import "./MovieCard.style.css";
import { useMovieGenreQuery } from "../../hooks/useMovieGenre";

const MovieCard = ({ movie }) => {
  const { data: genreData } = useMovieGenreQuery();

  const showGenre = (genreIdList) => {
    if(!genreData) return []
    const genreNameList = genreIdList.map((id) => {
      const genreObj = genreData.find((genre) => genre.id === id)
      return genreObj.name;
    })
    return genreNameList
  }
  return (
    <div
      style={{
        backgroundImage: `url(https://www.themoviedb.org/t/p/w600_and_h900_bestv2${movie.poster_path})`,
      }}
      className="movie-card"
    >
      <div className={`age-badge ${movie.adult ? "adult" : "all"}`}>
        {movie.adult ? "18+" : "ALL"}
      </div>

      <div className="overlay">
        <h1 className="movie-title">{movie.title}</h1>

        <div className="genre-list">
          {showGenre(movie.genre_ids).map((id) => (
            <span key={id} className="genre-badge">
              {id}
            </span>
          ))}
        </div>

        <div className="info-list">
          <div className="info-item">
            <span className="info-label">Score</span>
            <span className="info-value">{movie.vote_average?.toFixed(1)}</span>
          </div>

          <div className="info-item">
            <span className="info-label">Popularity</span>
            <span className="info-value">
              {Math.round(movie.popularity).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
