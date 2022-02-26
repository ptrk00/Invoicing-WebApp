import Login from './pages/Login';
import {Route, BrowserRouter as Router, Routes, Navigate} from "react-router-dom";

const App = () => {

  return (
      <Router>
        <Routes>
          <Route path='/auth/login' element={ <Login/>} />
        </Routes>
      </Router>
  );

};

export default App;