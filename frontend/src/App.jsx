
import { BrowserRouter, Routes, Route} from "react-router-dom";
import Login from './pages/Login';
import Register from './pages/Register';
import MainPage from './pages/MainPage';
import EditPage from "./pages/EditPage";
import Landing from './pages/Landing';
import './index.css'

function App() {
  return (
    <div className="app-body">
      <BrowserRouter basename="/jot-down"> 
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Notes" element={<MainPage />} />
          <Route path="/edit/:noteId" element={<EditPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
