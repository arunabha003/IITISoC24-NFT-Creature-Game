import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import LoginPage from './Pages/LoginPage';
import ContactUs from './Pages/ContactUs';
import Announcements from './Pages/Announcements';
import Information from './Pages/Information';
import yourCritters from './Pages/yourCritters'; 
import Marketplace from './Pages/Marketplace';
import Home from './Pages/Home';
import BattleNow from './Pages/BattleNow';
import Form from './Pages/Form';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/join-us',
    element: <LoginPage />,
  },
  {
    path: '/your-critters',
    element: <yourCritters />, // Notice the capitalization
  },
  {
    path: '/announcements',
    element: <Announcements />,
  },
  {
    path: '/marketplace',
    element: <Marketplace />,
  },
  {
    path: '/information',
    element: <Information />,
  },
  {
    path: '/contact-us',
    element: <ContactUs />,
  },
  {
    path: '/home',
    element: <Home/>,
  },
  {
    path:'/battle',
    element:<BattleNow/>
  },
{
  path:'/form',
  element:<Form/>
}
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouterProvider router={router} />
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
