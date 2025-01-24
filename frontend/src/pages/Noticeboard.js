import React, { useEffect, useState } from 'react';
import Timeline from '../components/Timeline';

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
                setNotices((prev) => [data, ...prev]); // Add the new notice to the list
                setNewNotice({ title: '', description: '', image: '' });
            })
            .catch((err) => console.error(err));
    };

    return (
        <div>
            <h1>Noticeboard</h1>
            <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
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
                />
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
