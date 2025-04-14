//page that is shown when an error is caught anywhere in the app

import Error404Style from "../design/Error404Style.css";
import { useNavigate } from "react-router-dom";

function Error404Page() {
  const navigate = useNavigate();
  const navigateClick = () => {
    navigate("/");
  };
  return (
    <>
      <title>Page Not Found</title>
      <link rel="stylesheet" href={Error404Style} />

      <div class="error-box">
        <h1>404</h1>
        <p>This Page Not Found!</p>
        <button className="home" onClick={navigateClick}>
          {" "}
          Return To Home{" "}
        </button>
      </div>
    </>
  );
}
export default Error404Page;
