import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";  // To make API calls
import './Homepage.css';
import AMAImage from './amalogo.png';
import AlumniImage from './alumnilogo.png';
import HobbyImage from './hobbieslogo.png';


const Homepage = () => {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false); // Modal visibility state

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
  }, []); // Only fetch posts once when the component mounts

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
      setShowModal(false); // Close the modal after submission
      alert('Post uploaded successfully!');
    } catch (error) {
      console.error('Error uploading post:', error);
      alert('Failed to upload post.');
    }
  };

  // Close the modal when pressing the Esc key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowModal(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div>
      <div className="Landing_page">
        <div className="Left_section">
          <div className="Left_container">
            <div className="AMA">
              <Link to="/AMA">
              {/* <img src={AMAImage} alt="AMA" className="image-class" /> */}
              AMA
              </Link>
            </div>
            <div className="Hobbies">
              <Link to="/Hobbies">
              {/* <img src={HobbyImage} alt="Hobbies" className="image-class" /> */}
              Hobbies
              </Link>
            </div>
            <div className="Alumni">
              <Link to="/Alumni">
              {/* <img src={AlumniImage} alt="alumni" className="image-class" /> */}
              Alumni
              </Link>
            </div>
            
          </div>
        </div>

        <div className="Center_section">
          {/* Query bar asking if the user wants to post */}
          <div className="QueryBar">
            <p>Create a post..</p>
            <button onClick={() => setShowModal(true)}>+</button>
          </div>
          

          {/* Modal for uploading post */}
          {showModal && (
        <div className="Modal">
          <div className="ModalContent">
            <button className="CloseButton" onClick={() => setShowModal(false)}>X</button>
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
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
       </div>
      )}


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
