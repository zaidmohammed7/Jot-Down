
import { BrowserRouter, Routes, Route} from "react-router-dom";
import Login from './pages/Login';
import MainPage from './pages/MainPage';
import EditPage from "./pages/EditPage";
import Home from './pages/Home';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/MainPage" element={<MainPage />} />
          <Route path="/edit/:noteId" element={<EditPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
