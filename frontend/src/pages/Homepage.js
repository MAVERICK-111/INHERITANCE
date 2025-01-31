import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";  
import './Homepage.css';

import { useAuth0 } from "@auth0/auth0-react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";


const Homepage = () => {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [usernames, setUsernames] = useState({});
  const { user } = useAuth0();

  // Fetch posts from backend
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/posts');
        setPosts(response.data);

        const usernamesData = {};
        for (const post of response.data) {
          const usernameResponse = await axios.get(`http://localhost:5000/api/users/getUsername/${post.auth0Id}`);
          usernamesData[post._id] = usernameResponse.data.username;
        }
        setUsernames(usernamesData);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    fetchPosts();
  }, []);

  // image upload
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // post submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!image || !caption) {
      alert('Please provide a caption and image.');
      return;
    }
  
    const formData = new FormData();
    formData.append('caption', caption);
    formData.append('image', image);
    formData.append('auth0Id', user.sub);
  
    try {
      const response = await axios.post('http://localhost:5000/api/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const postsResponse = await axios.get('http://localhost:5000/api/posts');
      setPosts(postsResponse.data);
      const newPost = response.data.post;
      const usernameResponse = await axios.get(`http://localhost:5000/api/users/getUsername/${newPost.auth0Id}`);
      setUsernames((prevUsernames) => ({
        ...prevUsernames,
        [newPost._id]: usernameResponse.data.username,
      }));
  
      setCaption('');
      setImage(null);
      setShowModal(false); 
      alert('Post uploaded successfully!');
    } catch (error) {
      console.error('Error uploading post:', error);
      alert('Failed to upload post.');
    }
  };  

  // Handle Like
  const handleLike = async (postId) => {
    const auth0Id = user.sub;
    const postIndex = posts.findIndex(post => post._id === postId);
    const currentPost = posts[postIndex];
    const updatedPost = { ...currentPost };
    if (updatedPost.likedBy.includes(auth0Id)) {
      updatedPost.likedBy = updatedPost.likedBy.filter(id => id !== auth0Id);
      updatedPost.likes -= 1;
    } else {
      updatedPost.likedBy.push(auth0Id);
      updatedPost.likes += 1;
    }
    setPosts((prevPosts) => {
      const newPosts = [...prevPosts];
      newPosts[postIndex] = updatedPost;
      return newPosts;
    });
    try {
      await axios.patch(`http://localhost:5000/api/posts/${postId}/like`, { auth0Id });
    } catch (error) {
      console.error('Error liking/unliking the post:', error);
      alert('An error occurred while updating the like.');
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
            <Link to="/AMA" className="LinkWrapper">
              <div className="AMA">
                AMA
              </div>
            </Link>
            <Link to="/Hobbies" className="LinkWrapper">
              <div className="Hobbies">
                Hobbies
              </div>
            </Link>
            <Link to="/Alumni" className="LinkWrapper">
              <div className="Alumni">
                Alumni
              </div>
            </Link>
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
                <button className="CancelButton" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </div>
          )}

          {/* Display posts */}
          {/* <div className="PostList">
            <h3>All Posts</h3>
            {posts.map((post) => (
              <div key={post._id} className="Post">
                <p>{usernames[post._id]}</p>
                <img src={post.imageUrl} alt="Post" className="PostImage" />
                <p>{post.caption}</p>
                <div className="LikeSection">
                  <div
                    className={`heart ${post.likedBy.includes(user.sub) ? "liked" : ""}`}
                    onClick={() => handleLike(post._id)}
                  >
                    {post.likedBy.includes(user.sub) ? <AiFillHeart /> : <AiOutlineHeart />}
                  </div>
                  <span>{post.likes} Likes</span>
                </div>
              </div>
            ))}
          </div> */}
          <div className="PostList">
            <h3>All Posts</h3>
            {posts.map((post) => (
              <div key={post._id} className="Post">
                {/* <div className="PostHeader">
                  <p>By {usernames[post._id]}</p>
                </div> */}
                <div className="PostHeader">
                  <Link to={`/viewprofile/${post.auth0Id}`}>
                    <strong>By {usernames[post._id]}</strong>
                  </Link>
                </div>
                <div className="PostBody">
                  <img src={post.imageUrl} alt="Post" className="PostImage" />
                </div>
                <div className="PostFooter">
                  {/* Like section with heart and count */}
                  <div className="LikeSection">
                    <div
                      className={`heart ${post.likedBy.includes(user.sub) ? "liked" : ""}`}
                      onClick={() => handleLike(post._id)}
                    >
                      {post.likedBy.includes(user.sub) ? <AiFillHeart /> : <AiOutlineHeart />}
                    </div>
                    <span>{post.likes} Likes</span>
                  </div>
                  {/* Centered Caption */}
                  <p className="Caption">{post.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="Right_section">
          <div className="Right_container">
            <Link to="/Messages" className="LinkWrapper">
              <div className="Messages">
                Messages
              </div>
            </Link>
            <Link to="/Noticeboard" className="LinkWrapper">
              <div className="Noticeboard">
                Noticeboard
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;