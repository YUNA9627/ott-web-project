import { useQuery } from "@tanstack/react-query";
import api from "../utils/api";

const fetchMovieDetail = async (movieId) => {
  const response = await api.get(`/movie/${movieId}`, {
    params: {
      // language: "ko-KR",
      language: "US",
      append_to_response: "videos,credits,release_dates",
    },
  });

  return response.data;
};

export const useMovieDetailQuery = (movieId) => {
  return useQuery({
    queryKey: ["movie-detail", movieId],
    queryFn: () => fetchMovieDetail(movieId),
    enabled: !!movieId,
    staleTime: 1000 * 60 * 10,
  });
};