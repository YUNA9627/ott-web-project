import React from "react";
import { useUpcomingMoviesQuery } from "../../../../hooks/useUpcomingMovies";
import Alert from "react-bootstrap/Alert";
import CarouselImport from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import MovieCard from "../MovieCard/MovieCard";
import "./UpcomingMovieSlide.style.css";

const Carousel = CarouselImport.default || CarouselImport;

const responsive = {
  superdesktop: {
    breakpoint: { max: 3000, min: 1400 },
    items: 8,
  },
  desktop: {
    breakpoint: { max: 1400, min: 1280 },
    items: 6,
  },
  laptop: {
    breakpoint: { max: 1280, min: 1024 },
    items: 4,
  },
  tablet: {
    breakpoint: { max: 1024, min: 600 },
    items: 3,
  },
  tablet2: {
    breakpoint: { max: 600, min: 360 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 360, min: 0 },
    items: 1,
  },
};

const UpcommingMovieSlide = () => {
 const { data, isLoading, isError, error } = useUpcomingMoviesQuery();

  if (isLoading) {
    return <h1>Loading..</h1>;
  }

  if (isError) {
    return <Alert variant="danger">{error.message}</Alert>;
  }

  return (
    <div>
      <h3>Upcoming Movies</h3>
      <Carousel
        infinite={true}
        // centerMode={true}
        itemClass="movie-slider p-1"
        containerClass="carousel-container"
        responsive={responsive}
      >
        {data?.results?.map((movie, index) => (
          <MovieCard movie={movie} key={index} />
        ))}
      </Carousel>
    </div>
  )
}

export default UpcommingMovieSlide