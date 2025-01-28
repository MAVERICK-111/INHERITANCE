import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  // Loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // If the user is not authenticated
  if (!isAuthenticated) {
    return <div>Please log in to view your profile.</div>;
  }

  // Display user information
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Welcome, {user.name}</h2>
      <img
        src={user.picture}
        alt="Profile"
        style={{
          borderRadius: '50%',
          width: '150px',
          height: '150px',
          marginBottom: '10px'
        }}
      />
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>User ID:</strong> {user.sub}</p> {/* User ID */}
    </div>
  );
};

export default Profile;
