import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/UseAuth';
import SideNav from './SideNav';
import LogOut from '../pages/authentication/LogOut';
import { MdDashboard } from "react-icons/md";


function NavBar({navStyles}) {
  const isAuthenticated = useAuth(['admin', 'user']);

  return (
    <header className={`navbar w-screen  flex flex-row py-6 shadow-md justify-center items-center text-white ${navStyles}` }>
      <h1 className="text-lime-700 mx-8 text-4xl lg:text-5xl font-bold">
        RE<span className="text-rose-600">PAY</span>
      </h1>
      <nav className="text-white hover:text-black lg:visible invisible w-full">
        <ul className="flex justify-around">
          <div>
            <Link className="nav-link px-4 font-bold text-xl" to="/">Home</Link>
            <Link className="nav-link px-4 font-bold text-xl" to="/how-it-works">How it Works</Link>
          </div>
          <div className="flex justify-end">
            {!isAuthenticated && (
              <>
                <Link className="nav-button rounded-full px-8 py-3  mx-2" to="/login" style={{backgroundColor:'#399918'}}>Login</Link>
                <Link className="nav-button rounded-full px-8 py-3 bg-rose-800 text-white" to="/account">Register</Link>
              </>
            )}
            {isAuthenticated && (
              <>
                <LogOut />
                <Link to="/my-dashboard" className="flex items-center font-bold text-xl nav-link">
                  <MdDashboard className="mr-2" />
                  My Dashboard
                </Link>
              </>
            )}
          </div>
        </ul>
      </nav>
      <div className="w-fit lg:invisible"><SideNav /></div>
    </header>
  );
}

export default NavBar;
