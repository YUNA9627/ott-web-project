import { Alert, Container } from "react-bootstrap";
import logo from "../assets/logo.svg";
import "./AppLayout.style.css";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

const menuList = [
  { label: "전체", path: "/" },
  { label: "영화", path: "/movies" },
];

const AppLayout = () => {
  const navigate = useNavigate();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [globalAlert, setGlobalAlert] = useState("");

  const inputRef = useRef(null);

  useEffect(() => {
    if (searchOpen) {
      inputRef.current?.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    if (!globalAlert) return;

    const timer = setTimeout(() => {
      setGlobalAlert("");
    }, 2500);

    return () => clearTimeout(timer);
  }, [globalAlert]);

  const showGlobalAlert = (message) => {
    setGlobalAlert(message);
  };

  const handleOpenSearch = () => {
    setSearchOpen(true);
  };

  const handleCloseSearch = () => {
    setSearchOpen(false);
    setSearchQuery("");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    if (!searchOpen) {
      setSearchOpen(true);
      return;
    }

    const trimQuery = searchQuery.trim();

    navigate(`/movies?q=${encodeURIComponent(trimQuery)}`);
    setSearchQuery("");
  };

  const handleSearchButtonClick = () => {
    if (!searchOpen) {
      handleOpenSearch();
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Escape") {
      handleCloseSearch();
    }
  };
  return (
    <div className="layout">
      <header className="header">
        <Container fluid className="header-inner">
          <div className="left">
            <Link to="/" className="logo">
              <img src={logo} width={100} alt="OTT 로고" className="logo-img" />
            </Link>

            <nav className="nav">
              {menuList.map((menu) => (
                <NavLink
                  key={menu.path}
                  to={menu.path}
                  end={menu.path === "/"}
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                >
                  {menu.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="right">
            <form className="search-box" onSubmit={handleSearchSubmit}>
              <div className={`search-pill ${searchOpen ? "open" : ""}`}>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="제목, 장르, 인물 검색"
                  className="search-input"
                  value={searchQuery}
                  onKeyDown={handleSearchKeyDown}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type={searchOpen ? "submit" : "button"}
                  className="search-btn"
                  onClick={handleSearchButtonClick}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fill="currentColor"
                      fillRule="evenodd"
                      d="M11.17 4.8a6.37 6.37 0 1 1 0 12.74 6.37 6.37 0 0 1 0-12.74m0-1.8a8.17 8.17 0 0 1 6.45 13.18L22 20.56 20.56 22l-4.38-4.38a8.17 8.17 0 1 1-5-14.62"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </form>

            <button type="button" className="login-btn">
              로그인
            </button>
          </div>
        </Container>
      </header>
      {globalAlert && (
        <div className="global-alert-wrap">
          <Container fluid>
            <Alert variant="danger" className="global-alert">
              {globalAlert}
            </Alert>
          </Container>
        </div>
      )}

      <main>
        <Outlet context={{ showGlobalAlert }} />
      </main>
    </div>
  );
};

export default AppLayout;
