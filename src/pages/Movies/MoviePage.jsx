import React, { useEffect, useRef, useState } from "react";
import { useOutletContext, useSearchParams } from "react-router-dom";
import ReactPaginateModule from "react-paginate";
import { Alert } from "react-bootstrap";
import { useSearchMovieQuery } from "../../hooks/useSearchMovie";
import MovieCard from "../../common/MovieCard/MovieCard.jsx";
import "./MoviePage.style.css";

const ReactPaginate = ReactPaginateModule.default ?? ReactPaginateModule;

// 경로 2가지
// - navBar에서 클릭하면서 온 경우 => popularMovie 보여주기
// - keyWord를 입력해서 온 경우 => keyword와 관련된 영화들을 보여줌

// 페이지네이션 설치
// page state 만들기
// 페이지네이션 클릭할 때마다 page 바꿔주기
// page 값이 바뀔 때 마다 useSearchMovie에 page까지 넣어서 fetch
const MoviePage = () => {
  const [query, setQuery] = useSearchParams();
  const [page, setPage] = useState(1);

  const { showGlobalAlert } = useOutletContext();
  const noResultHandledRef = useRef("");

  const keyword = query.get("q");
  const genre = query.get("genre") || "";
  const hasGenreSelected = !!query.get("genre");

  const { data, isLoading, isError, error } = useSearchMovieQuery({
    keyword,
    genre,
    page,
  });

  if (isError) {
    return <Alert variant="danger">{error.message}</Alert>;
  }

  const updateFilter = (key, value) => {
    const nextQuery = new URLSearchParams(query);

    if (value) {
      nextQuery.set(key, value);
    } else {
      nextQuery.delete(key);
    }

    setQuery(nextQuery);
    setPage(1);
  };

  const genreList = [
    { label: "전체", value: "" },
    { label: "액션", value: "28" },
    { label: "모험", value: "12" },
    { label: "애니메이션", value: "16" },
    { label: "코미디", value: "35" },
    { label: "범죄", value: "80" },
    { label: "다큐멘터리", value: "99" },
    { label: "드라마", value: "18" },
    { label: "가족", value: "10751" },
    { label: "판타지", value: "14" },
    { label: "역사", value: "36" },
    { label: "공포", value: "27" },
    { label: "음악", value: "10402" },
    { label: "미스터리", value: "9648" },
    { label: "로맨스", value: "10749" },
    { label: "SF", value: "878" },
    { label: "TV 영화", value: "10770" },
    { label: "스릴러", value: "53" },
    { label: "전쟁", value: "10752" },
    { label: "서부", value: "37" },
  ];

  const hasNoResults =
    !!keyword && !isLoading && !isError && (data?.results?.length ?? 0) === 0;

  useEffect(() => {
    if (!hasNoResults || !keyword) return;

    const handledKey = `${keyword}-${genre}`;
    if (noResultHandledRef.current === handledKey) return;
    noResultHandledRef.current = handledKey;

    const nextQuery = new URLSearchParams(query);
    nextQuery.delete("q");

    const timer = setTimeout(() => {
      showGlobalAlert(`"${keyword}" 검색 결과가 없습니다.`);
      setQuery(nextQuery, { replace: true });
      setPage(1);
    }, 0);

    return () => clearTimeout(timer);
  }, [hasNoResults, keyword, genre, query, setQuery, showGlobalAlert]);

  const selectedGenreLabel = hasGenreSelected
    ? genreList.find((item) => item.value === genre)?.label || ""
    : "";

  const titleText =
    keyword && selectedGenreLabel
      ? `[${selectedGenreLabel}] 장르의 "${keyword}" 검색 결과`
      : keyword
        ? `"${keyword}" 검색 결과`
        : selectedGenreLabel
          ? `${selectedGenreLabel} 장르 영화`
          : "전체 영화";

  const handlePageClick = ({ selected }) => {
    setPage(selected + 1);
  };

  if (isLoading) {
    return <h1>Loading..</h1>;
  }

  if (isError) {
    return <Alert variant="danger">{error.message}</Alert>;
  }

  return (
    <div className="movie-page">
      <div className="movie-page-inner">
        <div className="movie-page-top">
          <div>
            <h2 className="movie-page-title">{titleText}</h2>
          </div>
        </div>

        <div className="movie-page-layout">
          <aside className="movie-filter">
            <h3 className="filter-title">장르</h3>

            <div className="filter-group">
              <div className="genre-button-list">
                {genreList.map((item) => (
                  <button
                    key={item.value || "all"}
                    type="button"
                    className={`genre-button ${
                      hasGenreSelected && genre === item.value ? "active" : ""
                    }`}
                    onClick={() => updateFilter("genre", item.value)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <section className="movie-content">
            <div className="movie-grid">
              {data?.results?.map((movie) => (
                <div key={movie.id} className="movie-grid-item">
                  <MovieCard movie={movie} />
                </div>
              ))}
            </div>
          </section>
        </div>
        <div className="pagination-wrap">
          <ReactPaginate
            nextLabel="›"
            onPageChange={handlePageClick}
            pageRangeDisplayed={3}
            marginPagesDisplayed={2}
            pageCount={data?.total_pages}
            previousLabel="‹"
            pageClassName="wt-page-item"
            pageLinkClassName="wt-page-link"
            previousClassName="wt-page-item"
            previousLinkClassName="wt-page-link"
            nextClassName="wt-page-item"
            nextLinkClassName="wt-page-link"
            breakLabel="..."
            breakClassName="wt-page-item"
            breakLinkClassName="wt-page-link"
            containerClassName="wt-pagination"
            activeClassName="active"
            renderOnZeroPageCount={null}
            forcePage={page - 1}
          />
        </div>
      </div>
    </div>
  );
};

export default MoviePage;
