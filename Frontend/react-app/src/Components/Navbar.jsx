import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";
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
                        {isAuthenticated?(
                            <button onClick={loggingout }>Log out</button>
                        ):(
                            <button onClick={() => loginWithRedirect() }>Sign In</button>
                        )}
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