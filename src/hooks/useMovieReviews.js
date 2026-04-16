import { useQuery } from "@tanstack/react-query";
import api from "../utils/api";

const fetchMovieReviews = async (movieId, language, page = 1) => {
  const response = await api.get(`/movie/${movieId}/reviews`, {
    params: {
      language,
      page,
    },
  });

  return response.data;
};

export const useMovieReviewsQuery = (movieId, language, page = 1) => {
  return useQuery({
    queryKey: ["movie-reviews", movieId, language, page],
    queryFn: () => fetchMovieReviews(movieId, language, page),
    enabled: !!movieId,
    staleTime: 1000 * 60 * 5,
  });
};