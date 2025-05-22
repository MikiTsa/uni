import { Routes, Route } from 'react-router-dom';
import Home  from './pages/Home/Home';
import Login    from './pages/Login/Login';
import Register from './pages/Register/Register';
import PredmetiPage   from './pages/Predmeti/PredmetiPage';
import SemesterPage from './pages/Semester/Semester';
import Profile from './pages/Profile/Profile';
import MyDocs from './pages/MyDocs/MyDocs';
import IzibraZapiskaPage from './pages/IzbiraZapiska/IzbiraZapiska';
import FileListPage from './pages/FileList/FileList.jsx';

export default function Routing() {
    return (
      <Routes>
        <Route path="/"        element={<Home />} />
        <Route path="/login"   element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/mydocs" element={<MyDocs />} />
        <Route path="predmeti/:predmetiId" element={<PredmetiPage />} />
        <Route path="predmeti/:predmetiId/:stopnjaId/:letnikId" element={<SemesterPage /> } />
        <Route path="predmeti/:predmetiId/:stopnjaId/:letnikId/:semesterId/:predmetId" element={<IzibraZapiskaPage/>} />
        <Route path="predmeti/:predmetiId/:stopnjaId/:letnikId/:semesterId/:predmetId/:vrstaId" element={<FileListPage/>} />

      </Routes>
    );
  }