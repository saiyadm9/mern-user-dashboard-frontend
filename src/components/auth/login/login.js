import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../../../utils/api';
import './login.scss';

const Login = ({onLogin}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
			setLoading(true);
			setError('');
      const response = await axios.post(`${BASE_URL}/login`, {
        username,
        password,
      });

      const { userId, token, message } = response.data;
      localStorage.setItem('userToken', token);
			localStorage.setItem('userId', userId);
			console.log(response.data);
			console.log(message);
			onLogin();
    } catch (error) {
      setError('Invalid username or password');
      console.error(error);
    } finally {
			setLoading(false);
		}
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login to View Dashboard</h2>
      <div className="login-input-group">
        <label htmlFor="username" className="login-label">
          Username
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="login-input"
        />
      </div>
      <div className="login-input-group">
        <label htmlFor="password" className="login-label">
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
        />
      </div>
      {error && <p className="login-error">{error}</p>}
      <button onClick={handleLogin} className="login-button" disabled={loading}>
			{loading ? 'Logging in...' : 'Log In'}
      </button>
      <div>
        <p>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
