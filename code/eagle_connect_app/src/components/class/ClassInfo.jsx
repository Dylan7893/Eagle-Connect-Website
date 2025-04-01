import classInfoPageStyle from "../../design/classInfoPage.css";

function ClassInfo() {
  return (
    <>
      <title>Class Information</title>
      <link rel="stylesheet" href={classInfoPageStyle} />
      <div className="class-info">
        <h1>Class Information</h1>
        {/*we will need to go in and make these values dynamic i just put in some fuller information for the time being (Dylan)*/}
        <div className="class-info-grid">
          <div>
            <span className="title">Class Name:</span>
            <span className="info">Software Engineering</span>
          </div>
          <div>
            <span className="title">Class Number:</span>
            <span className="info">CS-380 </span>
          </div>
          <div>
            <span className="title">Course Level:</span>
            <span className="info">Senior</span>
          </div>
          <div>
            <span className="title">Number of Students:</span>
            <span className="info">10</span>
          </div>
          <div>
            <span className="title">Level UP?:</span>
            <span className="info">No</span>
          </div>
          <div>
            <span className="title">Requires Lab?:</span>
            <span className="info">No</span>
          </div>
          <div>
            <span className="title">Description:</span>
            <span className="info">
              Course covers the dicipline that applies engineering principles to
              the design, development, testing, and maintenance of software
              systems, aiming to create high-quality, reliable, and maintainable
              software.
            </span>
          </div>
        </div>
        <button className="leave-class">Leave Class</button>
      </div>
    </>
  );
}

export default ClassInfo;
