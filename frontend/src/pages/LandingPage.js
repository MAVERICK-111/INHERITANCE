import React from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";


const Landingpage = () =>{
    return (
        <div className="landingpage">
            <div className="top">

                <div className="landingheader">
                    <h2>AboutUs Contactus Reportissue</h2>
                </div>

                <div className="mainbox">
                    <div className="loginbox">
                        <Link to= "">login
                        </Link>
                        
                    </div>
                </div>

            </div>

            <div className="bottom">

            </div>


            <div className="homepage">
            <Link to="/homepage">AMA</Link>
            </div>
        </div>
    )
}
export default Landingpage