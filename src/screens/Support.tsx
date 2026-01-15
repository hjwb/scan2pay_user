import React from "react";
import { FaTelegramPlane } from "react-icons/fa";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { RiTwitterXFill } from "react-icons/ri";
import Faqs from "@/components/support/Faqs";

const Support: React.FC = () => {
  return (
    <div className="mt-24 px-2 flex flex-col gap-7 max-w-lg mx-auto">
      <div className="flex items-center text-sm justify-between bg-gray-200 px-3 py-3 rounded-lg">
        <div className="font-bold txt3">Need Help?</div>
        <button
          onClick={() => {
            window.open("https://t.me/scan2pay_direct/", "_");
          }}
          className="font-semibold cursor-pointer transition ease-in-out duration-300 hover:bg-[#4D43EF] hover:text-white hover:border-[#4D43EF] text-[#4D43EF] flex items-center gap-1 px-2 py-1.5 rounded-lg border border-[#4D43EF]"
        >
          <IoChatbubbleEllipses /> Chat with us. →
        </button>
      </div>

      <div>
        <div className="font-bold mb-2 text-lg">FAQs</div>
        <Faqs />
      </div>

      <div>
        <div className="font-semibold">Find us on</div>
        <div className="flex gap-3 mt-2">
          <RiTwitterXFill
            onClick={() => window.open("https://x.com/", "_")}
            className="text-2xl cursor-pointer text-[#4D43EF] hover:text-[#4D43EF]/70 transition ease-in-out duration-300"
          />
          <FaTelegramPlane
            onClick={() => window.open("https://t.me/scan2pay_direct/", "_")}
            className="text-2xl cursor-pointer text-[#4D43EF] hover:text-[#4D43EF]/70 transition ease-in-out duration-300"
          />
        </div>
      </div>
    </div>
  );
};

export default Support;
