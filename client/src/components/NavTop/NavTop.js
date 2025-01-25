
import React from 'react';
import { Link } from 'react-router-dom';
import './NavTop.css';
import './NavTopMq.css';

const NavTop = () => {
    return (
        <nav>
            <div className="nav-home">
                <Link to="/">
                    <div className="nav-home-icon">
                        <i className="bi bi-house"></i>
                    </div>
                
                <p>Home</p>
                </Link>
            </div>

            <ul className="nav-list">
                <li className="nav-item">
                    <Link to="/register">
                        <button className="nav-button-signup">Sign Up</button>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/login">
                        <i className="bi bi-person-circle"></i>
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default NavTop;