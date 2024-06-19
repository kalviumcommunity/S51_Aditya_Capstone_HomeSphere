import React from 'react';
import './Navbar.css'


function NavBar() {

    return (
        <>
            <div className='navBar'>
                <div className='logo-container'>
                    <div>
                    <img src="" alt="Website Logo" />
                    </div>
                </div>

                <div className='navitems-container'>
                    <p>Home</p>
                    <p>Inventory</p>
                    <p>Keep Tracks</p>
                    <p>To - Do</p>
                    <p>Services</p>
                </div>

                <div className='additional-navitems-container'>
                    <div>
                    <img src='' alt='sign up'></img>
                    </div>
                    <div>
                        <img src='' alt='sign in'></img>
                    </div>
                    <div>
                        <img src="" alt='profile'></img>
                    </div>
                </div>
            </div> 
        </>
    );
}

export default NavBar;