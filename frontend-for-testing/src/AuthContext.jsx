// import React, { createContext, useState, useContext } from 'react';
// import axios from 'axios';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [userProfile, setUserProfile] = useState(null);

//   const login = (profile) => {
//     setIsLoggedIn(true);
//     setUserProfile(profile);
//   };

//   const logout = () => {
//     setIsLoggedIn(false);
//     setUserProfile(null);
//   };

//   return (
//     <AuthContext.Provider value={{ isLoggedIn, userProfile, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  // Function to check if a user is logged in
  const checkAuthStatus = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/user/profile', { withCredentials: true });
      if (response.data) {
        setIsLoggedIn(true);
        setUserProfile(response.data);
      }
    } catch (error) {
      console.log('Error checking auth status', error);
      setIsLoggedIn(false);
      setUserProfile(null);
    }
  };

  // Use useEffect to check auth status on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = (profile) => {
    setIsLoggedIn(true);
    setUserProfile(profile);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserProfile(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userProfile, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
