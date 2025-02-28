import "../../design/ClassPageStyle.css";
import { useState } from 'react';
import ClassTemplate from "./ClassTemplate";
import ClassInfo from "./ClassInfo";
import Notes from "./Notes";
import RateClass from "./RateClass";
import Resources from "./Resources";
import Reminders from "./Reminders";
import Chat from "./Chat";

function ClassPage({ className }) {

    const [sectionClicked, setSectionClicked] = useState("chat");
    function handleCallBack(x) {
        setSectionClicked(x);
    }
    {/*There has GOT to be a better way to do this. ~Chase*/}
    switch (sectionClicked) {
        case ("chat"):
            return (
                <>
                    <ClassTemplate toClassPage={handleCallBack} className={className} />
                    <main className="main-section">
                        <Chat/>
                        {/* end main */}
                    </main>
                </>
            );

        case ("notes"):
            return (
                <>
                    <ClassTemplate toClassPage={handleCallBack} className={className} />
                    <main className="main-section">
                    <Notes/>
                        {/* end main */}
                    </main>
                </>
            );

        case ("info"):
            return (
                <>
                    <ClassTemplate toClassPage={handleCallBack} className={className} />
                    <main className="main-section">
                    <ClassInfo/>
                        {/* end main */}
                    </main>
                </>
            );

        case ("reminders"):
            return (
                <>
                    <ClassTemplate toClassPage={handleCallBack} className={className} />
                    <main className="main-section">
                    <Reminders/>
                        {/* end main */}
                    </main>
                </>
            );

        case ("resources"):
            return (
                <>
                    <ClassTemplate toClassPage={handleCallBack} className={className} />
                    <main className="main-section">
                    <Resources/>
                        {/* end main */}
                    </main>
                </>
            );
        case ("rate"):
            return (
                <>
                    <ClassTemplate toClassPage={handleCallBack} className={className} />
                    <main className="main-section">
                        <RateClass/>
                        {/* end main */}
                    </main>
                </>
            )

    }
    return (
        <>

        </>
    );
}

export default ClassPage;