import React from 'react';

const ChallengeCard = () => {
    return (
        <div className="card challenge-card">
            <div className="card-header">
                <h2>Plant a Seed</h2>
                <span className="points">+20 pts</span>
            </div>
            <p>Plant any seed or sapling this week to earn points.</p>
            <button className="view-all-btn">View All Challenges</button>
        </div>
    );
};

export default ChallengeCard;