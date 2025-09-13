// src/components/ActionCard.js

import React, { memo } from 'react';
import { FaCalendar, FaUsers, FaHeart } from 'react-icons/fa';
import { format, parseISO } from 'date-fns';
import ShareButtons from './ShareButtons'; 
const ActionCard = memo(({ action, userId, onLike }) => {
    const { _id, title, description, type, organizer, date, treesPlanted, wasteCleaned, likes } = action;

    const isLiked = likes.includes(userId);

    const getImpactText = () => {
        if (type === 'tree-planting' && treesPlanted > 0) return `🌱 ${treesPlanted} trees planted`;
        if (type === 'cleanup' && wasteCleaned > 0) return `♻️ ${wasteCleaned} kg waste cleaned`;
        return null;
    };

    return (
        <div className={`action-card ${type}`}>
            <div className="card-header">
                <h4>{title}</h4>
                <span className={`badge ${type}`}>{type.replace('-', ' ')}</span>
            </div>
            
            <p className="description">{description}</p>
            
            {getImpactText() && (
                <div className="impact-badge">{getImpactText()}</div>
            )}
            
            {/* --- --- */}
            <div className="card-footer-wrapper">
                <div className="card-footer">
                    <div className="meta">
                        <FaUsers />
                        <span>{organizer?.username || 'Unknown'}</span>
                        <span style={{ margin: '0 8px' }}>•</span>
                        <FaCalendar />
                        <span>{format(parseISO(date), 'MMM dd, yyyy')}</span>
                    </div>
                    
                    <div className="like-section">
                        <button 
                            className={`like-button ${isLiked ? 'liked' : ''}`} 
                            onClick={() => onLike(_id)}
                        >
                            <FaHeart />
                        </button>
                        <span>{likes.length}</span>
                    </div>
                </div>

                <ShareButtons title={title} actionId={_id} />
            </div>
        </div>
    );
});

export default ActionCard;