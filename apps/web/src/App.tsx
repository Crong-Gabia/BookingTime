import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CreatePage from './pages/CreatePage';
import OrganizerSlotSelectionPage from './pages/OrganizerSlotSelectionPage';
import DashboardPage from './pages/DashboardPage';
import ResponsePage from './pages/ResponsePage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/new" element={<CreatePage />} />
      <Route path="/requests/new" element={<CreatePage />} />
      <Route path="/requests/new/slots" element={<OrganizerSlotSelectionPage />} />
      <Route path="/requests/:id/dashboard" element={<DashboardPage />} />
      <Route path="/requests/:id/respond" element={<ResponsePage />} />
    </Routes>
  );
}

export default App;
