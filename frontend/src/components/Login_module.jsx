import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import axios from 'axios';

function Login_module() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value,
    });
    // Clear messages when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
  };

  const validateForm = () => {
    if (!credentials.email || !credentials.password) {
      setError('Please fill in all required fields');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(credentials.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (credentials.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');
    setSuccess('');

    const apiPath = "http://localhost:3500/api/users/login"; // change this to env variable later

    try {
      const res = await axios.post(apiPath, {
        email: credentials.email,
        password: credentials.password
      });

      if (res.status === 200 || res.status === 201) {
        setSuccess('Login successful!');
        console.log("Successful login", res.data);
        
        if (res.data.token) {
          localStorage.setItem('token', res.data.token);
        }

        // Navigate to MainPage
        setTimeout(() => {
          navigate('/MainPage');
        }, 1500);
      }
    } catch (error) {
      console.error("Error getting response from backend", error);
      
      if (error.response) {
        setError(error.response.data.message || 'Invalid email or password');
      } else if (error.request) {
        setError('Unable to connect to server. Please check your connection.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.outerBox}>
      <div className={styles.innerBox}>
        <form onSubmit={handleSubmit}>
          <h2>Login to your JotDown Account</h2>
          
          {error && <div className={styles.errorMessage}>{error}</div>}
          {success && <div className={styles.successMessage}>{success}</div>}
          
          <div className={styles.inputBox}>
            <div>
              <label htmlFor="email">Email*</label>
              <input
                type="email"
                id="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                placeholder="Enter your email"
                disabled={isLoading}
                required
              />
            </div>

            <div>
              <div className={styles.passwordLabelRow}>
                <label htmlFor="password">Password*</label>
                <button
                  type="button"
                  className={styles.showPasswordButton}
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="Enter your password"
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>

          <div className={styles.toggleText}>
            Don't have an account?
            <button 
              type="button" 
              className={styles.toggleButton} 
              onClick={() => window.location.href = '/Register'}
              disabled={isLoading}
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login_module;