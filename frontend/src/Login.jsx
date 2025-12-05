import React, { useState } from 'react';
//import * as ToggleGroup from '@radix-ui/react-toggle-group';
import styles from './Login.module.scss';



function Login() {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

 const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value,
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();


    if (credentials.email === 'test@example.com' && credentials.password === 'password') {
      console.log("correct!");
    
    } else {
      console.log("bad login attempt");
    }

  };

  return (
   <div className={styles.outerBox} >
    <div className={styles.innerBox}>
      <form onSubmit={handleSubmit} >
        
        <h2>Login</h2>
        <div className="input-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Sign In</button>
      </form>
    </div>
    </div>
  );
}

export default Login;