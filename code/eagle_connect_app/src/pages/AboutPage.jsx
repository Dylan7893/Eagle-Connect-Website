import eagleLogo from "../design/logo.png";

function AboutPage() {
    return (
        <>
            <title>About</title>
            <link rel="stylesheet" href="aboutStyle.css" />
            <nav className="navigationHeader">
                {/*logo image and logo text*/}
                <div className="logo">
                    <img src={eagleLogo} alt="Eagle Logo" className="logo-image" />
                    EAGLE CONNECT
                </div>
                {/*navigation links*/}
                <ul className="navigation-links">
                    <li>
                        <a href="/">Home</a>
                    </li>
                    <li>
                        <a href="/app">
                            <button class="get-started" type="button">Get Started</button>
                        </a>
                    </li>
                </ul>
            </nav>
            {/*beginning of body*/}
            <div className="error-box">
                {/*message*/}
                <h1>About Us</h1>
                <p>
                Eagle Connect is a web-based application for Morehead State University Students to collaborate 
                with each other academically in a way that has never been done before. Students can join 
                any class page they want with a plethora of ways to enhance their learning and education through class pages such as:
                </p>
                <ul>
                    <li>Chat Messaging Section</li>
                    <li>Notes Section</li>
                    <li>Resources Section</li>
                    <li>Class Information Section</li>
                    <li>Reminders Section</li>
                    <li>Rate Class Section</li>
                </ul> 
                <p>This web app is developed by Dyland Hardy, Landon Jones, and Chase Morgan for the CS-380 Software Engineering Spring 2025 Class</p>
            </div>
        </>
    );
}

export default AboutPage;