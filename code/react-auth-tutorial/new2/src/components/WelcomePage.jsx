import homeStyle from '../design/homepageStyle.css';
import eagleLogo from '../design/Assests/Morehead_State_Eagles_logo.svg.png';
import { useNavigate } from 'react-router-dom';
import React from "react";

const WelcomePage = () => {

    const navigate = useNavigate();
    

    return (
        

            <body>
                <header>
                    <nav class="navigationHeader">

                        <div class="logo">
                            <img src={eagleLogo} style={homeStyle} alt="Eagle Logo" class="logo-image"
                                EAGLE CONNECT></img>
                        </div>

                        <ul class="navigation-links">
                            <li><a href="/login">Home</a></li>
                            <li><a href="#">About</a></li>
                            <li><button class="get-started" onClick={() => navigate("/sign-up")}>Get Started</button></li>
                        </ul>
                    </nav>
                </header>

                <main>
                    <section class="main-display">
                        <h1>Welcome to Eagle Connect</h1>
                        <p>Connect with colleagues today</p>
                    </section>
                </main>

            </body>


        
    );
};

export default WelcomePage;