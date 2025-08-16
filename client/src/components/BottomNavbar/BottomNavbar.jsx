import { NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { themeSettings } from "../../theme";
import { 
  FiHome,
  FiSearch,
  FiAward,
  FiUser
} from "react-icons/fi";
import { motion } from "framer-motion";
import './BottomNavbar.scss';

const BottomNavbar = () => {
  const location = useLocation();
  const mode = useSelector(state => state.mode);
  const theme = themeSettings(mode);
  const palette = theme.palette;
  const currentUser = useSelector((state) => state.user); // Get the whole user object
  const currentUserId = currentUser?._id || null; // Safe access with optional chaining

  const navItems = [
    { path: "/home", icon: <FiHome size={24} />, label: "Home" },
    { path: "/search", icon: <FiSearch size={24} />, label: "Search" },
    { path: "/challenges", icon: <FiAward size={24} />, label: "Challenges" },
    // Only include profile if user is logged in
    ...(currentUserId ? [
      { path: `/profile/${currentUserId}`, icon: <FiUser size={24} />, label: "Profile" }
    ] : [])
  ];

  // Safe hex to rgb conversion
  const hexToRgb = (hex) => {
    if (!hex) return '0, 0, 0'; // Default fallback
    
    try {
      hex = hex.replace(/^#/, '');
      
      if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
      }
      
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      
      return `${r}, ${g}, ${b}`;
    } catch {
      return '0, 0, 0'; // Fallback if conversion fails
    }
  };

  // Safe theme styles with fallbacks
  const themeStyles = {
    '--bg-color': hexToRgb(palette?.background?.default),
    '--bg-alt': hexToRgb(palette?.background?.alt),
    '--primary-color': palette?.primary?.main || '#1976d2',
    '--primary-dark': palette?.primary?.dark || '#1565c0',
    '--active-color': palette?.primary?.main || '#1976d2',
    '--inactive-color': palette?.neutral?.medium || '#9e9e9e',
    '--divider-color': mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    '--shadow-color': mode === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)',
  };

  // Don't render navbar if no items (user not logged in and no other routes)
  if (navItems.length === 0) return null;

  return (
    <motion.nav 
      className="bottom-navbar"
      style={themeStyles}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {navItems.map((item) => {
        // Special handling for profile path matching
        const isProfilePath = item.path.startsWith('/profile');
        const isActive = location.pathname === item.path || 
                        (isProfilePath && location.pathname.startsWith('/profile'));
        
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={`nav-link ${isActive ? 'active' : ''}`}
          >
            <div className="nav-icon">{item.icon}</div>
            <span className="nav-text">{item.label}</span>
          </NavLink>
        );
      })}
    </motion.nav>
  );
};

export default BottomNavbar;