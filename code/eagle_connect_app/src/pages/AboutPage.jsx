import eagleLogo from "../design/logo.png";
import aboutStyle from "../design/aboutStyle.css";
import { useNavigate } from "react-router-dom";

function AboutPage() {
  const navigate = useNavigate();
  const navigateClick = () => {
    navigate("/app");
  };

  return (
    <>
      <title>About</title>
      <link rel="stylesheet" href={aboutStyle} />
      <nav className="navigationHeader">
        {/*logo image and logo text*/}
        <div className="logo">
          <img
            src={eagleLogo}
            alt="Eagle Logo"
            class="logo-image"
            EAGLE
            CONNECT
          ></img>
        </div>
        {/*navigation links*/}
        <ul className="navigation-links">
          <li>
            <a href="/">Home</a>
          </li>

          <li>
            <button className="get-started" onClick={navigateClick}>
              Get Started
            </button>
          </li>
        </ul>
      </nav>
      <div className="about-body">
        {/*beginning of body*/}

        <div className="error-box">
          {/*message*/}
          <h1 className="about-h1">ABOUT US</h1>
          <p className="about-p">
            Eagle Connect is a web-based application for Morehead State
            University Students to collaborate with each other academically in a
            way that has never been done before. Students can join any class
            page they want with a plethora of ways to enhance their learning and
            education through class pages such as:
          </p>
          <ul className="about-ul">
            <li>Chat Messaging Section</li>
            <li>Notes Section</li>
            <li>Resources Section</li>
            <li>Class Information Section</li>
            <li>Reminders Section</li>
            <li>Rate Class Section</li>
          </ul>
          <p className="about-p">
            This web app is developed by Dyland Hardy, Landon Jones, and Chase
            Morgan for the CS-380 Software Engineering Spring 2025 Class
          </p>
        </div>
      </div>
    </>
  );
}

export default AboutPage;
