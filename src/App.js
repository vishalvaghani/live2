// import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../src/components/Login";
import Dashboard from "../src/components/Dashboard";
import AuthProvider from "../src/hooks/AuthProvider";
// import PrivateRoute from "../src/router/route";
import Admin from './components/Admin';
// import Pagination from '../src/components/React-Table-pagination';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/dashboard" element={<Dashboard />} />
            {/* <Route path="/pagination" element={<Pagination/>}/> */}
            {/* <Route element={<PrivateRoute />}> */}
            
            {/* Other routes */}
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
