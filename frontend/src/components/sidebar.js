import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaLeaf, FaTachometerAlt, FaTrophy, FaSignOutAlt, FaUserCircle, FaTree } from 'react-icons/fa';

const Sidebar = ({ userId, setUserId, user }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        setUserId(null);
        navigate('/');
    };

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
                <div className="stat-item">
                    <FaLeaf style={{ color: '#4CAF50' }} />
                    <span>Your Points</span>
                    <strong>{user ? user.points : '...'}</strong>
                </div>

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
                <div className="user-avatar">
                    <div className="user-avatar">
                        {user?.profilePicUrl ? (
                            <img src={user.profilePicUrl} alt="avatar" />
                        ) : (
                            <FaUserCircle size={40} />
                        )}
                    </div>{userInitial}</div>
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