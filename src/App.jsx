import { Route, Routes } from "react-router-dom";
import "./App.css";
import Applayout from "./layout/Applayout";
import Homepage from "./pages/Homepage/Homepage";
import MoviePage from "./pages/Movies/MoviePage";
import MovieDetailPage from "./pages/MovieDetail/MovieDetailPage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";

// 홈페이지 /
// 영화 전체 보여주는 페이지 (서치) /movies
// 영화 디테일 페이지 /movies/:id
// 추천영화 /movies/:id/recommandation
// 리뷰 /movies/:id/reviews
function App() {
  return (
    <Routes>
      <Route path="/" element={<Applayout />}>  // user화면
        <Route index element={<Homepage/>}/>
        <Route path="movies">
          <Route index element={<MoviePage/>}/>
          <Route path=":id" element={<MovieDetailPage/>}/>
        </Route>
        {/* <Route path="/movies" element={<MoviePage/>}/>
        <Route path="/movies/:id" element={<MovieDetailPage/>}/> */}
      </Route>
      <Route path="*" element={<NotFoundPage/>}/>
    </Routes>
  );
}

export default App;
