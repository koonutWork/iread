import { useState } from 'react';
import './App.css';
import './components/TopMenu.css';
import { BrowserRouter, NavLink, Routes, Route } from 'react-router-dom';

//page
import Home from './pages/home';
import About from './pages/About';
import Pricing from './pages/Pricing';
import Partners from './pages/Partners';
import Blog from './pages/Blog';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Waitlist from './pages/Waitlist';
import Error from './pages/Error';
import InterviewRoom from './pages/Interview_Room';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import MandayMatrix from './components/MandayMatrix';

function App() {
  const activeClassName = "nav_active";

  return (
    <>
      <BrowserRouter>
        <header>
          <nav className="top-menu">
            <div className="logo">
              <h1>IREAD</h1>
            </div>
            <ul className="nav-links">
              <li>
                <NavLink to="/interview" className={({ isActive }) => isActive ? activeClassName : undefined}>
                  บอทสัมภาษณ์
                </NavLink>
              </li>
              <li>
                <NavLink to="/" className={({ isActive }) => isActive ? activeClassName : undefined}>
                  หน้าแรก
                </NavLink>
              </li>
              <li>
                <NavLink to="/about" className={({ isActive }) => isActive ? activeClassName : undefined}>
                  เกี่ยวกับเรา
                </NavLink>
              </li>
              <li>
                <NavLink to="/pricing" className={({ isActive }) => isActive ? activeClassName : undefined}>
                  ราคา
                </NavLink>
              </li>
              <li>
                <NavLink to="/partners" className={({ isActive }) => isActive ? activeClassName : undefined}>
                  พาร์ทเนอร์
                </NavLink>
              </li>
              <li>
                <NavLink to="/blog" className={({ isActive }) => isActive ? activeClassName : undefined}>
                  บล็อก
                </NavLink>
              </li>
              <li>
                <NavLink to="/manday-matrix" className={({ isActive }) => isActive ? activeClassName : undefined}>
                  Manday Matrix
                </NavLink>
              </li>
              <li className="dropdown">
                <NavLink to="/legal" className={({ isActive }) => isActive ? activeClassName : undefined}>
                  กฎหมาย
                </NavLink>
                <ul className="dropdown-menu">
                  <li>
                    <NavLink to="/privacy" className={({ isActive }) => isActive ? activeClassName : undefined}>
                      Privacy Policy
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/terms" className={({ isActive }) => isActive ? activeClassName : undefined}>
                      Terms of Service
                    </NavLink>
                  </li>
                </ul>
              </li>
            </ul>
            <div className="actions">
              <button className="language-switch">TH / EN</button>
              <NavLink to="/waitlist">
                <button className="start-button">เริ่มต้นใช้งาน</button>
              </NavLink>
              <NavLink to="/login">
                <button className="start-button">Login</button>
              </NavLink>
            </div>
          </nav>
        </header>
        <Routes>
          <Route path="/interview" element={<InterviewRoom />} />
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/waitlist" element={<Waitlist />} />
          <Route path="*" element={<Error />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/manday-matrix" element={<MandayMatrix />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
