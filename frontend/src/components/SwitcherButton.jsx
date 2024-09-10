import { useState } from "react";

const SwitcherButton = ({ isToggled, toggleSwitch }) => {
  return (
    <div
      className={`${
        isToggled ? "bg-green-500" : "bg-gray-300"
      } relative w-14 h-8 rounded-full cursor-pointer transition-colors duration-300`}
      onClick={toggleSwitch}
    >
      <div
        className={`${
          isToggled ? "translate-x-6" : "translate-x-0"
        } absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300`}
      ></div>
    </div>
  );
};

export default SwitcherButton;
