// src/App.js
import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';

import Sidebar from './components/sidebar';
import Dashboard from './components/Dashboard';
import Leaderboard from './components/Leaderboard';
import AuthPage from './components/AuthPage';
import './index.css';

function App() {
    const [userId, setUserId] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchUserData = useCallback(async () => {
        if (userId) {
            setLoading(true);
            try {
                const res = await axios.get(`http://localhost:5000/api/users/${userId}`);
                setUser(res.data);
            } catch (error) {
                toast.error("Session expired. Please log in again.");
                setUserId(null);
            } finally {
                setLoading(false);
            }
        }
    }, [userId]);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    if (loading) {
        return <div className="loading-screen">Loading EcoHub...</div>;
    }
    
    return (
        <Router>
            <Toaster position="top-center" reverseOrder={false} />
            <div className="app-layout">
                {userId && <Sidebar user={user} setUserId={setUserId} />}
                <main className="main-content">
                    <Routes>
                        <Route path="/login" element={!userId ? <AuthPage setUserId={setUserId} /> : <Navigate to="/" />} />
                        {/* --- Dashboard  refresh function --- */}
                        <Route path="/" element={userId ? <Dashboard userId={userId} onActionLogged={fetchUserData} /> : <Navigate to="/login" />} />
                        <Route path="/leaderboard" element={userId ? <Leaderboard /> : <Navigate to="/login" />} />
                        <Route path="*" element={<Navigate to={userId ? "/" : "/login"} />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;