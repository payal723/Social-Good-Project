// src/components/EventList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCalendarAlt } from 'react-icons/fa';

const EventList = ({ userId }) => {
    const [activities, setActivities] = useState([]);

    const fetchActivities = () => {
        axios.get('http://localhost:5000/api/activities')
            .then(res => {
                setActivities(res.data);
            })
            .catch(err => console.error("Error fetching activities:", err));
    };

    // useEffect runs once when the component loads
    useEffect(() => {
        fetchActivities();
    }, []);

    const handleJoin = (activityId) => {
        if (!userId) {
            alert("You must be logged in to join an event.");
            return;
        }

        axios.post('http://localhost:5000/api/activities/join', { activityId, userId })
            .then(response => {
                alert('Successfully joined the event! +10 points awarded.');
                // In a real app, you'd update the state more gracefully
                // For now, we reload the page to see the point change in the sidebar
                window.location.reload(); 
            })
            .catch(err => {
                alert('Failed to join the event.');
                console.error("Error joining activity:", err);
            });
    };

    return (
        <div className="card">
            <div className="card-header">
                <h2><FaCalendarAlt /> Upcoming Events</h2>
            </div>
            <div className="event-list">
                {activities.length > 0 ? (
                    activities.map(activity => (
                        <div className="event-item" key={activity._id}>
                            <h4>{activity.title}</h4>
                            <p>Organized by: {activity.organizer?.username || 'Admin'}</p>
                            <p>{new Date(activity.date).toLocaleDateString()}</p>
                            <button className="view-all-btn" style={{marginTop: "10px"}} onClick={() => handleJoin(activity._id)}>
                                Join Event
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No upcoming events at the moment.</p>
                )}
            </div>
        </div>
    );
};

export default EventList;