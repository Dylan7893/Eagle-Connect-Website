
import './App.css';
import WelcomePage from "./pages/WelcomePage";
import MainPage from "./pages/MainPage";

import {BrowserRouter, Route, Routes} from 'react-router-dom';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route index element = {<WelcomePage/>}/> 
        <Route path="/get-started" element = {<WelcomePage/>}/>
        <Route path="/app" element = {<MainPage/>}/>
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
