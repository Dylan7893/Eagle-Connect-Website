
import './App.css';
import WelcomePage from "./pages/WelcomePage";
import MainPage from "./pages/MainPage";
import AboutPage from "./pages/AboutPage";
import {BrowserRouter, Route, Routes} from 'react-router-dom';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route index element = {<WelcomePage/>}/> 
        <Route path="/get-started" element = {<WelcomePage/>}/>
        <Route path="/app" element = {<MainPage/>}/>
        <Route path="/about" element = {<AboutPage/>}/>
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
