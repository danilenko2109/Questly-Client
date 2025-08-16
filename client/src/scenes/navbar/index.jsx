import { useState, useRef, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setMode, setLogout } from 'state';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  FiSun, 
  FiMoon,
  FiMessageSquare,
  FiBell,
  FiLogOut,
  FiSettings,
  FiHelpCircle
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { themeSettings } from '../../theme';
import './Navbar.scss';

const Navbar = () => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(state => state.user);
  const mode = useSelector(state => state.mode);
  
  const theme = useMemo(() => themeSettings(mode), [mode]);
  const palette = theme.palette;
  const isDark = mode === 'dark';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => dispatch(setMode());
  const handleLogout = () => {
    dispatch(setLogout());
    navigate('/auth');
  };

  const themeStyles = useMemo(() => ({
    '--bg-color': palette.background.default,
    '--bg-alt': palette.background.alt,
    '--text-primary': palette.neutral.main,
    '--text-secondary': palette.neutral.medium,
    '--primary-color': palette.primary.main,
    '--primary-dark': palette.primary.dark,
    '--primary-light': palette.primary.light,
    '--hover-color': isDark ? palette.primary.light : palette.primary.dark,
    '--shadow-color': isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)',
    '--divider-color': palette.divider
  }), [palette, isDark]);

  const navItems = [
    { path: '/home', icon: <FiMessageSquare size={20} />, label: 'Feed' },
    { path: '/notifications', icon: <FiBell size={20} />, label: 'Notifications' }
  ];

  return (
    <nav className="navbar" style={themeStyles}>
      <div className="navbar__container">
        <motion.div
          className="navbar__logo"
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
          <NavLink to="/home" className="navbar__logo-link">Questly</NavLink>
        </motion.div>

        {/* <div className="navbar__links">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `navbar__link ${isActive ? 'navbar__link--active' : ''}`
              }
            >
              <span className="navbar__link-icon">{item.icon}</span>
              <span className="navbar__link-label">{item.label}</span>
            </NavLink>
          ))}
        </div> */}

        <div className="navbar__controls">
          <button 
            className="navbar__theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          >
            {isDark ? (
              <FiSun className="navbar__theme-icon" />
            ) : (
              <FiMoon className="navbar__theme-icon" />
            )}
          </button>

          <div className="navbar__user-menu" ref={userMenuRef}>
            <button 
              className="navbar__user-avatar"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              aria-expanded={userMenuOpen}
            >
              {user.firstName?.[0]}{user.lastName?.[0]}
            </button>
            
            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  className="navbar__user-dropdown"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="navbar__user-info">
                    <div className="navbar__user-avatar-large">
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </div>
                    <div className="navbar__user-details">
                      <h4 className="navbar__user-name">
                        {`${user.firstName} ${user.lastName}`}
                      </h4>
                      <p className="navbar__user-email">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="navbar__divider"></div>
                  
                  <NavLink 
                    to="/settings" 
                    className="navbar__menu-item"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <FiSettings className="navbar__menu-icon" /> 
                    <span>Settings</span>
                  </NavLink>
                  
                  <NavLink 
                    to="/help" 
                    className="navbar__menu-item"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <FiHelpCircle className="navbar__menu-icon" /> 
                    <span>Help</span>
                  </NavLink>
                  
                  <div className="navbar__divider"></div>
                  
                  <button 
                    className="navbar__menu-item navbar__menu-item--logout"
                    onClick={handleLogout}
                  >
                    <FiLogOut className="navbar__menu-icon" /> 
                    <span>Log Out</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;