import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Stations from './pages/Stations';
import Query from './pages/Query';
import Stats from './pages/Stats';
import Alerts from './pages/Alerts';
import Dashboard from './pages/Dashboard';
import Developers from './pages/Developers';

const pageStyle = {
  maxWidth: 1100,
  margin: '0 auto',
  padding: '1.5rem 2rem',
};

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ background: '#0f1117', minHeight: '100vh', color: '#e2e8f0' }}>
        <Navbar />
        <div style={pageStyle}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/stations" element={<Stations />} />
            <Route path="/query" element={<Query />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/developers" element={<Developers />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
