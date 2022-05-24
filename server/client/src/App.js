import "./App.css";
import React, { useContext } from 'react';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import { AuthContext } from './context/AuthContext';
import AdminProfile from './pages/AdminProfile';
import Feed from "./pages/Feed";
import Login from "./pages/Login";
import Signup from './pages/Signup';
import UserProfile from './pages/UserProfile';
import Messenger from "./pages/Messenger";

const App = () => {

  const {user} = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={user ? <Feed/> : <Login/> }/>
        <Route path='/login' element={ user ? <Navigate to="/" /> : <Login/>}/>
        <Route path='/register' element={ user ? <Navigate to="/" /> : <Signup/>}/>
        <Route path='/messenger' element={ !user ? <Navigate to="/" /> : <Messenger/>}/>
        <Route path='/user/:id' element={<UserProfile/>}/>
        <Route path='/admin/:id' element={<AdminProfile/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App;