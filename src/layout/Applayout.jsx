import { Container } from "react-bootstrap";
import { Link, NavLink, Outlet } from "react-router-dom";
import logo from "../assets/logo.svg";
import "./AppLayout.style.css";

const menuList = [
  { label: "전체", path: "/" },
  { label: "영화", path: "/movies" },
];

const AppLayout = () => {
  return (
    <div className="layout">
      <header className="header">
        <Container fluid className="header-inner">
          <div className="left">
            <Link to="/" className="logo">
              <img
                src={logo}
                width={100}
                alt="OTT 로고"
                className="logo-img"
              />
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
            <div className="search-box">
              <input
                type="text"
                placeholder="검색"
                className="search-input"
              />
              <button type="button" className="search-btn">
                검색
              </button>
            </div>

            <button type="button" className="login-btn">
              로그인
            </button>
          </div>
        </Container>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;