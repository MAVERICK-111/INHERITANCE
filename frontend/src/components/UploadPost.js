import React, { useState } from 'react';
import axios from 'axios';

const UploadPost = () => {
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState(null);

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!image || !caption) {
            alert('Please add a caption and an image.');
            return;
        }

        const formData = new FormData();
        formData.append('image', image);
        formData.append('caption', caption);

        try {
            // Assuming your backend accepts the image via a POST route
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/posts`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            alert('Post uploaded successfully');
            setCaption('');
            setImage(null);
        } catch (err) {
            console.error(err);
            alert('Error uploading post');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Write a caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
            />
            <input type="file" onChange={handleImageChange} />
            <button type="submit">Upload Post</button>
        </form>
    );
};

export default UploadPost;
