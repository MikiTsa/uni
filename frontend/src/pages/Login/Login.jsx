import { useState, useMemo } from 'react';
import './Login.css';
import NavBar from '../NavBar/NavBar';
import { useNavigate } from 'react-router-dom';

export default function Login() {
     const [form, setForm]       = useState({ email: '', password: '' });
  const [error, setError]     = useState('');
  const [isLoading, setLoading]= useState(false);
  const [menuOpen, setMenuOpen]= useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(o => !o);
  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form)
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
     return (
    <div className="login-wrapper">
      <img src="/feri_by_night.jpg" className="bg-image" alt="Background" />
      <NavBar menuOpen={menuOpen} onMenuToggle={toggleMenu} />
          <hr className="page-separator" />

      <h2 className="login-title">Prijava</h2>

      <main className="login-card">
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Username@student.um.si"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Signing in…' : 'Log in'}
          </button>
          <a href="/register" className="forgot">
            Need an account?
          </a>
        </form>
      </main>
    </div>
  );
}