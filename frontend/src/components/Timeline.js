import React from 'react';
import './Timeline.css';

const Timeline = ({ notices }) => {
    return (
        <div className="timeline-container">
            {notices.map((notice, index) => (
                <div
                    className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}
                    key={index}
                >
                    <div className="timeline-content">
                        <div className="timeline-date">{new Date(notice.date).toLocaleDateString()}</div>
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
