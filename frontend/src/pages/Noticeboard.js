import React, { useEffect, useState } from 'react';
import Timeline from '../components/Timeline';
import './Noticeboard.css';
import logo from './vjti_logo.png';

const Noticeboard = () => {
    const [notices, setNotices] = useState([]);
    const [newNotice, setNewNotice] = useState({ title: '', description: '', image: '' });
    const [isModalOpen, setIsModalOpen] = useState(false);
    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/notices`)
            .then((res) => res.json())
            .then((data) => setNotices(data))
            .catch((err) => console.error(err));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/notices`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newNotice),
        })
            .then((res) => res.json())
            .then((data) => {
                setNotices((prev) => [data, ...prev]);
                setNewNotice({ title: '', description: '', image: '' });
                setIsModalOpen(false);
            })
            .catch((err) => console.error(err));
    };

    return (
        <div className="noticeboard-container">
            <img src={logo} alt="College Logo" className="logo-img" /> 
            
            <div className='heading-notice'>
            <h1 className="noticeboard-title">Noticeboard</h1>
            </div>
            <button onClick={() => setIsModalOpen(true)} className="add-notice-button">
                Add Notice
            </button>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Add a Notice</h2>
                        <form onSubmit={handleSubmit} className="notice-form">
                            <input
                                type="text"
                                placeholder="Title"
                                value={newNotice.title}
                                onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                                required
                            />
                            <textarea
                                placeholder="Description"
                                value={newNotice.description}
                                onChange={(e) => setNewNotice({ ...newNotice, description: e.target.value })}
                                required
                            ></textarea>
                            <input
                                type="text"
                                placeholder="Image URL (optional)"
                                value={newNotice.image}
                                onChange={(e) => setNewNotice({ ...newNotice, image: e.target.value })}
                            />
                            <button type="submit">Add Notice</button>
                        </form>
                        <button onClick={() => setIsModalOpen(false)} className="close-modal-button">
                            Close
                        </button>
                    </div>
                </div>
            )}
            <Timeline notices={notices} />
        </div>
    );
};

export default Noticeboard;
