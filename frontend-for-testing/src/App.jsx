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
  const onHandleBattleNowSubmit=()=>{
    navigate("/battlePage")
  }
  return (
    <>
    Home Page
      <div className="nav-login">
          <button onClick={handleJoinUsClick}>JOIN US</button>
        </div>

      < button onClick={onHandleBattleNowSubmit}>Battle Now</button>

        <div className="nav-login">
          <button onClick={handleLogin}>Already a user login</button>
        </div>
    </>
  )
}

export default App
