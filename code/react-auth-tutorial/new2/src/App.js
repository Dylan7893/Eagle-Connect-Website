import logo from './logo.svg';
import './App.css';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import AuthDetails from './components/AuthDetails';
import GetStarted from './pages/GetStarted';
import Login from './pages/Login'
import Register from './pages/Register'
import {BrowserRouter, Route, Routes} from 'react-router-dom';


function App() {
  return (
    <div className="App">
      {/*
      <SignIn />
      <AuthDetails />
      <SignUp />
      */ }
      <BrowserRouter>
      <Routes>
        <Route index element = {<GetStarted/>}/> 
        <Route path="/get-started" element = {<GetStarted/>}/>
        <Route path="/login" element = {<Login/>}/>
        <Route path="/sign-up" element = {<Register/>}/>
        <Route path="/reset" element = {<ForgotPassword/>}/>
      </Routes>
      </BrowserRouter>
      
    </div>
  );
}

export default App;
