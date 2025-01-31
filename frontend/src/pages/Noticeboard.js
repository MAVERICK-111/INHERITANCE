import React, { useEffect, useState } from 'react';
import Timeline from '../components/Timeline';
import './Noticeboard.css'; // Import the CSS file for styling

const Noticeboard = () => {
    const [notices, setNotices] = useState([]);
    const [newNotice, setNewNotice] = useState({ title: '', description: '', image: '' });

    useEffect(() => {
        fetch('http://localhost:5000/api/notices')
            .then((res) => res.json())
            .then((data) => setNotices(data))
            .catch((err) => console.error(err));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('http://localhost:5000/api/notices', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newNotice),
        })
            .then((res) => res.json())
            .then((data) => {
                setNotices((prev) => [data, ...prev]);
                setNewNotice({ title: '', description: '', image: '' });
            })
            .catch((err) => console.error(err));
    };

    return (
        <div className="noticeboard-container">
            <h1 className="noticeboard-title">Noticeboard</h1>
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
            <Timeline notices={notices} />
        </div>
    );
};

export default Noticeboard;
