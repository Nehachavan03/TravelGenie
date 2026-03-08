import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import ChatOverlay from './components/ChatOverlay';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Cities from './pages/Cities';
import Places from './pages/Places';
import Favorites from './pages/Favorites';
import Dashboard from './pages/Dashboard';
import TripTimeline from './pages/TripTimeline';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Toaster position="top-right" />

      <Navbar />

      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/countries/:country_code" element={<Cities />} />
            <Route path="/cities/:id" element={<Places />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/trips/:id" element={<TripTimeline />} />
            <Route path="/favorites" element={<Favorites />} />
          </Route>
        </Routes>
      </main>

      {/* AI Assistant Chatbot */}
      <ChatOverlay />
    </div>
  );
}

export default App;
