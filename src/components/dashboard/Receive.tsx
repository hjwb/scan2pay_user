import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { QRCodeCanvas } from "qrcode.react";
import { CopyIcon } from "lucide-react";

const Receive: React.FC = () => {
  const userData = useSelector((state: RootState) => state.user.userData);

  return (
    <div className="flex flex-col items-center">
      <QRCodeCanvas
        value={userData?.wallet_address ? String(userData.wallet_address) : ""}
        size={200}
        bgColor="transparent"
        fgColor="#000000"
        level="H"
        includeMargin={true}
      />
      <span className="self-start font-semibold text-[16px] mt-5">
        Wallet Address
      </span>
      <div className="flex justify-between items-center bg-[#cbc8f8] rounded-lg w-full px-5 py-2">
        <span className="font-semibold">
          {userData?.wallet_address.toString().slice(0, 14) +
            "..." +
            userData?.wallet_address.toString().slice(-14)}
        </span>
        <CopyIcon
          size={15}
          className="hover:text-[#5728A6] cursor-pointer transition ease-in-out duration-300"
          onClick={() => {
            navigator.clipboard
              .writeText(
                userData?.wallet_address ? String(userData.wallet_address) : ""
              )
              .then(() => {
                alert("Address copied to clipboard!");
              })
              .catch((err) => {
                console.error("Failed to copy: ", err);
              });
          }}
        />
      </div>
    </div>
  );
};

export default Receive;
