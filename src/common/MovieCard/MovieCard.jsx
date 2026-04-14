import React from "react";
import axios from "axios";
import "./MovieCard.style.css";
import { useMovieGenreQuery } from "../../hooks/useMovieGenre";
import { useQuery } from "@tanstack/react-query";

const fetchMovieCertification = async (movieId) => {
  const response = await axios.get(
    `https://api.themoviedb.org/3/movie/${movieId}?append_to_response=release_dates`,
    {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_APP_API_KEY}`,
      },
    },
  );

  return response.data;
};

const MovieCard = ({ movie }) => {
  const { data: genreData } = useMovieGenreQuery();
  // console.log("장르 목록:", genreData);

  const { data: movieDetail } = useQuery({
    queryKey: ["movie-certification", movie.id],
    queryFn: () => fetchMovieCertification(movie.id),
    staleTime: 1000 * 60 * 10,
  });

  const showGenre = (genreIdList) => {
    if (!genreData) return [];

    return genreIdList
      .map((id) => genreData.find((genre) => genre.id === id)?.name)
      .filter(Boolean);
  };

  const getUsCertification = () => {
    if (!movieDetail?.release_dates?.results) return "";

    const usData = movieDetail.release_dates.results.find(
      (item) => item.iso_3166_1 === "US",
    );

    if (!usData?.release_dates?.length) return "";

    const certificationItem = usData.release_dates.find(
      (item) => item.certification && item.certification.trim() !== "",
    );

    return certificationItem?.certification || "";
  };

  const convertAgeBadge = (certification) => {
    switch (certification) {
      case "G":
      case "PG":
        return "ALL";
      case "PG-13":
        return "12";
      case "R":
        return "15";
      case "NC-17":
        return "19";
      default:
        return "ALL";
    }
  };

  const ageBadge = convertAgeBadge(getUsCertification());
  return (
    <div
      style={{
        backgroundImage: `url(https://www.themoviedb.org/t/p/w600_and_h900_bestv2${movie.poster_path})`,
      }}
      className="movie-card"
    >
      <div className="overlay">
        <div className={`age age_${ageBadge}`}>{ageBadge}</div>
        <h1 className="movie-title">{movie.title}</h1>

        <div className="genre-list">
          {showGenre(movie.genre_ids).map((genre) => (
            <span key={genre} className="genre-badge">
              {genre}
            </span>
          ))}
        </div>

        <div className="info-list">
          <div className="info-item">
            <span className="info-star">★</span>
            <span className="info-value">{movie.vote_average?.toFixed(1)}</span>
          </div>
          <div className="info-item">
            <span className="info-year">{movie.release_date?.slice(0, 4)}</span>
          </div>
          <div className="info-item">
            <span className="info-year">
              {movieDetail?.runtime ? `${movieDetail.runtime}분` : "-"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
