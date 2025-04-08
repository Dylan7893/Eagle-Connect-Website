import "../../design/ClassPageStyle.css";
import { useState } from "react";
import ClassTemplate from "./ClassTemplate";
import ClassInfo from "./ClassInfo";
import Notes from "./Notes";
import RateClass from "./RateClass";
import Resources from "./Resources";
import Reminders from "./Reminders";
import Chat from "./Chat";
import Dashboard from "../dashboard/Dashboard";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";

function ClassPage({ className, email }) {
  const [user] = useAuthState(auth);

  const [sectionClicked, setSectionClicked] = useState("chat");
  function handleCallBack(x) {
    setSectionClicked(x);
  }
  {
    /*There has GOT to be a better way to do this. ~Chase*/
  }
  switch (sectionClicked) {
    case "chat":
      return (
        <>
          <ClassTemplate toClassPage={handleCallBack} className={className} />
          <main className="main-section">
            <Chat className={className} email={email} />
            {/* end main */}
          </main>
        </>
      );

    case "notes":
      return (
        <>
          <ClassTemplate toClassPage={handleCallBack} className={className} />
          <main className="main-section">
            <Notes className={className} email={email} />
            {/* end main */}
          </main>
        </>
      );

    case "reminders":
      return (
        <>
          <ClassTemplate toClassPage={handleCallBack} className={className} />
          <main className="main-section">
            <Reminders className={className} email={email} />
            {/* end main */}
          </main>
        </>
      );

    case "resources":
      return (
        <>
          <ClassTemplate toClassPage={handleCallBack} className={className} />
          <main className="main-section">
            <Resources className={className} email={email} />
            {/* end main */}
          </main>
        </>
      );

    case "rate":
      return (
        <>
          <ClassTemplate toClassPage={handleCallBack} className={className} />
          <main className="main-section">
            <RateClass className={className} email={email} />
            {/* end main */}
          </main>
        </>
      );

    case "info":
      return (
        <>
          <ClassTemplate toClassPage={handleCallBack} className={className} />
          <main className="main-section">
            <ClassInfo className={className} />
            {/* end main */}
          </main>
        </>
      );

    case "none":
      return (
        <>
          <Dashboard email={user.email} />
        </>
      );
  }

  return <></>;
}

export default ClassPage;
