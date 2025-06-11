import React from 'react';
import './TopMenu.css';
import {BrowserRouter,NavLink ,Routes,Route} from 'react-router-dom'

function TopMenu() {
    let activeClassName = "nav_active"
    return (
        <nav className="top-menu">
            <div className="logo">
                <h1>IREAD</h1>
            </div>
            <ul className="nav-links">
                <li><NavLink to="/" className={({ isActive }) => isActive ? activeClassName : undefined}>หน้าแรก</NavLink></li>
                <li><NavLink to="/about" className={({ isActive }) => isActive ? activeClassName : undefined}>เกี่ยวกับเรา</NavLink></li>
                <li><NavLink to="/pricing" className={({ isActive }) => isActive ? activeClassName : undefined}>ราคา</NavLink></li>
                <li><NavLink to="/partners" className={({ isActive }) => isActive ? activeClassName : undefined}>พาร์ทเนอร์</NavLink></li>
                <li><NavLink to="/blog" className={({ isActive }) => isActive ? activeClassName : undefined}>บล็อก</NavLink></li>
                <li className="dropdown">
                    <NavLink to="/legal" className={({ isActive }) => isActive ? activeClassName : undefined}>กฎหมาย</NavLink>
                    <ul className="dropdown-menu">
                        <li><NavLink to="/privacy" className={({ isActive }) => isActive ? activeClassName : undefined}>Privacy Policy</NavLink></li>
                        <li><NavLink to="/terms" className={({ isActive }) => isActive ? activeClassName : undefined}>Terms of Service</NavLink></li>
                    </ul>
                </li>
            </ul>
            <div className="actions">
                <button className="language-switch">TH / EN</button>
                <NavLink to="/waitlist"><button className="start-button">เริ่มต้นใช้งาน</button></NavLink>
            </div>
        </nav>
        
    );
}

export default TopMenu;