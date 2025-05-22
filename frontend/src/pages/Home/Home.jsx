import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import NavBar from '../NavBar/NavBar';

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const toggleMenu = () => setMenuOpen(open => !open);

  // Debounced search effect
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchQuery.trim()) {
        fetch(`/api/files?name=${encodeURIComponent(searchQuery)}`)
          .then(res => res.json())
          .then(data => {
            setSearchResults(data);
            setShowDropdown(true);
          })
          .catch(err => {
            console.error('Search failed:', err);
            setSearchResults([]);
            setShowDropdown(false);
          });
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    }, 300); // debounce timeout

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const mapTagToId = (tagName) => {
    switch (tagName?.toLowerCase()) {
      case 'zapiski': return 1;
      case 'vaje': return 2;
      case 'izpiti in kolokviji': return 3;
      default: return null;
    }
  };

  const goToFile = (file) => {
    const programId = file.subject?.year?.program?.id;
    const degreeLevel = file.subject?.year?.degreeLevel;
    const year = file.subject?.year?.year;
    const semester = file.subject?.year?.semester;
    const subjectId = file.subject?.id;
    const tag = mapTagToId(file.tag?.name);

    if (!programId || !degreeLevel || !year || !semester || !subjectId || !tag) {
      console.warn('Missing navigation fields:', {
        programId, degreeLevel, year, semester, subjectId, tag
      });
      alert('Manjkajo podatki za navigacijo.');
      return;
    }

    navigate(`/predmeti/${programId}/${degreeLevel}/${year}/${semester}/${subjectId}/${tag}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (searchResults.length > 0) {
        goToFile(searchResults[0]);
      } else {
        alert('Ni rezultatov za iskani naziv.');
      }
    }
  };

  return (
    <div className="container">
      <img src="/feri_by_night.jpg" className="bg-image" alt="Background" />
      <NavBar menuOpen={menuOpen} onMenuToggle={toggleMenu} />

      <div className="main">
        <div className="hero">
          <h1>Vsi zapiski, ki jih potrebuješ na enem mestu</h1>
          <div className="search-wrapper">
            <span className="material-icons search-icon">search</span>
            <input
              type="text"
              className="search"
              placeholder="Išči po imenu dokumenta..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
            />
            {showDropdown && (
              <div className="search-dropdown">
                {searchResults.map((file, index) => (
                  <div
                    key={index}
                    className="search-option"
                    onClick={() => {
                      setShowDropdown(false);
                      goToFile(file);
                    }}
                  >
                    {file.name} – {file.subject?.year?.program?.name || 'Program'}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
