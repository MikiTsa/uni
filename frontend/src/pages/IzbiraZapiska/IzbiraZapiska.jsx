import React, {useState, useEffect} from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { PREDMETI } from '../Semester/data';
import './IzbiraZapiska.css'
import '../Predmeti/PredmetiPage.css';
import NavBar from '../NavBar/NavBar';

export default function IzbiraZapiskaPage() {

    const { predmetiId, stopnjaId, letnikId,semesterId, predmetId } = useParams();
    //const smer = PREDMETI.find(p => p.id === predmetiId);
    //const stopnja = smer?.levels.find(level => level.level === stopnjaId);
    //const letnik = stopnja?.years.find(y => y.year === parseInt(letnikId));
    //const semester = letnik?.semesters.find(s => s.semester === parseInt(semesterId));
    //const predmet = semester?.subjects.find(sub => sub === predmetId);
    const [menuOpen, setMenuOpen] = useState(false);
    const toggleMenu = () => setMenuOpen(o => !o);

    const [smer, setSmer] = useState([]);
    useEffect(() => {
      fetch(`/api/program/${predmetiId}`)
        .then(res => res.json())
        .then(data => setSmer(data))
        .catch(console.error);
    }, [predmetiId]);

    const [predmet, setPredmet] = useState([]);
    useEffect(() => {
      fetch(`/api/subjects/${predmetId}`)
        .then(res => res.json())
        .then(data => setPredmet(data))
        .catch(console.error);
    }, [predmetId]);

    if (!smer) {
      return <Navigate to="/predmeti" replace />;
    }
    return (
        <div className="predmeti-page-container">
          <NavBar menuOpen={menuOpen} onMenuToggle={toggleMenu} />
          <hr className="page-separator" />
        <div className="subjects-wrapper">
            <div className='subject-column'>
            <h2 className='subject-name'>{predmet.name}</h2>
                <Link to={`/predmeti/${predmetiId}/${stopnjaId}/${letnikId}/${semesterId}/${predmetId}/1`}>
                <button>ZAPISKI</button>
                </Link>
                <Link to={`/predmeti/${predmetiId}/${stopnjaId}/${letnikId}/${semesterId}/${predmetId}/2`}>
                <button>VAJE</button>
                </Link>
                <Link to={`/predmeti/${predmetiId}/${stopnjaId}/${letnikId}/${semesterId}/${predmetId}/3`}>
                <button>IZPITI / KOLOKVIJI</button>
                </Link>
            </div>
        </div>

        </div>
        
      );
    }