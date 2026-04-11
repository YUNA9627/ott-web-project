import React from "react";
import { usePopularMoivesQuery } from "../../../../hooks/usePopularMovies";
import Alert from "react-bootstrap/Alert";
import "./Banner.style.css";

const Banner = () => {
  const { data, isLoading, isError, error } = usePopularMoivesQuery();

  console.log("ddd", data);

  if (isLoading) {
    return <h1>Loading..</h1>;
  }

  if (isError) {
    return <Alert variant="danger">{error.message}</Alert>;
  }

  return (
    <div
      style={{
        backgroundImage: `url(https://www.themoviedb.org/t/p/w1066_and_h600_bestv2${data.results[0].poster_path})`,
      }}
      className="banner"
    >
      <div className="banner-text-area">
        <h1>{data?.results[0].title}</h1>
        <p>{data?.results[0].overview}</p>
      </div>
    </div>
  );
};

export default Banner;
