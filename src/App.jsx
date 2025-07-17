import { useState, useEffect } from 'react';
import './App.css';
import { useDispatch } from 'react-redux';
import { login, logout } from './store/authSlice';
import authService from './appwrite/authService';
import { Outlet } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer';

function App() {
  const [loading, setLoading] = useState(true);
  const [showMobileFooter, setShowMobileFooter] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await authService.getCurrentUser();
        user ? dispatch(login(user)) : dispatch(logout());
      } catch (error) {
        console.error("Failed to get current user:", error);
        dispatch(logout());
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [dispatch]);

  // Detect scroll to bottom
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      const atBottom = scrollY + windowHeight >= docHeight - 5;
      setShowMobileFooter(atBottom);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-50 min-h-screen relative">
      {/* Fixed Sidebar Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow w-full sm:ml-[250px] sm:mr-[300px] px-4 py-6">
        <Outlet />
      </main>

      {/* Desktop Footer */}
      <div className="hidden sm:block">
        <Footer />
      </div>

      {/* Mobile Footer: shown only when scrolled to bottom */}
      {showMobileFooter && (
        <div className="fixed bottom-0 left-0 w-full bg-white sm:hidden shadow-md z-50 border-t">
          <Footer />
        </div>
      )}
    </div>
  );
}

export default App;
