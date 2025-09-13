

import { Toaster, toast } from 'react-hot-toast';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { FaUsers, FaTasks, FaPlusCircle, FaLeaf, FaTrash } from 'react-icons/fa';

import ActionCard from './ActionCard.js'; 
import LogActionModal from './LogActionModal';
import './Dashboard.css';

// Custom hook for data fetching
const useActivityData = (userId) => {
  const [communityFeed, setCommunityFeed] = useState([]);
  const [myActions, setMyActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const [communityRes, myActionsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/activities/community-feed'),
        axios.get(`http://localhost:5000/api/activities/user/${userId}`)
      ]);
      setCommunityFeed(communityRes.data);
      setMyActions(myActionsRes.data);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load activities');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { communityFeed, myActions, loading, error, refetch: fetchData };
};

const StatsCard = ({ title, value, icon, color }) => (
  <div className="stats-card" style={{ '--accent-color': color }}>
    <div className="stats-icon">{icon}</div>
    <div className="stats-content">
      <h3>{value}</h3>
      <p>{title}</p>
    </div>
  </div>
);

const Dashboard = ({ userId, onActionLogged }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { communityFeed, myActions, loading, error, refetch } = useActivityData(userId);

  const stats = useMemo(() => ({
    totalActions: myActions.length,
    treesPlanted: myActions.reduce((sum, a) => sum + (a.treesPlanted || 0), 0),
    wasteCleaned: myActions.reduce((sum, a) => sum + (a.wasteCleaned || 0), 0),
    communityActions: communityFeed.length
  }), [myActions, communityFeed]);

  const handleActionLogged = useCallback(() => {
    refetch();
    onActionLogged();
  }, [refetch, onActionLogged]);
  
  const handleLike = async (activityId) => {
    try {
      await axios.post(`http://localhost:5000/api/activities/${activityId}/like`, { userId });
      refetch();
    } catch (err) {
      toast.error("Couldn't update like. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading your eco-impact...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <p>Failed to load dashboard data</p>
        <button onClick={refetch}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Toaster position="top-center" />
      
      <LogActionModal 
        modalIsOpen={modalIsOpen} 
        closeModal={() => setModalIsOpen(false)} 
        userId={userId}
        onActionLogged={handleActionLogged} 
      />

      <div className="dashboard-header">
        <div>
          <h1>My Eco Dashboard</h1>
          <p>Track your environmental impact</p>
        </div>
        <button className="cta-button" onClick={() => setModalIsOpen(true)}>
          <FaPlusCircle /> Log New Action
        </button>
      </div>

      <div className="stats-grid">
        <StatsCard title="My Actions" value={stats.totalActions} icon={<FaTasks />} color="#4CAF50" />
        <StatsCard title="Trees Planted" value={stats.treesPlanted} icon={<FaLeaf />} color="#66BB6A" />
        <StatsCard title="Waste Cleaned" value={`${stats.wasteCleaned} kg`} icon={<FaTrash />} color="#FF9800" />
        <StatsCard title="Community Actions" value={stats.communityActions} icon={<FaUsers />} color="#2196F3" />
      </div>

      <div className="activities-grid">
        <div className="feed-section">
          <h2><FaUsers /> Community Feed</h2>
          <div className="actions-list">
            {communityFeed.length === 0 ? (
              <div className="empty-state"><p>No community actions yet. Be the first to inspire others!</p></div>
            ) : (
              communityFeed.map(action => (
                <ActionCard 
                    key={action._id} 
                    action={action} 
                    userId={userId}
                    onLike={handleLike}
                />
              ))
            )}
          </div>
        </div>

        <div className="feed-section">
          <h2><FaTasks /> My Actions</h2>
          <div className="actions-list">
            {myActions.length === 0 ? (
              <div className="empty-state">
                <p>You haven't logged any actions yet.</p>
                <button className="link-button" onClick={() => setModalIsOpen(true)}>Log your first action</button>
              </div>
            ) : (
              myActions.map(action => (
                <ActionCard 
                    key={action._id} 
                    action={action} 
                    userId={userId}
                    onLike={handleLike}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;