import "../../design/ClassPageStyle.css";

function ClassTemplate({ toClassPage, className }) {
  {
    /*There has GOT to be a better way to do this. ~Chase*/
  }
  function notes() {
    toClassPage("notes");
  }
  function resources() {
    toClassPage("resources");
  }
  function chat() {
    toClassPage("chat");
  }
  function reminders() {
    toClassPage("reminders");
  }
  function rate() {
    toClassPage("rate");
  }
  function info() {
    toClassPage("info");
  }
  return (
    <>
      {/* Note: I have been getting the svgs from this website: https://iconduck.com/icons  */}
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Class Page</title>
      <link rel="stylesheet" href="ClassPageStyle.css" />
      {/* navigation header */}
      <header className="navigation-bar">
        {/* replace with any class name and number */}
        <h1>{className}</h1>
        {/* right navigation buttons */}
        <div className="navigation-bar-right">
          {/* profile image serving as a button for profile */}
          <button className="profile-button">
            {/* default image asset */}
            <img
              className="profile-picture"
              src="default_pfp.jpg"
              alt="profile picture"
            />
          </button>
        </div>
      </header>
      {/* sidebar start */}
      <aside className="sidebar">
        <button className="add-new-class">Dashboard</button>
        <ul className="list-of-tools">
          {/* default list of all classes*/}
          <li className="tool-list-item" onClick={chat}>
            <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
              <path d="m144 208c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32zm112 0c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32zm112 0c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32zm-112-176c-141.4 0-256 93.1-256 208 0 47.6 19.9 91.2 52.9 126.3-14.9 39.4-45.9 72.8-46.4 73.2-6.6 7-8.4 17.2-4.6 26s12.5 14.5 22.1 14.5c61.5 0 110-25.7 139.1-46.3 28.9 9.1 60.1 14.3 92.9 14.3 141.4 0 256-93.1 256-208s-114.6-208-256-208zm0 368c-26.7 0-53.1-4.1-78.4-12.1l-22.7-7.2-19.5 13.8c-14.3 10.1-33.9 21.4-57.5 29 7.3-12.1 14.4-25.7 19.9-40.2l10.6-28.1-20.6-21.8c-18.1-19.3-39.8-51.2-39.8-93.4 0-88.2 93.3-160 208-160s208 71.8 208 160-93.3 160-208 160z" />
            </svg>
            Chat
          </li>
          {/* default list of all classes*/}
          <li className="tool-list-item" onClick={rate}>
            <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
              <path d="m396.8 352h22.4c6.4 0 12.8-6.4 12.8-12.8v-230.4c0-6.4-6.4-12.8-12.8-12.8h-22.4c-6.4 0-12.8 6.4-12.8 12.8v230.4c0 6.4 6.4 12.8 12.8 12.8zm-192 0h22.4c6.4 0 12.8-6.4 12.8-12.8v-198.4c0-6.4-6.4-12.8-12.8-12.8h-22.4c-6.4 0-12.8 6.4-12.8 12.8v198.4c0 6.4 6.4 12.8 12.8 12.8zm96 0h22.4c6.4 0 12.8-6.4 12.8-12.8v-134.4c0-6.4-6.4-12.8-12.8-12.8h-22.4c-6.4 0-12.8 6.4-12.8 12.8v134.4c0 6.4 6.4 12.8 12.8 12.8zm195.2 48h-448v-320c0-8.84-7.16-16-16-16h-16c-8.84 0-16 7.16-16 16v336c0 17.67 14.33 32 32 32h464c8.84 0 16-7.16 16-16v-16c0-8.84-7.16-16-16-16zm-387.2-48h22.4c6.4 0 12.8-6.4 12.8-12.8v-70.4c0-6.4-6.4-12.8-12.8-12.8h-22.4c-6.4 0-12.8 6.4-12.8 12.8v70.4c0 6.4 6.4 12.8 12.8 12.8z" />
            </svg>
            Rate Class
          </li>
          {/* default list of all classes*/}
          <li className="tool-list-item" onClick={info}>
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                d="m0 0h24v24h-24z"
                fill="#fff"
                opacity={0}
                transform="matrix(-1 0 0 -1 24 24)"
              />
              <g fill="#231f20">
                <path d="m12 2a10 10 0 1 0 10 10 10 10 0 0 0 -10-10zm0 18a8 8 0 1 1 8-8 8 8 0 0 1 -8 8z" />
                <circle cx={12} cy={8} r={1} />
                <path d="m12 10a1 1 0 0 0 -1 1v5a1 1 0 0 0 2 0v-5a1 1 0 0 0 -1-1z" />
              </g>
            </svg>
            Class Info
          </li>
          {/* default list of all classes*/}
          <li className="tool-list-item" onClick={notes}>
            <svg
              fill="none"
              height={24}
              viewBox="0 0 24 24"
              width={24}
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="m8 6h8m-8 4h8m-8 4h3m-5 8h12c1.1046 0 2-.8954 2-2v-16c0-1.10457-.8954-2-2-2h-12c-1.10457 0-2 .89543-2 2v16c0 1.1046.89543 2 2 2z"
                stroke="#000"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
            Notes
          </li>
          {/* default list of all classes*/}
          <li className="tool-list-item" onClick={resources}>
            <svg
              height={24}
              viewBox="0 0 24 24"
              width={24}
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="m12 3 9 4.5-9 4.5-9-4.5zm4.5 7.25 4.5 2.25-9 4.5-9-4.5 4.5-2.25m9 5 4.5 2.25-9 4.5-9-4.5 4.5-2.25"
                fill="none"
                stroke="#000"
                strokeWidth={2}
              />
            </svg>
            Resources
          </li>
          {/* default list of all classes*/}
          <li className="tool-list-item" onClick={reminders}>
            <svg
              height={48}
              viewBox="0 0 48 48"
              width={48}
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="m0 0h48v48h-48z" fill="none" />
              <circle cx={24} cy={40} r={3} />
              <path d="m23.8 33h.4a2.2 2.2 0 0 0 2.1-2l1.7-23.7a4 4 0 1 0 -8 0l1.7 23.7a2.2 2.2 0 0 0 2.1 2z" />
            </svg>
            Reminders
          </li>
          {/* end list */}
        </ul>

        {/* end side bar*/}
      </aside>
    </>
  );
}

export default ClassTemplate;
