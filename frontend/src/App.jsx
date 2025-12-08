
import { BrowserRouter, Routes, Route} from "react-router-dom";
import Login from './pages/Login';
import Register from './pages/Register';
import MainPage from './pages/MainPage';
import EditPage from "./pages/EditPage";
import Home from './pages/Home';
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
          <Route path="/edit/:noteId" element={<EditPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
