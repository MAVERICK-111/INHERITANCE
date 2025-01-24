import React from 'react';
import './Timeline.css'; // Optional: Add CSS styling

const Timeline = ({ notices }) => {
    return (
        <div className="timeline">
            {notices.map((notice, index) => (
                <div className="timeline-item" key={index}>
                    <div className="timeline-date">{new Date(notice.date).toLocaleDateString()}</div>
                    <div className="timeline-content">
                        {notice.image && (
                            <img
                                src={notice.image}
                                alt={notice.title}
                                className="timeline-image"
                            />
                        )}
                        <h3 className="timeline-title">{notice.title}</h3>
                        <p className="timeline-description">{notice.description}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Timeline;
