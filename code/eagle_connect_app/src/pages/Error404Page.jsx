//page that is shown when an error is caught anywhere in the app

import Error404Style from "../design/404Style.css";
import { useNavigate } from "react-router-dom";

function Error404Page() {
  const navigate = useNavigate();
  const navigateClick = () => {
    navigate("/");
  };
  return (
    <>
    <div className="body-404">
      <title>Page Not Found</title>
      <link rel="stylesheet" href={Error404Style} />

      <div class="error-box">
        <h1 className="h1-404">404</h1>
        <p className="p-404">This Page Not Found!</p>
        <button className="button-404" onClick={navigateClick}>
          {" "}
          Return To Home{" "}
        </button>
      </div>
    </div>
    </>
  );
}
export default Error404Page;
