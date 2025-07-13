import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { Provider } from 'react-redux';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import store from './store/store';
import Home from './pages/Home.jsx';
import Tweet from './pages/Tweet.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/SignUp.jsx';
import AddTweet from './pages/AddTweet.jsx';
import EditTweet from './pages/EditTweet.jsx';
import AuthLayout from './components/AuthLayout.jsx';
import AllTweets from './pages/AllTweets.jsx';
import Profile from './pages/Profile.jsx';
import More from './pages/More.jsx';
import Explore from './pages/Explore.jsx';
import { Navigate } from 'react-router-dom';
const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <AuthLayout authentication={false}>
        <Login />
      </AuthLayout>
    ),
  },
  {
    path: '/signup',
    element: (
      <AuthLayout authentication={false}>
        <Signup />
      </AuthLayout>
    ),
  },
  {
    path: '/',
    element: <App />,
    children: [
      {
      index: true, 
      element: <Navigate to="home" replace /> 
      },
      {
        path: 'home',
        element: <Home />,
      },
      {
        path: 'add-tweet',
        element: (
          <AuthLayout authentication>
            <AddTweet />
          </AuthLayout>
        ),
      },
      {
        path: 'edit-tweet/:docId',
        element: (
          <AuthLayout authentication>
            <EditTweet />
          </AuthLayout>
        ),
      },
      {
        path: 'tweet/:docId',
        element: <Tweet />,
      },
      {
        path: 'all-tweets',
        element: <AllTweets />,
      },
      {
        path: 'profile',
        element: (
          <AuthLayout authentication>
            <Profile />
          </AuthLayout>
        ),
      },
      {
        path:'more',
        element: (
          <AuthLayout authentication>
            <More/>
          </AuthLayout>
        ),
      },
      {
        path: 'explore',
        element: (
          <AuthLayout authentication>
            <Explore />
          </AuthLayout>
        ),
      }
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
