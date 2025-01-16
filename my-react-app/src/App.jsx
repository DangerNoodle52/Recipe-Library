import Dashboard from './Dashboard';
import RecipeDetails from './RecipeDetails';
import Navbar from './Navbar';
import Profile from './Profile';
import Login from './Login';
import Signup from './Signup';
import { Route, Routes, useLocation } from 'react-router-dom';
function App() {
  const location = useLocation();

  const hideNavbarPaths = ['/signup', '/'];
  //       {/* {location.pathname !== '/signup' && location.pathname !== '/' && (
  //   <Navbar />
  // )} */}
  return (
    <div>
      {!hideNavbarPaths.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/search' element={<Dashboard />} />
        <Route path='/recipe/:idMeal' element={<RecipeDetails />} />
        <Route path='/profile' element={<Profile />} />
      </Routes>
    </div>
  );
}
export default App;
