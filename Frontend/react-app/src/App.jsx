import { useState } from 'react'
import React from 'react'
import './App.css'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import NavBar from './Components/Navbar'
import Inventory from './Components/Inventory'

function App() {

  return (
    <>
 <BrowserRouter>
    <NavBar/>

      <Routes>
        {/* <Route path='/' element={<Home/>}/> */}
        {/* <Route path='/After' element={<After />}/> */}
        <Route path='/inventory' element={<Inventory/>}/>
        {/* <Route path='/item' element={<ItemFormat/>} /> */}
      </Routes>
    </BrowserRouter>    </>
  )
}

export default App
