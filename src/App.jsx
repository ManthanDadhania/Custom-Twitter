
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
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (user) {
          dispatch(login(user));  // ✅ Correct: set userData in store
        } else {
          dispatch(logout());
        }
      } catch (error) {
        console.error("Failed to get current user:", error);
        dispatch(logout());
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Header />
      <main className="flex-grow ml-[250px] mr-[300px] bg-gray-50">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;
