// MyPopup.js
//documentation: https://react-popup.elazizi.com/react-modal
import React, { useState } from "react";
import Popup from "reactjs-popup"; //required

const MyPopup = ({ isOpen, closePopup }) => {
  return (
    <Popup open={isOpen} closeOnDocumentClick onClose={closePopup}>
      <h2>Create A Class</h2>
      <form>
        <label htmlFor="className">Class Number: </label>

        <div class="className">
          <input type="text" id="className" className="input-small" />
          <label htmlFor="className3" class="dash">
            -
          </label>

          <input
            type="number"
            id="className"
            className="classNameIn"
            min="0"
            max="999"
          />

          <select>
            <option value="option1"></option>
            <option value="option2">L</option>
            <option value="option3">C</option>
            <option value="option3">D</option>
          </select>

          <label htmlFor="className3" class="dash">
            -
          </label>
          <input
            type="number"
            id="className"
            className="classNameIn"
            min="0"
            max="999"
          />
          <select>
            <option value="option1"></option>
            <option value="option2">UR</option>
          </select>
        </div>

        <label htmlFor="classNumber">Class Name: </label>
        <input type="text" id="classNumber" className="input-with-padding" />

        <button type="submit" class="add-button">
          Add
        </button>
      </form>
    </Popup>
  );
};

export default MyPopup;
