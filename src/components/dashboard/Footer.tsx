import React from "react";
import { BsCartDashFill } from "react-icons/bs";
import { BsFillCartPlusFill } from "react-icons/bs";
import { BsQrCode } from "react-icons/bs";
import { useNavigate } from "react-router";

const Footer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 z-30 bg-white left-0 w-full shadow-[0_-3px_9px_#ddd4ee] ">
      <div className="max-w-lg relative mx-auto px-4 py-3 md:py-5 flex justify-between">
        <button
          onClick={() => navigate("/buy")}
          className="flex gap-2 hover:scale-105 hover:-rotate-6 font-semibold hover:bg-black transition ease-in-out duration-300 bg-[#4D43EF] rounded-lg cursor-pointer text-white px-5 py-2 items-center"
        >
          <BsFillCartPlusFill className="text-xl" />
          Buy
        </button>
        <button
          onClick={() => navigate("/sell")}
          className="flex gap-2 hover:scale-105 hover:rotate-6 font-semibold hover:bg-[#4D43EF] transition ease-in-out duration-300 bg-black rounded-lg cursor-pointer text-white px-5 py-2 items-center"
        >
          <BsCartDashFill className="text-xl" />
          Sell
        </button>
        <button
          onClick={() => navigate("/scan")}
          className="absolute left-1/2 -translate-x-1/2 -top-1/2 md:translate-y-1.5"
        >
          <div className="bg-gray-100 border-2 hover:scale-110 hover:bg-gray-200 transition ease-in-out duration-300 border-gray-300 cursor-pointer p-4 rounded-full">
            <BsQrCode className="text-[#4D43EF] font-semibold text-4xl" />
          </div>
          <span className="text-xs font-extrabold md:font-bold">
            Scan & Pay
          </span>
        </button>
      </div>
    </div>
  );
};

export default Footer;
