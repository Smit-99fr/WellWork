import React from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../actions/auth';

const Header = () => {

  const { isAuthenticated, user } = useSelector((state) => (state.auth));
  const dispatch = useDispatch();

  const authLinks = (
    <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
      <span className='navbar-text mr-3'>
        <strong>{user ? <NavLink to={'/profile-page'} className="nav-link">Welcome {user.username}</NavLink> : ""}</strong>
      </span>
      <span className='navbar-text mr-3'>
        {user ? <NavLink to={'/team-page'} className="nav-link">Team Details</NavLink> : ""}
      </span>

      <li className="nav-item">
        <button className='nav-link btn btn-info btn-sm text-dark'
          onClick={() => {
            console.log("Logout button clicked"); // Add this line
            dispatch(logout());
          }}>Logout</button>
      </li>
    </ul>
  );

  const guestLinks = (
    <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
      <li className="nav-item">
        <NavLink to="/register" className="nav-link">Register</NavLink>
      </li>
      <li className="nav-item">
        <NavLink to="/login" className="nav-link">Login</NavLink>
      </li>
    </ul>
  );

  return (
    <nav className="navbar navbar-expand-sm navbar-light bg-light px-4">
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarTogglerDemo01"
        aria-controls="navbarTogglerDemo01"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
        <a className="navbar-brand" href="#">Well Work</a>
        {isAuthenticated ? authLinks : guestLinks}
      </div>
    </nav>
  );
};

export default Header;
