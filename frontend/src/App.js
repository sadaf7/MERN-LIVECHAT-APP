import './App.css';
import { Route,Routes } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import ChatPage from './Pages/ChatPage';
import ChatProvider from './context/ChatProvider';

function App() {
  return (
    <div className="App">
      
     <Routes>
      <Route exact path='/' Component={HomePage}/>
      <Route exact path='/chat' Component={ChatPage}/>
     </Routes>
     
    </div>
  );
}

export default App;
