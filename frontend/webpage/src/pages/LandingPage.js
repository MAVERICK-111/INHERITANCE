import React from "react";
import { Link } from "react-router-dom";
import './Page.css'; 


const LandingPage = () => {
  return (
    <div>
      <div className="Landing_page">

        

        <div className="Left_section">

          <div className="Left_container">
            <div className="AMA">
              <Link to="/AMA">AMA</Link>
            </div>
            <div className="Hobbies">
              <Link to="/Hobbies">Hobbies</Link>
            </div>
            <div className="Alumni">
              <Link to="/Alumni">Alumni</Link>

            </div>
            <div className="Leaderboard">
              <Link to="/Leaderboard">Leaderboard</Link>

            </div>
            <div className="Request">
              <Link to="/Request">Request</Link>
 
            </div>         
          </div>
        </div>



        



        <div className="Center_section">
          {/* <Link to="/home">Go to Home Page</Link>  */}
          <div className="Post">
            Yo chat

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

export default LandingPage;
