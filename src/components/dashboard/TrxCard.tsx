import React from "react";
import { TypingAnimation } from "../ui/typing-animation";
import { RiLuggageDepositFill } from "react-icons/ri";
import { BiMoneyWithdraw } from "react-icons/bi";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

const TrxCard: React.FC = () => {
  const navigate = useNavigate();

  const limit = useSelector((state: RootState) => state.price.limit);

  return (
    <div className="card mt-5 mb-5 mx-2 px-3 md:px-5 border-b-2 border-r border-[#4D43EF] py-5 bg-linear-to-br from-[#7728E2] via-[#5C5AD7] to-[#22BDCF] shadow-xl rounded-lg">
      <div className="font-semibold text-lg text-white">Transaction Limit</div>
      <p className="text-xs font-semibold txt text-white">
        This is the maximum amount you can buy, sell, or pay in one order.
        Increase limit for larger transactions in{" "}
        <TypingAnimation words={["USDT."]} loop />
      </p>
      <div className="flex mt-8 ">
        <div className="flex-1 flex gap-3">
          <div className="bg-white w-15 flex items-center justify-center rounded-full aspect-square p-2">
            <RiLuggageDepositFill className="text-4xl text-[#4D43EF]" />
          </div>
          <div className="">
            <div className="font-semibold text-white">Buy</div>
            <div className="font-extrabold text-3xl bg-white text-transparent bg-clip-text">
              ${limit?.buy_limit ?? 0}
            </div>
          </div>
        </div>
        <div className="flex-1 flex gap-3">
          <div className="bg-white w-15 flex items-center justify-center rounded-full aspect-square p-2">
            <BiMoneyWithdraw className="text-4xl text-[#4D43EF]" />
          </div>
          <div className="">
            <div className="font-semibold text-white">Sell/Pay</div>
            <div className="font-extrabold text-3xl bg-white text-transparent bg-clip-text">
              ${limit?.sell_limit ?? 0}
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={() => navigate("/limit")}
        className="mt-7 w-full bg-white text-[#4D43EF] py-2 rounded-lg font-bold border hover:scale-102 border-white hover:bg-[#4D43EF]  hover:text-white transition ease-in-out duration-300 cursor-pointer"
      >
        Increase Transaction Limit
      </button>
    </div>
  );
};

export default TrxCard;
