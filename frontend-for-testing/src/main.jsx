import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './design.css'
import JoinUs from './joinUs.jsx'
import LoginPage from './loginPage.jsx'
import ClaimFirstCritter from './claimFirstCritter.jsx'
import UserProfile from './userProfile.jsx'
import YourCritters from './yourCritters.jsx'
import BattlePage from './battle/battlePage.jsx'
import Results from './battle/results.jsx'
import Sell from './marketplace/Sell.jsx'
import Buy from './marketplace/Buy.jsx'
import Team from './team.jsx'
import Leaderboard from './leaderBoard.jsx'
import { AuthProvider } from './AuthContext'
import HowToPlay from './HowToPlay.jsx'
import PurchaseCritters from "./marketplace/PurchaseCritters.jsx"
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
  {
    path:'/results',
    element:<Results/>
  },
  {
    path:'/sellYourCritter',
    element:<Sell/>
  },
  {
    path:'/marketplace',
    element:<Buy/>
  },
  {
    path:'/leaderboard',
    element:<Leaderboard/>
  },
  {
    path:'/HowToPlay',
    element:<HowToPlay/>
  },
  {
    path:'/purchaseCritters',
    element:<PurchaseCritters/>
  },
  {
    path: '/team',
    element:<Team/>
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
