import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import "./App.css";
import AdminProfile from './pages/AdminProfile';
import Feed from "./pages/Feed";
import Login from "./pages/Login";
import UserProfile from './pages/UserProfile';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Feed/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/user/:username' element={<UserProfile/>}/>
        <Route path='/adminprofile' element={<AdminProfile/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App;