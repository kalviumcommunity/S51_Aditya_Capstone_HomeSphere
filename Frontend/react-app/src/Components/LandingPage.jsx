import React from 'react';
import './LandingPage.css'
import logo from '../assets/logo-no-background.png'
import first from '../assets/first.png' 


function LandingPage(props) {
  return (
    <div>
      <div className='whole'>

        <div className='navbar'>

          <div className='logo-container'>
            <img src={logo} alt="" />
          </div>

          <div className='nav-items-container'>

            <div className='nav-items'>
              <p className='home'>home</p>
              <p className='inventory'>inventory</p>
              <p className='keep-tracks'>keep tracks</p>
              <p className='to-do'>to do</p>
              <p className='sevices'>sevices</p>
            </div>

            <div className='get-started'>
              <button className='btn-get-started'>Get started</button>
            </div>
          
          </div>

        </div>

        <div className='first-look'>
          <div className='head-text'>
          <h1>Bring your Home <br></br>Online</h1>
          <h3>Access your home anywhere, anytime</h3>
          <button className='login-second'>Get started</button>
          </div>
          <div className='first-look-img-container'>
            <img className='first-look-img' src={first}></img>
          </div>
        </div>

        <div className='scroll-body'>

          <div className='feature-1'>

          <div className='feature-img'>
            <img src="" alt="" />
          </div>

          <div className='feature-properties'>
            <h2></h2>
            <h3></h3>
            <h3></h3>
            <h3></h3>
          </div>

          </div>

          <div className='feature-2'></div>
          <div className='feature-3'></div>
          <div className='feature-4'></div>
        </div>
        <div className='call-to-action'></div>
        <div className='footer'></div>

      </div>
      
    </div>
  );
}

export default LandingPage;