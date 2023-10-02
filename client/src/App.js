import "./App.css";
import React, { useContext } from 'react';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import { AuthContext } from './context/AuthContext';
import EditUserProfile from './pages/EditUserProfile';
import Feed from "./pages/Feed";
import Login from "./pages/Login";
import Signup from './pages/Signup';
import UserProfile from './pages/UserProfile';
import Messenger from "./pages/Messenger";
import Search from "./pages/Search";

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
        <Route path='/edit/user/:id' element={<EditUserProfile/>}/>
        <Route path='/search' element={<Search/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App;