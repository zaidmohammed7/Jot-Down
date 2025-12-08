
import { BrowserRouter, Routes, Route} from "react-router-dom";
import Login from './pages/Login';
import Register from './pages/Register';
import MainPage from './pages/MainPage';
import Launch from './pages/Launch';
import './index.css'

function App() {
  return (
    <div className="app-body">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Launch />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/MainPage" element={<MainPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
