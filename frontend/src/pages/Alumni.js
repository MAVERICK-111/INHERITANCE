import React from "react";
import AlumniForm from "../components/AlumniForm"; // Import the form component
import "./Alumni.css";

function Alumni() {
  return (
    <div className="mainmost">
      <h1>Alumni Page</h1>
      <AlumniForm />  {/* Display the alumni form */}
    </div>
  );
}

export default Alumni;
