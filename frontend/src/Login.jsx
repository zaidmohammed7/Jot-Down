import React, { useState } from 'react';
import styles from './Login.module.css';
import axios from 'axios';



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

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Verifying credentials...");

    const apiPath = "http://localhost:3500/api/users/login"; // change this to env variable later
    try {
      const res = await axios.post(apiPath, {
          email: credentials.email,
          password: credentials.password
      });
      console.log(res.data);
      if (res.status === 200) {
        console.log("successful login");
      }
    } catch (error) {
      console.error("Error getting response from backend", error);
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