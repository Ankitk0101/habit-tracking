import { Route, Routes, useLocation } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import PrivateRoute from "./routes/PrivateRoute"
import Dashboard from "./pages/Dashboard"

function App() {
  const location = useLocation();
  const isModalPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <>
      <div className={`${isModalPage ? 'blur-sm pointer-events-none select-none' : ''}`}>
        <Routes>
          <Route path="/" element={ <Home /> } />
          <Route path="/dashboard" element={ <PrivateRoute> <Dashboard/> </PrivateRoute>  } />
        </Routes>
      </div>
     
      <Routes> 
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </>
  );
}

export default App;
