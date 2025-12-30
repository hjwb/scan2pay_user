import React from "react";
import { FaWallet } from "react-icons/fa6";
import { PiHandWithdrawFill } from "react-icons/pi";
import { PiHandDepositFill } from "react-icons/pi";
import { BiSupport } from "react-icons/bi";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";
import { setDepositSlider, setWithdrawSlider } from "@/store/slices/modelSlice";
import WalletModel from "./WalletModel";
import { useNavigate } from "react-router";

const Action: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const Data = [
    {
      id: 1,
      icon: FaWallet,
      tag: "Wallet",
      theme: "",
    },
    {
      id: 2,
      icon: PiHandDepositFill,
      tag: "Deposit",
      click: () => {
        dispatch(setDepositSlider({ showDepositSlider: true }));
      },
      theme: "text-sky-500 border-sky-500 hover:bg-sky-100",
    },
    {
      id: 3,
      icon: PiHandWithdrawFill,
      tag: "Withdraw",
      click: () => {
        dispatch(setWithdrawSlider({ showWithdrawSlider: true }));
      },
      theme: "text-indigo-500 border-indigo-500 hover:bg-indigo-100",
    },
    {
      id: 4,
      icon: BiSupport,
      tag: "Support",
      click: () => {
        navigate("/support");
      },
      theme: "border-fuchsia-500 text-fuchsia-500 hover:bg-fuchsia-100",
    },
  ];

  return (
    <div className="flex justify-between mx-2  max-w-lg  md:gap-10 mt-10">
      {Data.map((item, index) => {
        return (
          <div
            key={index}
            onClick={item?.click}
            className="flex flex-col gap-1 items-center"
          >
            {item.id == 1 ? (
              <WalletModel />
            ) : (
              <div
                className={`border-2 card1 hover:rotate-6 hover:scale-110 transition-all ease-in-out duration-300 cursor-pointer hover:scale rounded-md p-3 ${item.theme}`}
              >
                <item.icon className="text-2xl" />
              </div>
            )}
            <div className="font-semibold">{item.tag}</div>
          </div>
        );
      })}
    </div>
  );
};

export default Action;
