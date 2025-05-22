import { useState } from 'react';
import './Profile.css';
import NavBar from '../NavBar/NavBar';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(open => !open);
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      await fetch('/api/users/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      navigate("/");
    }
  };
  

  const handleDocumentsClick = () => {
    navigate('/mydocs');
  };

  return (
    <div className="profile-wrapper">
      <NavBar menuOpen={menuOpen} onMenuToggle={toggleMenu} />
          <hr className="page-separator" />

      <div className="profile-container">
        <h1 className="profile-title">MOJE AKTIVNOSTI</h1>
        
        <div className="profile-section">
          <div 
            className="document-link"
            onClick={handleDocumentsClick}
          >
            Moji dokumenti →
          </div>
        </div>

        <button 
          className="logout-button"
          onClick={handleLogout}
        >
          ODJAVA
        </button>
      </div>
    </div>
  );
}