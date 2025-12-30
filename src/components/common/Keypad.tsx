import React from "react";
import { FaBackspace } from "react-icons/fa";

const Keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0"];

interface props {
  updateAmount: (value: string) => void;
  backspace: () => void;
}

const Keypad: React.FC<props> = ({ updateAmount, backspace }) => {
  return (
    <div className="grid grid-cols-3 text-center font-semibold text-2xl">
      {Keys.map((item, index) => {
        return (
          <div
            key={index}
            onClick={() => updateAmount(item)}
            className="hover:bg-gray-200 txt2 rounded cursor-pointer transition ease-in-out duration-300 py-2"
          >
            {item}
          </div>
        );
      })}

      <div
        onClick={backspace}
        className="flex items-center justify-center py-2 hover:bg-gray-200 cursor-pointer transition ease-in-out duration-300"
      >
        <FaBackspace />
      </div>
    </div>
  );
};

export default Keypad;
