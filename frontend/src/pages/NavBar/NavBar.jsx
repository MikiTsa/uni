import { Link, useNavigate } from 'react-router-dom';
import './NavBar.css';
import { PREDMETI } from '../Predmeti/data';
import { useTheme } from '../../ThemeContext';
import { useEffect, useState } from 'react';

export default function NavBar({ menuOpen, onMenuToggle }) {
  const { theme, toggleTheme } = useTheme();

  const [programs, setPrograms] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    fetch('/api/program')
      .then((res) => res.json())
      .then((data) => setPrograms(data))
      .catch((err) => console.error('Failed to fetch subjects', err));
  }, []);

  useEffect(() => {
    fetch('/api/users/me', { credentials: 'include' })
      .then(res => {
        if (res.ok) setIsLoggedIn(true);
      })
      .catch(() => setIsLoggedIn(false));
  }, []);

  // handler for the person icon
  const goProfileOrLogin = () => {
    navigate(isLoggedIn ? '/profile' : '/login');
  };

  return (
    <>
      <header className="header">
        <Link to="/" className="logo">
          {theme === 'dark' ? (
            <img src="/LOGOFERINOTES_white.png" alt="FERI Notes" className="logo-image" />
          ) : (
            <img src="/LOGOFERINOTES_black.png" alt="FERI Notes" className="logo-image" />
          )}
        </Link>
        <div className="header-icons">
          <button >
            <span className="material-icons">{ }</span>
          </button>
          <button onClick={toggleTheme}>
            <span className="material-icons">{theme === 'dark' ? 'dark_mode' : 'light_mode'}</span>
          </button>
          <Link to="/" className="icon-link">
            <span className="material-icons">home</span>
          </Link>
          <button
            className="icon-link"
            onClick={goProfileOrLogin}
            aria-label={isLoggedIn ? 'Go to profile' : 'Log in'}
          >
            <span className="material-icons">person</span>
          </button>
          <button
            className="menu-toggle"
            onClick={onMenuToggle}
            aria-label="Toggle menu"
          >
            <span className="material-icons">menu</span>
          </button>
        </div>
      </header>

      {menuOpen && <div className="overlay" onClick={onMenuToggle} />}

      <aside className={`side-menu ${menuOpen ? 'open' : ''}`}>
        <div className="menu-header">
          <div className="logo">
            {theme === 'dark' ? (
            <img src="/LOGOFERINOTES_white.png" alt="FERI Notes" className="logo-image" />
          ) : (
            <img src="/LOGOFERINOTES_black.png" alt="FERI Notes" className="logo-image" />
          )}
          </div>
          <button onClick={onMenuToggle} aria-label="Close menu">
            <span className="material-icons">&#10095;</span>
          </button>
        </div>
        <ul>
          {programs.map((p) => (
            <Link
              key={p.id}
              to={`/predmeti/${p.id}`}
              onClick={onMenuToggle}
              style={{ textDecoration: 'none' }}
            >
              <li className="menu-item">{p.name}</li>
            </Link>
          ))}
        </ul>

      </aside>
    </>
  );
}