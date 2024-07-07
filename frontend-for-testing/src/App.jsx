import { useNavigate } from 'react-router-dom';
import './App.css'
function App() {
  const navigate = useNavigate();
  const handleJoinUsClick = () => {
    navigate('/user/register');
  };
  return (
    <>
    Home pAge
      <div className="nav-login">
          <button onClick={handleJoinUsClick}>JOIN US</button>
        </div>
    </>
  )
}

export default App
