import React, {useEffect, useState} from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { PREDMETI } from './data';
import './Semester.css'
import '../Predmeti/PredmetiPage.css';
import NavBar from '../NavBar/NavBar';

export default function SemesterPage() {

    const { predmetiId, stopnjaId, letnikId } = useParams();
    //const predmet = PREDMETI.find(p => p.id === predmetiId);
    //const stopnja = predmet?.levels.find(level => level.level === stopnjaId);
    //const letnik = stopnja?.years.find(y => y.year === parseInt(letnikId));
    const [menuOpen, setMenuOpen] = useState(false);
    const toggleMenu = () => setMenuOpen(o => !o);

    const [predmet, setPredmet] = useState([]);
    useEffect(() => {
      fetch(`/api/program/${predmetiId}`)
        .then(res => res.json())
        .then(data => setPredmet(data))
        .catch(console.error);
    }, [predmetiId]);

    const [subjects1, setSubjects1] = useState([]);
    const [subjects2, setSubjects2] = useState([]);
    useEffect(() => {
      fetch(`/api/subjects/program/${predmetiId}/level/${stopnjaId}/semester/${(letnikId-1)*2+1}`)
        .then(res => res.json())
        .then(data => setSubjects1(data))
        .catch(console.error);
    }, []);
    useEffect(() => {
      fetch(`/api/subjects/program/${predmetiId}/level/${stopnjaId}/semester/${(letnikId-1)*2+2}`)
        .then(res => res.json())
        .then(data => setSubjects2(data))
        .catch(console.error);
    }, []);

    if (!predmet) {
      return <Navigate to="/predmeti" replace />;
    }
    const semesters = [
      { semester: 1, subjects: subjects1 },
      { semester: 2, subjects: subjects2 }
    ];

    const noSubjects = subjects1.length === 0 && subjects2.length === 0;
    return (
        <div className="predmeti-page-container">
          <NavBar menuOpen={menuOpen} onMenuToggle={toggleMenu} />
          <hr className="page-separator" />

          <div className="predmeti-header">
            <img
              src={predmet.logo || '/feri.png'}
              alt={predmet.title}
              className="predmeti-logo"
            />
            <div className="predmeti-title">{predmet.title}</div>
          </div>
    
        <div className="semesters-wrapper">
          {!noSubjects ? (
            <div className="semesters-grid">
            {semesters.map((item, index) => (
              <div className="semester-column" key={index}>
                <h2 className="semester-name">{toRoman(item.semester)}. semester</h2>
                {item.subjects.map((subject) => (
                  <Link
                    key={subject.id}
                    to={`/predmeti/${predmetiId}/${stopnjaId}/${letnikId}/${item.semester}/${subject.id}`}
                  >
                    <button>{subject.name}</button>
                  </Link>
                ))}
              </div>
            ))}
          </div>
          ) : (
            <p className="no-subjects-message">
              Predmeti niso bili najdeni ker jih verjetno ni v bazi
            </p>
          )}
          </div>
        </div>
        
      );
    }

    function toRoman(num) {
        const roman = ['I', 'II'];
        return roman[num - 1] || num;
      }