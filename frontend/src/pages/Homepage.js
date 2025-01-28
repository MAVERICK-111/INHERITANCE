import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";  // To make API calls
import './Homepage.css';
import AMAImage from './ama .jpeg';

const Homepage = () => {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [posts, setPosts] = useState([]);

  // Fetch posts from the backend
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/posts');
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    
    fetchPosts();
  }, [posts]); // Re-fetch posts whenever a new one is uploaded

  // Handle image upload
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Handle post submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image || !caption) {
      alert('Please provide a caption and image.');
      return;
    }

    const formData = new FormData();
    formData.append('caption', caption);
    formData.append('image', image);

    try {
      await axios.post('http://localhost:5000/api/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setCaption('');
      setImage(null);
      alert('Post uploaded successfully!');
    } catch (error) {
      console.error('Error uploading post:', error);
      alert('Failed to upload post.');
    }
  };

  return (
    <div>
      <div className="Landing_page">
        <div className="Left_section">
          <div className="Left_container">
            <div className="AMA">
              <Link to="/AMA">
                <img src={AMAImage} alt="AMA" className="image-class" />
              </Link>
            </div>
            <div className="Hobbies">
              <Link to="/Hobbies">Hobbies</Link>
            </div>
            <div className="Alumni">
              <Link to="/Alumni">Alumni</Link>
            </div>
            <div className="Posts">
              <Link to="/Posts">Posts</Link>
            </div>
          </div>
        </div>

        <div className="Center_section">
          {/* Post upload form */}
          <div className="PostUploadForm">
            <h3>Create a Post</h3>
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
          </div>

          {/* Display posts */}
          <div className="PostList">
            <h3>All Posts</h3>
            {posts.map((post) => (
              <div key={post._id} className="Post">
                <img src={post.imageUrl} alt="Post" className="PostImage" />
                <p>{post.caption}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="Right_section">
          <div className="Right_container">
            <div className="Messages">
              <Link to="/Messages">Messages</Link>
            </div>
            <div className="Noticeboard">
              <Link to="/Noticeboard">Noticeboard</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
