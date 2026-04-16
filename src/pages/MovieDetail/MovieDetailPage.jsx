import React from "react";
import { useState } from "react";
import { Alert } from "react-bootstrap";
import { Link, useOutletContext, useParams } from "react-router-dom";
import YouTube from "react-youtube";
import { useMovieDetailQuery } from "../../hooks/useMovieDetail";
import { useMovieReviewsQuery } from "../../hooks/useMovieReviews";
import { useMovieVideosQuery } from "../../hooks/useMovieVideos";
import { getUsCertification, convertAgeBadge } from "../../utils/movie";
import "./MovieDetailPage.style.css";

// const getUsCertification = (movieDetail) => {
//   if (!movieDetail?.release_dates?.results) return "";

//   const usData = movieDetail.release_dates.results.find(
//     (item) => item.iso_3166_1 === "US",
//   );

//   if (!usData?.release_dates?.length) return "";

//   const certificationItem = usData.release_dates.find(
//     (item) => item.certification && item.certification.trim() !== "",
//   );

//   return certificationItem?.certification || "";
// };

// const convertAgeBadge = (certification) => {
//   switch (certification) {
//     case "G":
//     case "PG":
//       return "ALL";
//     case "PG-13":
//       return "12";
//     case "R":
//       return "15";
//     case "NC-17":
//       return "19";
//     default:
//       return "ALL";
//   }
// };

const MovieDetailPage = () => {
  const { id } = useParams();

  const { showGlobalAlert } = useOutletContext(); // 글로벌 Alert

  const [language, setLanguage] = useState("ko-KR");

  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  const [expandedReviews, setExpandedReviews] = useState({});
  const REVIEW_PREVIEW_LENGTH = 200;

  const { data, isLoading, isError, error } = useMovieDetailQuery(id, language);
  const { data: videoData } = useMovieVideosQuery(id, language);

  const {
    data: reviewData,
    isLoading: isReviewLoading,
    isError: isReviewError,
  } = useMovieReviewsQuery(id, language, 1);

  const toggleReview = (reviewId) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  // 예고편 보기 버튼 클릭 함수
  const handleTrailerClick = () => {
    if (trailer) {
      setIsTrailerOpen(true);
    } else {
      showGlobalAlert("등록된 예고편이 없습니다.");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <Alert variant="danger">{error.message}</Alert>;
  }

  const ageBadge = convertAgeBadge(getUsCertification(data));
  const castList = data?.credits?.cast?.slice(0, 8) || [];
  const director = data?.credits?.crew?.find(
    (person) => person.job === "Director",
  );

  const reviews = reviewData?.results || [];

  const trailer =
    videoData?.results?.find(
      (video) => video.site === "YouTube" && video.type === "Trailer",
    ) || videoData?.results?.find((video) => video.site === "YouTube");

  const youtubeOpts = {
    width: "100%",
    height: "100%",
    playerVars: {
      autoplay: 1,
      rel: 0,
    },
  };

  return (
    <div className="movie-detail-page">
      <div
        className="movie-detail-backdrop"
        style={{
          backgroundImage: data?.backdrop_path
            ? `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.95)), url(https://image.tmdb.org/t/p/original${data.backdrop_path})`
            : "linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.95))",
        }}
      >
        
        <div className="movie-detail-inner">
          <Link to="/movies" className="movie-detail-back-link">
            ← 목록으로
          </Link>

          <div className="movie-language-toggle">
            <button
              type="button"
              className={language === "ko-KR" ? "active" : ""}
              onClick={() => setLanguage("ko-KR")}
            >
              한국어
            </button>
            <button
              type="button"
              className={language === "en-US" ? "active" : ""}
              onClick={() => setLanguage("en-US")}
            >
              English
            </button>
          </div>

          <section className="movie-detail-main">
            <div className="movie-detail-poster-wrap">
              <img
                className="movie-detail-poster"
                src={`https://image.tmdb.org/t/p/w500${data.poster_path}`}
              />
            </div>

            <div className="movie-detail-content">
              <div className="movie-detail-top">
                <span className={`detail-age age_${ageBadge}`}>{ageBadge}</span>
                <h1 className="movie-detail-title">{data.title}</h1>
                {data.tagline && (
                  <p className="movie-detail-tagline">{data.tagline}</p>
                )}
              </div>

              <div className="movie-detail-meta">
                <span>평점 {data.vote_average?.toFixed(1) || "-"}</span>
                <span>{data.release_date || "-"}</span>
                <span>{data.runtime ? `${data.runtime}분` : "-"}</span>
              </div>

              <div className="movie-detail-genres">
                {data.genres?.map((genre) => (
                  <span key={genre.id} className="movie-detail-genre">
                    {genre.name}
                  </span>
                ))}
              </div>

              <div className="movie-detail-section">
                <h3>줄거리</h3>
                <p>{data.overview || "줄거리 정보가 없습니다."}</p>
              </div>

              <div className="movie-detail-section">
                <h3>기본 정보</h3>
                <ul className="movie-detail-info-list">
                  <li>
                    <strong>원제</strong>
                    <span>{data.original_title || "-"}</span>
                  </li>
                  <li>
                    <strong>감독</strong>
                    <span>{director?.name || "-"}</span>
                  </li>
                  <li>
                    <strong>국가</strong>
                    <span>
                      {data.production_countries
                        ?.map((v) => v.name)
                        .join(", ") || "-"}
                    </span>
                  </li>
                  <li>
                    <strong>예산</strong>
                    <span>
                      {data.budget ? `$${data.budget.toLocaleString()}` : "-"}
                    </span>
                  </li>
                </ul>
              </div>

              <div className="movie-detail-section">
                <h3>출연진</h3>
                <div className="movie-detail-cast-list">
                  {castList.map((actor) => (
                    <span key={actor.credit_id} className="movie-detail-cast">
                      {actor.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="movie-detail-section">
                <h3>리뷰</h3>

                {isReviewLoading && <p>리뷰 불러오는 중...</p>}

                {isReviewError && <p>리뷰를 불러오지 못했습니다.</p>}

                {!isReviewLoading && !isReviewError && reviews.length === 0 && (
                  <p>등록된 리뷰가 없습니다.</p>
                )}

                {!isReviewLoading && !isReviewError && reviews.length > 0 && (
                  <div className="movie-detail-review-list">
                    {reviews.map((review) => {
                      const isExpanded = !!expandedReviews[review.id];
                      const isLongReview =
                        (review.content?.length || 0) > REVIEW_PREVIEW_LENGTH;

                      const reviewText =
                        isExpanded || !isLongReview
                          ? review.content
                          : `${review.content.slice(0, REVIEW_PREVIEW_LENGTH)}...`;

                      return (
                        <div
                          key={review.id}
                          className="movie-detail-review-item"
                        >
                          <div className="movie-detail-review-top">
                            <strong>{review.author || "익명"}</strong>
                            <span>
                              {review.author_details?.rating
                                ? `★ ${review.author_details.rating}`
                                : "평점 없음"}
                            </span>
                          </div>

                          <p className="movie-detail-review-content">
                            {reviewText}
                          </p>

                          {isLongReview && (
                            <button
                              type="button"
                              className="movie-detail-review-more-btn"
                              onClick={() => toggleReview(review.id)}
                            >
                              {isExpanded ? "접기" : "더보기"}
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="movie-detail-section">
                <button
                  type="button"
                  className="movie-detail-trailer-btn"
                  onClick={handleTrailerClick}
                >
                  예고편 보기
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      {isTrailerOpen && trailer && (
        <div
          className="trailer-modal-overlay"
          onClick={() => setIsTrailerOpen(false)}
        >
          <div className="trailer-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="trailer-modal-close"
              onClick={() => setIsTrailerOpen(false)}
            >
              ✕
            </button>

            <div className="trailer-player-wrap">
              <YouTube
                videoId={trailer.key}
                opts={youtubeOpts}
                className="trailer-player"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetailPage;
