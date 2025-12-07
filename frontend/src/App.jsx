import { useState } from 'react'
import { useEffect } from 'react';
import Login from './Login';
import axios from 'axios';
import MainPage from './MainPage';

function App() {

  const [test, setTest] = useState('');


  const checkBackend = async () => {
  const apiPath = "http://localhost:3500/"; // change this to env variable later
  try {
    const res = await axios.get(apiPath, {});
    setTest(res.data);
  } catch (error) {
    console.error("Error getting response from backend", error);
  }
  };

    useEffect(() => { checkBackend();}, []);

  return (
    <>
      <h1>Here is the response: {test}</h1>
      <Login/>

      <MainPage />
    </>
  )
}

export default App
