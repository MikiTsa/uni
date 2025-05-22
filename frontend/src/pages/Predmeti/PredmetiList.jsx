import React from 'react';
import { Link } from 'react-router-dom';
import { PREDMETI } from './data';
import './PredmetiList.css';

export default function PredmetiList() {
  return (
    <div className="predmeti-list">
      <h1>Seznam predmetov</h1>
      <ul>
        {PREDMETI.map((p) => (
          <li key={p.id}>
            <Link to={`/predmeti/${p.id}`}>{p.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
