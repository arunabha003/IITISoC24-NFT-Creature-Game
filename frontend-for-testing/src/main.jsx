import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import JoinUs from './joinUs.jsx'
import LoginPage from './loginPage.jsx'

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
    path: '/user/register',
    element: <JoinUs />,
  },
  {
    path:'/user/login',
    element: <LoginPage/>
  }]
)


ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)
