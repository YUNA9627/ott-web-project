import { useQuery } from "@tanstack/react-query";
import api from "../utils/api";

const fetchMovieVideos = async (movieId, language) => {
  const response = await api.get(`/movie/${movieId}/videos`, {
    params: {
      language,
    },
  });

  return response.data;
};

export const useMovieVideosQuery = (movieId, language) => {
  return useQuery({
    queryKey: ["movie-videos", movieId, language],
    queryFn: () => fetchMovieVideos(movieId, language),
    enabled: !!movieId,
    staleTime: 1000 * 60 * 10,
  });
};