import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import profileService from '../appwrite/profileService';

function Footer() {
  const [quote, setQuote] = useState('');
  const [time, setTime] = useState(new Date());
  const [topUsers, setTopUsers] = useState([]);

  const quotes = [
    "Code. Sleep. Repeat.",
    "Creativity is intelligence having fun.",
    "Push yourself, not just code.",
    "Great things take time to compile.",
    "Debugging is like being the detective of a crime you committed.",
  ];

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    const interval = setInterval(() => setTime(new Date()), 1000);
    profileService.getTopTweetUsers().then(setTopUsers);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden sm:flex fixed right-0 top-0 h-screen w-[300px] p-4 border-l border-gray-200 bg-white overflow-y-auto shadow-inner z-10 flex-col">
        {/* Search */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        </div>

        {/* Time & Quote */}
        <div className="text-center">
          <p className="text-sm text-gray-500">🕒 {time.toLocaleTimeString()}</p>
          <p className="text-xs text-gray-400">{time.toDateString()}</p>
          <div className="mt-4 bg-blue-50 text-blue-700 text-sm p-3 rounded-xl shadow-sm italic">
            “{quote}”
          </div>
        </div>

        {/* Trending Topics */}
        <div className="mt-6">
          <h3 className="text-gray-800 font-semibold mb-3">🔥 Trending Topics</h3>
          <ul className="space-y-3 text-sm text-gray-700">
            {['#React', '#JavaScript', '#AI', '#OpenSource', '#TailwindCSS'].map((t, i) => (
              <li key={i} className="hover:underline cursor-pointer">{t}</li>
            ))}
          </ul>
        </div>

        {/* Top Users */}
        <div className="mt-6">
          <h3 className="text-gray-800 font-semibold mb-3">👥 People With Most Tweets</h3>
          <ul className="space-y-4">
            {topUsers.map((user, i) => (
              <li key={i} className="flex items-center gap-3">
                {user.profileImage ? (
                  <img
                    src={profileService.getFileURL(user.profileImage)}
                    alt={user.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center font-bold text-white">
                    {user.username?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="text-sm">
                  <p className="font-medium text-gray-800">{user.displayName || user.username}</p>
                  <p className="text-xs text-gray-500">@{user.username}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Desktop Footer Links */}
        <div className="border-t pt-4 mt-auto">
          <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs text-gray-400">
            <span className="hover:underline cursor-pointer">Terms</span>
            <span className="hover:underline cursor-pointer">Privacy</span>
            <span className="hover:underline cursor-pointer">Cookies</span>
            <span className="hover:underline cursor-pointer">About</span>
            <span className="hover:underline cursor-pointer">Help</span>
          </div>
          <p className="text-xs text-gray-300 mt-2">&copy; 2025 CustomTwitter</p>
        </div>
      </aside>

      {/* Mobile Footer (only quote + legal links) */}
      <div className="sm:hidden w-full p-4 bg-white border-t border-gray-200 shadow-inner text-center fixed bottom-0 left-0 right-0 z-50">
        <p className="text-xs text-gray-500 italic mb-2">“{quote}”</p>
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs text-gray-400">
          <span className="hover:underline cursor-pointer">Terms</span>
          <span className="hover:underline cursor-pointer">Privacy</span>
          <span className="hover:underline cursor-pointer">Cookies</span>
          <span className="hover:underline cursor-pointer">About</span>
          <span className="hover:underline cursor-pointer">Help</span>
        </div>
      </div>
    </>
  );
}

export default Footer;
