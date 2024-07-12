import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import JoinUs from './joinUs.jsx'
import LoginPage from './loginPage.jsx'
import ClaimFirstCritter from './claimFirstCritter.jsx'
import UserProfile from './userProfile.jsx'
import YourCritters from './yourCritters.jsx'
import BattlePage from './battle/battlePage.jsx'
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
  },
  {
    path:'/user/register/claimFirstCritter',
    element: <ClaimFirstCritter/>
  },
  {
    path:'/user/userProfile',
    element: <UserProfile/>
  },
  {
    path:'/yourCritters',
    element:<YourCritters/>
  },
  {
    path:'/battlePage',
    element:<BattlePage/>
  },
  
]
)


ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)
