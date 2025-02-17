import React from 'react';
//import { DatePicker } from 'antd';
import SignUp from './components/Auth/SignUp'
import MainGuest from './components/Main/MainGuest'
import MainClient from './components/Main/MainClient'
import LogIn from './components/Auth/LogIn'
import { Routes, Route } from "react-router-dom";
import SingleDrug from './components/SingleDrug/SingleDrug';
import { BrowserRouter } from 'react-router-dom';
import ChartClient from './components/Chart/ChartClient';
import Orders from './components/Orders/Orders';
//<Route path='/logOut' element={<Orders/>}/>

const App = () => {
  
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/"element ={<MainGuest/>}/>
      <Route path="/main"element ={<MainClient/>}/>
      <Route  path="/:drId" element={ <SingleDrug/>}/>
      <Route path='/logIn'  element={ <LogIn/>}/>
      <Route path='/signUp'  element={ <SignUp/>}/>
      <Route path='/chart' element={<ChartClient/>}/>
      <Route path='/orders' element={<Orders/>}/>
      
      </Routes>
    </BrowserRouter>
  )
};

export default App;