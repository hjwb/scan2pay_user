import React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { signout } from "@/store/slices/userSlice";
import { Copy, LogOut } from "lucide-react";
import { IoMenu } from "react-icons/io5";
import { LuTimerReset } from "react-icons/lu";
// import { IoIosSend } from "react-icons/io";
// import { MdOutlineAdd } from "react-icons/md";
import { HiDownload } from "react-icons/hi";
import { setLimit } from "@/store/slices/priceSlice";
// import { BiSolidWallet } from "react-icons/bi";

interface WalletModelMainViewProps {
  setView: React.Dispatch<React.SetStateAction<number>>;
}

const WalletModelMainView: React.FC<WalletModelMainViewProps> = ({
  setView,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const userData = useSelector((state: RootState) => state.user.userData);

  const Data = [
    {
      id: 1,
      tag: "Transactions",
      icon: IoMenu,
      click: () => {
        setView(1);
      },
    },
    {
      id: 2,
      tag: "View Assets",
      icon: LuTimerReset,
      click: () => {
        setView(2);
      },
    },
    // {
    //   id: 3,
    //   tag: "Manage Wallet",
    //   icon: BiSolidWallet,
    //   click: () => {
    //     setView(3);
    //   },
    // },
  ];

  function handleLogout() {
    dispatch(signout());
    dispatch(
      setLimit({
        limit: null,
      })
    );
  }
  return (
    <div className="mt-3 flex flex-col gap-2">
      <div className="flex gap-3 ">
        <div className="aspect-square w-10 text-lg rounded-full flex items-center justify-center font-semibold text-white bg-[#4D43EF]">
          {userData?.email?.toString()[0].toUpperCase() ||
            userData?.phone_no?.toString()[0].toUpperCase()}
        </div>
        <div>
          <div className="font-semibold flex items-center gap-3">
            {userData?.wallet_address.toString().slice(0, 6) +
              "..." +
              userData?.wallet_address.toString().slice(-6)}
            <Copy
              onClick={() => {
                navigator.clipboard
                  .writeText(userData?.wallet_address.toString() ?? "")
                  .then(() => {
                    alert("Address copied to clipboard!");
                  })
                  .catch((err) => {
                    console.error("Failed to copy text:", err);
                  });
              }}
              size={15}
              className="text-gray-700 cursor-pointer transition ease-in-out duration-300 hover:text-[#4D43EF]"
            />
          </div>
          <div className="text-xs text-gray-700">Smart Account</div>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-1 gap-3">
        {/* <div
          onClick={() => {
            setView(3);
          }}
          className="flex items-center justify-center gap-1 border-gray-700 text-gray-700 cursor-pointer text-sm hover:bg-gray-200 transition ease-in-out duration-300 font-bold py-2 rounded-lg border-2"
        >
          <IoIosSend className="size-5" /> Send
        </div> */}
        <div
          onClick={() => {
            setView(4);
          }}
          className="flex items-center justify-center gap-1 border-gray-700 text-gray-700 cursor-pointer text-sm hover:bg-gray-200 transition ease-in-out duration-300 font-bold py-2 rounded-lg border-2"
        >
          <HiDownload className="size-5" /> Receive
        </div>
        {/* <div
          onClick={() => {
            setView(5);
          }}
          className="flex items-center justify-center gap-1 border-gray-700 text-gray-700 cursor-pointer text-sm hover:bg-gray-200 transition ease-in-out duration-300 font-bold py-2 rounded-lg border-2"
        >
          <MdOutlineAdd className="size-5" /> Buy
        </div> */}
      </div>
      <div className="flex flex-col gap-1">
        {Data.map((item, index) => {
          return (
            <div
              key={index}
              onClick={item.click}
              className="flex gap-3 cursor-pointer hover:bg-gray-300 px-3 py-2 rounded transition ease-in-out duration-300"
            >
              <item.icon className="text-2xl text-[#4D43EF]" />
              <div className="font-semibold">{item.tag}</div>
            </div>
          );
        })}
        <hr className="bg-gray-300 my-2" />

        <div
          onClick={handleLogout}
          className="flex gap-3 cursor-pointer hover:bg-gray-300 px-3 py-2 rounded transition ease-in-out duration-300"
        >
          <LogOut className="text-2xl text-[#4D43EF]" />
          <div className="font-semibold">Disconnect Wallet</div>
        </div>
      </div>
    </div>
  );
};

export default WalletModelMainView;
