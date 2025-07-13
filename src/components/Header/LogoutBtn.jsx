import React from 'react';
import { useDispatch } from 'react-redux';
import authService from '../../appwrite/authService';
import { logout } from '../../store/authSlice';

function LogoutBtn() {
  const dispatch = useDispatch();

  const logoutHandler = () => {
    authService.logout().then(() => {
      dispatch(logout());
    });
  };

  return (
    <button
      onClick={logoutHandler}
      className="w-full text-sm text-red-500 font-medium py-2 px-4 rounded-lg hover:bg-red-50 transition-colors duration-200 text-left"
    >
      Logout
    </button>
  );
}

export default LogoutBtn;
