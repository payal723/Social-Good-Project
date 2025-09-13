// src/components/Sidebar.js
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
// FaTree आइकन को इम्पोर्ट करें
import { FaLeaf, FaTachometerAlt, FaTrophy, FaSignOutAlt, FaUserCircle, FaTree } from 'react-icons/fa';

const Sidebar = ({ userId, setUserId, user }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        setUserId(null);
        navigate('/');
    };

    // यूजर के नाम का पहला अक्षर, अगर यूजर मौजूद है
    const userInitial = user ? user.username.charAt(0).toUpperCase() : '?';

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <FaLeaf className="logo" />
                <h1>EcoHub<br /><span>Environmental Action Community</span></h1>
            </div>
            
            <nav className="sidebar-nav">
                <div className="sidebar-section-title">Navigate</div>
                <ul>
                    <li><NavLink to="/"><FaTachometerAlt /> Dashboard</NavLink></li>
                    <li><NavLink to="/leaderboard"><FaTrophy /> Leaderboard</NavLink></li>
                </ul>
            </nav>

            <div className="sidebar-section-title">Impact Stats</div>
            <div className="impact-stats">
                {/* Stats अब user prop से आ रहे हैं */}
                <div className="stat-item">
                    <FaLeaf style={{ color: '#4CAF50' }} />
                    <span>Your Points</span>
                    <strong>{user ? user.points : '...'}</strong>
                </div>

                {/* --- नया सुधार: लगाए गए पेड़ों की संख्या दिखाएं --- */}
                <div className="stat-item">
                    <FaTree style={{ color: '#66BB6A' }} />
                    <span>Trees Planted</span>
                    <strong>{user ? user.treesPlanted : '...'}</strong>
                </div>

                 <div className="stat-item">
                    <FaTrophy style={{ color: '#FFC107' }} />
                    <span>Badges</span>
                    <strong>{user ? user.badges.length : '0'}</strong>
                </div>
            </div>

            <div className="user-profile">
                <div className="user-avatar">{userInitial}</div>
                <div className="user-info">
                    <h4>{user ? user.username : 'Loading...'}</h4>
                    <p>Making a difference!</p>
                </div>
                 <button onClick={handleLogout} className="logout-btn" title="Logout">
                    <FaSignOutAlt />
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;