import { useQuery } from "@tanstack/react-query";
import api from "../utils/api";

const fetchMovieDetail = async (movieId, language) => {
  const response = await api.get(`/movie/${movieId}`, {
    params: {
      language,
      append_to_response: "videos,credits,release_dates",
    },
  });

  return response.data;
};

export const useMovieDetailQuery = (movieId, language) => {
  return useQuery({
    queryKey: ["movie-detail", movieId, language],
    queryFn: () => fetchMovieDetail(movieId, language),
    enabled: !!movieId,
    staleTime: 1000 * 60 * 10,
  });
};