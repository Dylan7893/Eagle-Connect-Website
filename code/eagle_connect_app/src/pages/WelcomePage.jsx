//first page that is shown when user enters the app, from here they can go to the main app page, or the about page to get information about the app
import eagleLogo from "../design/logo.png";
import homepageStyle from "../design/homepageStyle.css";
import { useNavigate } from "react-router-dom";
import React from "react";

const WelcomePage = () => {
  const navigate = useNavigate();

  const navigateClick = () => {
    navigate("/app");
  };

  return (
    <>
      <link rel="stylesheet" href={homepageStyle} />
      <div className="home-body">
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
            <h1>WELCOME TO EAGLE CONNECT</h1>
            <p>CONNECT WITH COLLEAGUES TODAY</p>
          </section>
        </main>
      </div>
    </>
  );
};

export default WelcomePage;
