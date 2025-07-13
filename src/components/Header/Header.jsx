import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Home,
  Search,
  LogIn,
  User,
  MoreHorizontal,
  Plus,
} from 'lucide-react';
import Container from '../Container/Container';
import Logo from '../Logo';
import LogoutBtn from './LogoutBtn';
import profileDetails from '../../appwrite/profileService';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData, status: authStatus } = useSelector((state) => state.auth);

  const [profile, setProfile] = useState(null);
  const [showLogout, setShowLogout] = useState(false);

  const navItems = [
    { name: 'Home', slug: '/home', icon: <Home size={24} />, auth: 'all' },
    { name: 'Explore', slug: '/explore', icon: <Search size={24} />, auth: 'auth' },
    { name: 'Login', slug: '/login', icon: <LogIn size={24} />, auth: 'guest' },
    { name: 'SignUp', slug: '/signup', icon: <LogIn size={24} />, auth: 'guest' },
    { name: 'Profile', slug: '/profile', icon: <User size={24} />, auth: 'auth' },
    { name: 'More', slug: '/more', icon: <MoreHorizontal size={24} />, auth: 'auth' },
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      if (authStatus && userData?.$id) {
        try {
          let profile = await profileDetails.getUserProfile(userData.$id);

          if (!profile) {
            profile = await profileDetails.createUserProfile({
              userId: userData.$id,
              username: userData.name?.trim() || userData.email?.split('@')[0] || 'User',
              bio: '',
              profileImage: '',
            });
          }

          setProfile(profile);
        } catch (err) {
          console.error('🚫 Failed to fetch/create profile:', err);
        }
      }
    };

    fetchProfile();
  }, [userData, authStatus]);

  const renderAvatar = () => {
    if (profile?.profileImage) {
      const imageUrl = profileDetails.getFileURL(profile.profileImage);
      return (
        <img
          src={imageUrl}
          alt="User Avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
      );
    }

    if (profile?.username) {
      return (
        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-semibold text-lg">
          {profile.username.charAt(0).toUpperCase()}
        </div>
      );
    }

    return null;
  };

  const isAllowed = (type) =>
    type === 'all' || (type === 'auth' && authStatus) || (type === 'guest' && !authStatus);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden sm:flex flex-col w-[250px] p-4 border-r border-gray-200 h-screen fixed left-0 top-0 bg-white justify-between">
        <Container>
          {/* Logo */}
          <div className="mb-8 flex justify-start">
            <Link to="/">
              <Logo width="50px" />
            </Link>
          </div>

          {/* Nav Links */}
          <ul className="space-y-4">
            {navItems.map(
              (item) =>
                isAllowed(item.auth) && (
                  <li key={item.name}>
                    <button
                      onClick={() => navigate(item.slug)}
                      className={`flex items-center gap-3 text-gray-700 hover:text-blue-500 font-medium text-base px-3 py-2 rounded-lg hover:bg-gray-100 w-full text-left ${
                        location.pathname === item.slug ? 'bg-gray-100 text-blue-600' : ''
                      }`}
                    >
                      {item.icon}
                      <span className="hidden md:inline">{item.name}</span>
                    </button>
                  </li>
                )
            )}

            {/* Tweet Button */}
            {authStatus && (
              <li>
                <button
                  onClick={() => navigate('/add-tweet')}
                  className="w-full px-4 py-2 bg-black text-white rounded-full font-semibold hover:bg-gray-900 transition"
                >
                  Tweet
                </button>
              </li>
            )}
          </ul>
        </Container>

        {/* Profile & Logout */}
        {authStatus && profile && (
          <div
            className="flex flex-col gap-2 p-4 border-t mt-4 cursor-pointer"
            onClick={() => setShowLogout((prev) => !prev)}
          >
            <div className="flex items-center gap-3">
              {renderAvatar()}
              <div>
                <p className="text-sm font-medium text-gray-800">{profile.username}</p>
                <p className="text-xs text-gray-500">@{userData?.email?.split('@')[0]}</p>
              </div>
            </div>
            {showLogout && <LogoutBtn />}
          </div>
        )}
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md z-50">
        <div className="flex justify-around items-center h-14">
          {navItems
            .filter((item) => isAllowed(item.auth))
            .map((item) => (
              <button
                key={item.name}
                onClick={() => navigate(item.slug)}
                className={`text-gray-600 hover:text-blue-500 flex flex-col items-center text-xs ${
                  location.pathname === item.slug ? 'text-blue-600' : ''
                }`}
              >
                {item.icon}
              </button>
            ))}

          {authStatus && (
            <button
              onClick={() => navigate('/add-tweet')}
              className="bg-black text-white p-2 rounded-full hover:bg-gray-900 transition"
            >
              <Plus size={20} />
            </button>
          )}
        </div>
      </nav>
    </>
  );
}

export default Header;
