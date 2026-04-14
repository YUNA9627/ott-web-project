import { useQuery } from "@tanstack/react-query";
import api from "../utils/api";

// 영화 검색/필터 데이터를 가져오는 함수
const fetchSearchMovie = async ({ keyword, genre, page }) => {
  // 1) 검색어와 장르가 둘 다 있는 경우
  // search/movie는 장르 필터를 직접 지원하지 않아서
  // 검색 결과 여러 페이지를 가져온 뒤 프론트에서 장르 필터링
  if (keyword && genre) {
    // 먼저 1페이지를 호출해서 전체 페이지 수 확인
    const firstRes = await api.get(
      `/search/movie?query=${encodeURIComponent(keyword)}&page=1`
    );

    const totalPages = Math.min(firstRes.data.total_pages, 20);

    const requests = [];

    // 1페이지부터 totalPages까지 검색 결과 요청 배열 만들기
    for (let i = 1; i <= totalPages; i++) {
      requests.push(
        api.get(`/search/movie?query=${encodeURIComponent(keyword)}&page=${i}`)
      );
    }

    // 여러 페이지 요청을 동시에 실행
    const responses = await Promise.all(requests);

    // 각 페이지의 results를 하나의 배열로 합치기
    const allResults = responses.flatMap((res) => res.data.results);

    // 합쳐진 검색 결과 중에서
    // 선택한 장르를 포함하는 영화만 필터링
    const filteredResults = allResults.filter((movie) =>
      movie.genre_ids.includes(Number(genre))
    );

    // 프론트에서 직접 페이지네이션 처리
    // 한 페이지에 20개씩 보여주기
    const pageSize = 20;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    // 현재 페이지에 맞는 결과만 잘라서 반환
    return {
      results: filteredResults.slice(start, end),
      total_results: filteredResults.length,
      total_pages: Math.ceil(filteredResults.length / pageSize),
    };
  }

  // 2) 검색어만 있는 경우
  // TMDB search/movie API 사용
  if (keyword) {
    const res = await api.get(
      `/search/movie?query=${encodeURIComponent(keyword)}&page=${page}`
    );
    return res.data;
  }

  // 3) 장르만 있는 경우
  // TMDB discover/movie API로 장르 필터링
  if (genre) {
    const res = await api.get(
      `/discover/movie?with_genres=${genre}&page=${page}`
    );
    return res.data;
  }

  // 4) 검색어도 장르도 없으면
  // 인기 영화 목록 가져오기
  const res = await api.get(`/movie/popular?page=${page}`);
  return res.data;
};

// React Query 훅
export const useSearchMovieQuery = ({ keyword, genre, page }) => {
  return useQuery({
    // keyword, genre, page 값이 바뀔 때마다 다시 요청하도록 설정
    queryKey: ["movie-search", keyword, genre, page],

    // 실제 데이터를 가져오는 함수
    queryFn: () => fetchSearchMovie({ keyword, genre, page }),
  });
};