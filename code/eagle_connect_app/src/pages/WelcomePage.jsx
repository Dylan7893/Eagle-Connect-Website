import homeStyle from "../design/homepageStyle.css";
import eagleLogo from "../design/logo.png";
import { useNavigate } from "react-router-dom";
import React from "react";

const WelcomePage = () => {
  const navigate = useNavigate();

  const navigateClick = () => {
    navigate("/app");
  };

  return (
    <>
      <header>
        <nav class="navigationHeader">
          <div class="logo">
            <img
              src={eagleLogo}
              alt="Eagle Logo"
              class="logo-image"
              EAGLE
              CONNECT
            ></img>
          </div>

          <ul class="navigation-links">
            <li>
              <a href="/about">About</a>
            </li>
            <li>
              <button class="get-started" onClick={navigateClick}>
                Get Started
              </button>
            </li>
          </ul>
        </nav>
      </header>

      <main>
        <section class="main-display">
          <h1>Welcome to Eagle Connect</h1>
          <p>Connect with colleagues today</p>
        </section>
      </main>
    </>
  );
};

export default WelcomePage;
