import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import NavBar from '../NavBar/NavBar';

export default function Register() {
      const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError]       = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(open => !open);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (!formData.email.endsWith('@student.um.si')) {
      setError('Only @student.um.si emails allowed');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    if (!/[A-Z]/.test(formData.password) || !/\d/.test(formData.password)) {
      setError('Password must contain at least one uppercase letter and one number');
      return false;
    }
    return true;
  };

  // ← Make this async so we can use await inside
  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setIsLoading(true);

      try {
    const response = await fetch('/api/users/REGISTER', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(formData),
    });

    // only parse JSON if present
    let data = {};
    const ct = response.headers.get('Content-Type') || '';
    if (ct.includes('application/json')) {
      data = await response.json();
    }

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    navigate('/login', {
      state: {
        registrationSuccess: true,
        email: formData.email
      }
    });
  } catch (err) {
    setError(err.message);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="register-wrapper">
      <img src="feri_by_night.jpg" className="bg-image" alt="Background" />

      <NavBar menuOpen={menuOpen} onMenuToggle={toggleMenu} />

      <div className="register-content">
        <h2 className="auth-title">Registracija</h2>

        <main className="register-card">
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Username@student.um.si"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="8"
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            <button
              type="submit"
              disabled={isLoading}
              className={isLoading ? 'loading' : ''}
            >
              {isLoading ? 'Processing...' : 'Register'}
            </button>

            <a href="/login" className="forgot">
              Already have an account?
            </a>
          </form>
        </main>
      </div>
    </div>
  );
}