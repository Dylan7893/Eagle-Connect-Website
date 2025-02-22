// MyPopup.js
//documentation: https://react-popup.elazizi.com/react-modal
import React, { useState } from "react";
import Popup from "reactjs-popup"; //required

const MyPopup = ({ isOpen, closePopup }) => {
  return (
    <Popup open={isOpen} closeOnDocumentClick onClose={closePopup}>
      <h2>Create A Class</h2>
      <form>
        <label htmlFor="className">Class Name: </label>
        <input type="text" id="className" className="input-with-padding" />

        <label htmlFor="classNumber">Class Number: </label>
        <input type="text" id="classNumber" className="input-with-padding" />

        <label htmlFor="professorName">Professor Name: </label>
        <input type="text" id="professorName" className="input-with-padding" />

        <button type="submit">Add</button>
      </form>
    </Popup>
  );
};

export default MyPopup;
