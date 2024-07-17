import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from 'react-router-dom';
import logo from '../assets/logo-no-background.png'
import './Navbar.css'


function NavBar() {

    const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();

    if (isAuthenticated){
        console.log(user)
    }

    const loggingout = () => {
        logout({ logoutParams: { returnTo: window.location.origin }})
        console.log("logged out")
    }
    

    return (
        <>
            <div className='navBar'>

                {/* <div>
                {isAuthenticated ? <div>
                    <img src={user.picture} alt='profile'></img> 
                    <p>{user.name}</p>
                </div> 
                : "profile"}
                </div> */}
                
                <div className='logo-container'>
                    <div>
                    <img src={logo} alt="Website Logo" />
                    </div>
                </div>

                <div className='navitems-container'>
                    <p>Home</p>
                    <Link to='/inventory'><p>Inventory</p></Link>
                    <p>Keep Tracks</p>
                    <p>To - Do</p>
                    <p>Services</p>
                </div>

                <div className='additional-navitems-container'>
                    <div>
                        {isAuthenticated?(
                            <button className='button-logout' onClick={loggingout }>Log out</button>
                        ):(
                            <button className='button-loggin' onClick={() => loginWithRedirect() }>Sign In</button>
                        )}
                    </div>
                    <div className='profile-picture'>
                        {isAuthenticated?(
                            <img src={user.picture} alt='profile'></img>
                        ):(
                            <img src='' alt='profile images'/>
                        )}
                    </div>
                </div>
            </div> 
        </>
    );
}

export default NavBar;