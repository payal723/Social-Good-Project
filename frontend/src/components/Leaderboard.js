// src/components/Leaderboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrophy } from 'react-icons/fa';
import './Leaderboard.css'; // We will create this CSS file next

const Leaderboard = () => {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/users/leaderboard');
                setLeaders(res.data);
            } catch (error) {
                console.error("Failed to fetch leaderboard", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    if (loading) {
        return <div className="card"><h2>Loading Leaderboard...</h2></div>;
    }

    return (
        <div className="card leaderboard-card">
            <div className="card-header">
                <h2><FaTrophy /> Leaderboard</h2>
            </div>
            <table className="leaderboard-table">
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>User</th>
                        <th>Points</th>
                    </tr>
                </thead>
                <tbody>
                    {leaders.map((user, index) => (
                        <tr key={user._id}>
                            <td>
                                <span className={`rank rank-${index + 1}`}>{index + 1}</span>
                            </td>
                            <td>{user.username}</td>
                            <td>{user.points}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Leaderboard;