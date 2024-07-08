import { useNavigate } from 'react-router-dom';
import './App.css'
function App() {
  const navigate = useNavigate();
  const handleJoinUsClick = () => {
    navigate('/user/register');
  };
  const handleLogin = () => {
    navigate('/user/login');
  };
  return (
    <>
    Home pAge
      <div className="nav-login">
          <button onClick={handleJoinUsClick}>JOIN US</button>
        </div>

        <div className="nav-login">
          <button onClick={handleLogin}>Already a user login</button>
        </div>
    </>
  )
}

export default App
