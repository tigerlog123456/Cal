import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Homepage from './pages/Homepage';
import Notfound from './pages/Notfound';

function App() {

  return (
  <div>
      <Routes>      
        <Route path="/Cal" element={<Homepage />} />
        <Route path="*" element={<Notfound />} />
      </Routes>

      
    </div>
  );
}

export default App;
