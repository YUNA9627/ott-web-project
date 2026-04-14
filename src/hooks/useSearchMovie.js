import { useQuery } from "@tanstack/react-query";
import api from "../utils/api";

const fetchSearchMovie = ({ keyword, genre, page }) => {
  // 검색어가 있으면 검색
  if (keyword) {
    return api.get(
      `/search/movie?query=${encodeURIComponent(keyword)}&page=${page}`
    );
  }

  // 검색어 없고 장르 있으면 장르 필터
  if (genre) {
    return api.get(`/discover/movie?with_genres=${genre}&page=${page}`);
  }

  // 둘 다 없으면 인기 영화
  return api.get(`/movie/popular?page=${page}`);
};

export const useSearchMovieQuery = ({ keyword, genre, page }) => {
  return useQuery({
    queryKey: ["movie-search", keyword, genre, page],
    queryFn: () => fetchSearchMovie({ keyword, genre, page }),
    select: (result) => result.data,
  });
};
