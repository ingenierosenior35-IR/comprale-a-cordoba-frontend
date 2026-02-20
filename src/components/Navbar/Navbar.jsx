import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CartIcon from './CartIcon';
import MenuDropdown from './MenuDropdown';
import './Navbar.css';

function Navbar({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchQuery);
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar__logo" onClick={handleLogoClick} role="button" tabIndex={0}>
        <span className="navbar__logo-text">inter</span>
        <span className="navbar__logo-accent">rapidísimo</span>
      </div>

      <form className="navbar__search" onSubmit={handleSearchSubmit}>
        <input
          type="text"
          className="navbar__search-input"
          placeholder="Buscar productos o negocios..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Buscar productos"
        />
        <button type="submit" className="navbar__search-btn" aria-label="Buscar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </button>
      </form>

      <div className="navbar__actions">
        <MenuDropdown />
        <CartIcon />
      </div>
    </nav>
  );
}

export default Navbar;
