// src/components/LogActionModal.js

import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import toast from 'react-hot-toast';
import './Modal.css';

Modal.setAppElement('#root');

const LogActionModal = ({ modalIsOpen, closeModal, userId, onActionLogged }) => {
    const [type, setType] = useState('tree-planting');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [date, setDate] = useState('');
    // 'impact' को हटाकर उसकी जगह 'impactValue' का इस्तेमाल किया गया है
    const [impactValue, setImpactValue] = useState('');

    const resetForm = () => {
        setType('tree-planting');
        setTitle('');
        setDescription('');
        setLocation('');
        setDate('');
        setImpactValue('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // बेसिक वैलिडेशन: खाली फील्ड्स को चेक करें
        if (!title.trim() || !description.trim() || !location.trim() || !date || !impactValue) {
            toast.error('Please fill all required fields.');
            return;
        }

        const toastId = toast.loading('Logging your action...');

        // पेलोड को सही तरीके से बनाएं
        const payload = {
            organizerId: userId, // <<< --- मुख्य सुधार: 'organizer' को 'organizerId' में बदला गया
            type,
            title: title.trim(),
            description: description.trim(),
            location: location.trim(),
            date: new Date(date),
            // टाइप के आधार पर सही फील्ड सेट करें
            treesPlanted: type === 'tree-planting' ? parseInt(impactValue, 10) : 0,
            wasteCleaned: type === 'cleanup' ? parseFloat(impactValue) : 0
        };

        try {
            await axios.post('http://localhost:5000/api/activities/create', payload);
            toast.success('Action logged successfully!', { id: toastId });

            resetForm();      // फॉर्म को रीसेट करें
            onActionLogged(); // डैशबोर्ड और साइडबार को रिफ्रेश करें
            closeModal();     // मॉडल को बंद करें
        } catch (err) {
            const msg = err.response?.data?.message || "Couldn't log action.";
            toast.error(msg, { id: toastId });
        }
    };

    return (
        <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            className="modal"
            overlayClassName="overlay"
        >
            <h2>Log New Action</h2>

            <form onSubmit={handleSubmit} noValidate>
                <label htmlFor="type">Action Type: *</label>
                <select
                    id="type"
                    value={type}
                    onChange={(e) => {
                        setType(e.target.value);
                        setImpactValue(''); // टाइप बदलने पर इम्पैक्ट वैल्यू रीसेट करें
                    }}
                    required
                >
                    <option value="tree-planting">Tree Planting</option>
                    <option value="cleanup">Waste Cleanup</option>
                    <option value="water-saving">Water Saving</option>
                    <option value="awareness-campaign">Awareness Campaign</option>
                </select>

                <label htmlFor="title">Title: *</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Weekend Tree Drive"
                    required
                />

                <label htmlFor="description">Description: *</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your environmental action"
                    rows="3"
                    required
                />

                <label htmlFor="location">Location: *</label>
                <input
                    type="text"
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Where did this take place?"
                    required
                />

                <label htmlFor="date">Date: *</label>
                <input
                    type="date"
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />

                {type === 'tree-planting' && (
                    <>
                        <label htmlFor="impactValue">Number of Trees Planted: *</label>
                        <input
                            type="number"
                            id="impactValue"
                            value={impactValue}
                            onChange={(e) => setImpactValue(e.target.value)}
                            placeholder="e.g., 50"
                            min="1"
                            required
                        />
                    </>
                )}

                {type === 'cleanup' && (
                    <>
                        <label htmlFor="impactValue">Waste Cleaned (in KG): *</label>
                        <input
                            type="number"
                            id="impactValue"
                            value={impactValue}
                            onChange={(e) => setImpactValue(e.target.value)}
                            placeholder="e.g., 10.5"
                            min="0.1"
                            step="0.1"
                            required
                        />
                    </>
                )}


                <div className="modal-buttons">
                    <button type="button" onClick={closeModal} className="btn-secondary">
                        Cancel
                    </button>
                    <button type="submit" className="btn-primary">
                        Log Action
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default LogActionModal;

