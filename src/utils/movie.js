export const getUsCertification = (movieDetail) => {
  if (!movieDetail?.release_dates?.results) return "";

  const usData = movieDetail.release_dates.results.find(
    (item) => item.iso_3166_1 === "US",
  );

  if (!usData?.release_dates?.length) return "";

  const certificationItem = usData.release_dates.find(
    (item) => item.certification && item.certification.trim() !== "",
  );

  return certificationItem?.certification || "";
};

export const convertAgeBadge = (certification) => {
  switch (certification) {
    case "G":
    case "PG":
      return "ALL";
    case "PG-13":
      return "12";
    case "R":
      return "15";
    case "NC-17":
      return "19";
    default:
      return "ALL";
  }
};