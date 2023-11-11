import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../../../utils/api';
import './register.scss';

const Register = ({ onRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    try {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      const response = await axios.post(`${BASE_URL}/register`, {
        username,
        password,
      });

			const { userId, token, message } = response.data;
      localStorage.setItem('userToken', token);
			localStorage.setItem('userId', userId);
			// console.log(response.data);
			console.log(message);
			onRegister();
    }catch (error) {
      setError('Registration failed. Please check your information.');
      console.error(error);
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Register</h2>
      <div className="register-input-group">
        <label htmlFor="username" className="register-label">
          Username:
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="register-input"
        />
      </div>
      <div className="register-input-group">
        <label htmlFor="password" className="register-label">
          Password:
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="register-input"
        />
      </div>
      <div className="register-input-group">
        <label htmlFor="confirmPassword" className="register-label">
          Confirm Password:
        </label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="register-input"
        />
      </div>
      {error && <p className="register-error">{error}</p>}
      <button onClick={handleRegister} className="register-button">
        Register
      </button>
      <div>
        <p>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
