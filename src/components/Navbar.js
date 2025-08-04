import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUserFriends, FaBriefcase, FaCommentDots, FaBell, FaTh, FaUserCircle } from 'react-icons/fa';
import './Navbar.css'; // assuming you create this file

export default function Navbar() {
    return (
        <nav className="linkedin-navbar">
            <div className="navbar-left">
                <img
                    src="https://cdn-icons-png.flaticon.com/512/174/174857.png"
                    alt="LinkedIn"
                    className="linkedin-logo"
                />
                <div className="search-bar">
                    <span className="search-icon">🔍</span>
                    <input type="text" placeholder="Search" />
                </div>
            </div>
            <div className="navbar-center">
                <NavLinkWithIcon to="/" icon={<FaHome />} label="Home" />
                <NavLinkWithIcon to="/network" icon={<FaUserFriends />} label="My Network" />
                <NavLinkWithIcon to="/jobs" icon={<FaBriefcase />} label="Jobs" />
                <NavLinkWithIcon to="/messaging" icon={<FaCommentDots />} label="Messaging" />
                <NavLinkWithIcon to="/notifications" icon={<FaBell />} label="Notifications" badge={3} />
                <NavLinkWithIcon to="/me" icon={<FaUserCircle />} label="Me" />
            </div>
            <div className="navbar-right">
                <NavLinkWithIcon to="/for-business" icon={<FaTh />} label="For Business ▾" />
                <NavLinkWithIcon to="/learning" icon={<img src="https://static.licdn.com/sc/h/6k1x1ueacr5w87ur3pkh4x3lx" alt="Learning" style={{ borderRadius: 4, width: 22 }} />} label="Learning" />
            </div>
        </nav>
    );
}

function NavLinkWithIcon({ to, icon, label, badge }) {
    return (
        <Link to={to} className="icon-link">
            <span className="icon">{icon}</span>
            {label && <span className="icon-label">{label}</span>}
            {badge && <span className="badge">{badge}</span>}
        </Link>
    );
}
