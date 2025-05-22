import React, {useEffect, useState} from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { PREDMETI } from './data';
import './PredmetiPage.css';
import NavBar from '../NavBar/NavBar';

export default function PredmetiPage() {

    const { predmetiId } = useParams();
    //const predmet = PREDMETI.find(p => p.id === predmetiId);
    const [menuOpen, setMenuOpen] = useState(false);
    const toggleMenu = () => setMenuOpen(o => !o);
    const [predmet, setPredmet] = useState([]);
    useEffect(() => {
      fetch(`/api/program/${predmetiId}`)
        .then(res => res.json())
        .then(data => setPredmet(data))
        .catch(console.error);
    }, [predmetiId]);
    return (
        <div className="predmeti-page-container">
          <NavBar menuOpen={menuOpen} onMenuToggle={toggleMenu} />
          <hr className="page-separator" />

          <div className="predmeti-header">
            <img
              src={predmet.logo || '/feri.png'}
              alt={predmet.name}
              className="predmeti-logo"
            />
            <div className="predmeti-title">{predmet.name}</div>
          </div>
    
        <div className="levels-wrapper">
          <div className="levels-grid">
            <div className="level-column">
              <p className="level-stage">Prva stopnja</p>
              <h2 className="level-name">DODIPLOMSKI</h2>
              {[1, 2, 3].map((year) => (
                <Link
                  key={year}
                  to={`/predmeti/${predmet.id}/dodiplomski/${year}`}
                >
                  <button>{year}. letnik</button>
                </Link>
              ))}
            </div>
            <div className="level-column">
              <p className="level-stage">Druga stopnja</p>
              <h2 className="level-name">MAGISTERSKI</h2>
              {[1, 2].map((year) => (
                <Link
                  key={year}
                  to={`/predmeti/${predmet.id}/magisterski/${year}`}
                >
                  <button>{year}. letnik</button>
                </Link>
              ))}
            </div>
            <div className="level-column">
              <p className="level-stage">Tretja stopnja</p>
              <h2 className="level-name">DOKTORSKI</h2>
              {[1, 2].map((year) => (
                <Link
                  key={year}
                  to={`/predmeti/${predmet.id}/doktorski/${year}`}
                >
                  <button>{year}. letnik</button>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="predmeti-footer">
        <p>📚 Na voljo so dodatni zapiski, projekti in gradiva za posamezni letnik.</p>
        <p>Za več informacij se obrnite na svojega profesorja ali tutorja.</p>
      </div>

        </div>
        
      );
    }