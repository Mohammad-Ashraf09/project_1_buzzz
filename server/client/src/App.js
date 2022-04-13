import React, { useContext } from 'react';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import "./App.css";
import { AuthContext } from './context/AuthContext';
import AdminProfile from './pages/AdminProfile';
import Feed from "./pages/Feed";
import Login from "./pages/Login";
import Signup from './pages/Signup';
import UserProfile from './pages/UserProfile';

const App = () => {

  const {user} = useContext(AuthContext);
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={user ? <Feed/> : <Signup/> }/>
        <Route path='/login' element={ user ? <Navigate to="/" /> : <Login/>}/>
        <Route path='/user/:id' element={<UserProfile/>}/>
        <Route path='/admin/:id' element={<AdminProfile/>}/>
        <Route path='/register' element={ user ? <Navigate to="/" /> : <Signup/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App;