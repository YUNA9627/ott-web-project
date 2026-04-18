import { useQuery } from "@tanstack/react-query";
import api from "../utils/api";

// 검색 결과 여러 페이지 가져오기
const fetchAllSearchResults = async (keyword) => {
  const firstRes = await api.get("/search/movie", {
    params: {
      query: keyword,
      page: 1,
    },
  });

  const totalPages = Math.min(firstRes.data.total_pages, 20);

  const requests = [];
  for (let i = 1; i <= totalPages; i++) {
    requests.push(
      api.get("/search/movie", {
        params: {
          query: keyword,
          page: i,
        },
      })
    );
  }

  const responses = await Promise.all(requests);
  return responses.flatMap((res) => res.data.results);
};

// 프론트 정렬 함수
const sortMovies = (movies, sortBy) => {
  if (!sortBy) return movies;

  const sorted = [...movies];

  switch (sortBy) {
    case "popularity.desc":
      return sorted.sort((a, b) => b.popularity - a.popularity);

    case "popularity.asc":
      return sorted.sort((a, b) => a.popularity - b.popularity);

    case "primary_release_date.desc":
      return sorted.sort(
        (a, b) =>
          new Date(b.release_date || "1900-01-01") -
          new Date(a.release_date || "1900-01-01")
      );

    case "primary_release_date.asc":
      return sorted.sort(
        (a, b) =>
          new Date(a.release_date || "1900-01-01") -
          new Date(b.release_date || "1900-01-01")
      );

    case "vote_average.desc":
      return sorted.sort((a, b) => b.vote_average - a.vote_average);

    case "vote_average.asc":
      return sorted.sort((a, b) => a.vote_average - b.vote_average);

    case "title.asc":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));

    case "title.desc":
      return sorted.sort((a, b) => b.title.localeCompare(a.title));

    default:
      return movies;
  }
};

// 프론트 페이지네이션
const paginateMovies = (movies, page, pageSize = 20) => {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  return {
    results: movies.slice(start, end),
    total_results: movies.length,
    total_pages: Math.ceil(movies.length / pageSize),
    page,
  };
};

// 영화 검색/필터 데이터 가져오기
const fetchSearchMovie = async ({ keyword, genre, sortBy, page }) => {
  // 1) 검색어 + 장르 + 정렬
  if (keyword && genre && sortBy) {
    const allResults = await fetchAllSearchResults(keyword);

    const filteredResults = allResults.filter((movie) =>
      movie.genre_ids.includes(Number(genre))
    );

    const sortedResults = sortMovies(filteredResults, sortBy);

    return paginateMovies(sortedResults, page);
  }

  // 2) 정렬만 있는 경우
  if (!keyword && !genre && sortBy) {
    const res = await api.get("/discover/movie", {
      params: {
        sort_by: sortBy,
        page,
      },
    });
    return res.data;
  }

  // 3) 검색어 + 정렬
  if (keyword && !genre && sortBy) {
    const allResults = await fetchAllSearchResults(keyword);
    const sortedResults = sortMovies(allResults, sortBy);

    return paginateMovies(sortedResults, page);
  }

  // 4) 장르 + 정렬
  if (!keyword && genre && sortBy) {
    const res = await api.get("/discover/movie", {
      params: {
        with_genres: genre,
        sort_by: sortBy,
        page,
      },
    });
    return res.data;
  }

  // 5) 검색어 + 장르
  if (keyword && genre) {
    const allResults = await fetchAllSearchResults(keyword);

    const filteredResults = allResults.filter((movie) =>
      movie.genre_ids.includes(Number(genre))
    );

    return paginateMovies(filteredResults, page);
  }

  // 6) 검색어만 있는 경우
  if (keyword) {
    const res = await api.get("/search/movie", {
      params: {
        query: keyword,
        page,
      },
    });
    return res.data;
  }

  // 7) 장르만 있는 경우
  if (genre) {
    const res = await api.get("/discover/movie", {
      params: {
        with_genres: genre,
        page,
      },
    });
    return res.data;
  }

  // 8) 아무 조건도 없으면 인기 영화
  const res = await api.get("/movie/popular", {
    params: {
      page,
    },
  });
  return res.data;
};

// React Query 훅
export const useSearchMovieQuery = ({ keyword, genre, sortBy, page }) => {
  return useQuery({
    queryKey: ["movie-search", keyword, genre, sortBy, page],
    queryFn: () => fetchSearchMovie({ keyword, genre, sortBy, page }),
  });
};