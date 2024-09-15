// components/layout/VerticalNav.js
import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { Nav } from "react-bootstrap";  // React Bootstrap
import './VerticalNavStyle.css';  // Import custom styles
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';  // For icons
import { faHome, faTasks, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';  // Importing icons

const VerticalNav = () => {
    const { isAuthenticated } = useSelector((state) => (state.auth));

    return (
        <>
            {isAuthenticated ? (
                <div className="vertical-nav">
                    <Nav className="flex-column">
                        <NavLink to="/" className={({ isActive }) => (isActive ? "active nav-link" : "nav-link")}>
                            <FontAwesomeIcon icon={faHome} className="nav-icon" />
                            <span>Dashboard</span>
                        </NavLink>
                        <NavLink to="/tasks" className={({ isActive }) => (isActive ? "active nav-link" : "nav-link")}>
                            <FontAwesomeIcon icon={faTasks} className="nav-icon" />
                            <span>Tasks</span>
                        </NavLink>
                        <NavLink to="/meetings" className={({ isActive }) => (isActive ? "active nav-link" : "nav-link")}>
                            <FontAwesomeIcon icon={faCalendarAlt} className="nav-icon" />
                            <span>Meetings</span>
                        </NavLink>
                    </Nav>
                </div>
            ) : null}
        </>
    );
};

export default VerticalNav;
