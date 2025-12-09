import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Register.module.css';
import axios from 'axios';

function Register_module() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    name: '',          
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    name: '',          
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Real-time validation effect
  useEffect(() => {
    const errors = {};

    // Name validation
    if (credentials.name && credentials.name.length < 2) { // simple check
      errors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    if (credentials.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(credentials.email)) {
        errors.email = 'Invalid email format';
      }
    }

    // Password validation
    if (credentials.password) {
      if (credentials.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
      }
    }

    // Confirm password validation
    if (credentials.confirmPassword) {
      if (credentials.password !== credentials.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }

    setValidationErrors(errors);
  }, [credentials]); // Runs every time credentials change

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value,
    });
    // Clear main error when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
  };

  const validateForm = () => {
    if (!credentials.name || !credentials.email || !credentials.password || !credentials.confirmPassword) { 
      setError('Please fill in all required fields');
      return false;
    }

    if (Object.keys(validationErrors).some(key => validationErrors[key])) {
      setError('Please fix the errors above');
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

    const apiPath = "http://localhost:3500/api/users/register";

    try {
      const res = await axios.post(apiPath, {
        name: credentials.name,        
        email: credentials.email,
        password: credentials.password
      });

      if (res.status === 200 || res.status === 201) {
        setSuccess('Account created successfully! Redirecting...');
        console.log("Successful registration", res.data);
        
        // silencing for now
        // if (res.data.token) {
        //   localStorage.setItem('token', res.data.token);
        // }

        setTimeout(() => {
          navigate('/MainPage');
        }, 1500);
      }
    } catch (error) {
      console.error("Error getting response from backend", error);
      
      if (error.response) {
        setError(error.response.data.message || 'An error occurred. Please try again.');
      } else if (error.request) {
        setError('Unable to connect to server. Please check your connection.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Check if form is valid for button enable/disable
  const isFormValid = credentials.name &&  
                      credentials.email && 
                      credentials.password && 
                      credentials.confirmPassword &&
                      Object.keys(validationErrors).every(key => !validationErrors[key]);

  return (
    <div className={styles.outerBox}>
      <div className={styles.innerBox}>
        <form onSubmit={handleSubmit}>
          <h2>Create your JotDown Account</h2>
          
          {error && <div className={styles.errorMessage}>{error}</div>}
          {success && <div className={styles.successMessage}>{success}</div>}
          
          <div className={styles.inputBox}>

            {/* Name Field */}
            <div>
              <label htmlFor="name">Name*</label>
              <input
                type="text"
                id="name"
                name="name"
                value={credentials.name}
                onChange={handleChange}
                placeholder="Enter your name"
                disabled={isLoading}
                required
              />
              {validationErrors.name && (
                <span className={styles.fieldError}>{validationErrors.name}</span>
              )}
            </div>

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
              {validationErrors.email && (
                <span className={styles.fieldError}>{validationErrors.email}</span>
              )}
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
                placeholder="Enter your password (min. 6 characters)"
                disabled={isLoading}
                required
              />
              {validationErrors.password && (
                <span className={styles.fieldError}>{validationErrors.password}</span>
              )}
            </div>

            <div>
              <div className={styles.passwordLabelRow}>
                <label htmlFor="confirmPassword">Confirm Password*</label>
                <button
                  type="button"
                  className={styles.showPasswordButton}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={credentials.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                disabled={isLoading}
                required
              />
              {validationErrors.confirmPassword && (
                <span className={styles.fieldError}>{validationErrors.confirmPassword}</span>
              )}
            </div>
          </div>

          <button type="submit" disabled={isLoading || !isFormValid}>
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>

          <div className={styles.toggleText}>
            Already have an account?
            <button 
              type="button" 
              className={styles.toggleButton} 
              onClick={() => navigate('/login')}
              disabled={isLoading}
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register_module;
