import React from "react";
import { Input } from "../ui/input";

interface UsdcProps {
  usdc: string;
  assetsData: {
    total_usdt: string;
    total_usdc: string;
  } | null;
  receiverAddress: string;
  setUsdc: React.Dispatch<React.SetStateAction<string>>;
  setReceiverAddress: React.Dispatch<React.SetStateAction<string>>;
}

const Usdc: React.FC<UsdcProps> = ({
  usdc,
  setUsdc,
  assetsData,
  receiverAddress,
  setReceiverAddress,
}) => {
  return (
    <div>
      <div>
        <img src="usdc.svg" className="w-15 mt-3 aspect-square mx-auto" />
      </div>
      <div className="flex md:flex-row flex-col mt-3 gap-2 px-5 py-3 bg-[#deddfd] rounded-lg">
        <div className="flex-1">
          <div className="font-semibold">Enter Amount</div>
          <Input
            value={usdc}
            onChange={(e) => setUsdc(e.target.value)}
            placeholder="Enter the amount"
            type="number"
            className="w-full border-gray-400 text-[#4D43EF] font-semibold"
          />
          <div className="mt-3 font-semibold text-sm">
            USDC Balance:{" "}
            <span>{parseFloat(assetsData?.total_usdc ?? "0").toFixed(2)}</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex w-full gap-2">
            <button
              onClick={() => {
                const val = parseFloat(assetsData?.total_usdc ?? "0") / 2;
                setUsdc(val.toString());
              }}
              className="md:flex-none flex-1 transition h-fit ease-in-out duration-300 font-semibold bg-white px-5 hover:bg-gray-300 py-2 md:py-1 rounded-lg cursor-pointer "
            >
              50%
            </button>
            <button
              onClick={() => {
                setUsdc(assetsData?.total_usdc ?? "0");
              }}
              className="md:flex-none flex-1 transition h-fit ease-in-out duration-300 font-semibold bg-white px-5 hover:bg-gray-300 py-2 md:py-1 rounded-lg cursor-pointer "
            >
              Max
            </button>
          </div>
          <div className="hidden md:flex self-center gap-2 items-center font-bold text-lg">
            <img className="aspect-square w-10" src="usdc.svg" />
            USDC
          </div>
        </div>
      </div>
      <div className="mt-3 bg-[#deddfd] px-2 py-3 rounded-lg">
        <Input
          value={receiverAddress}
          onChange={(e) => setReceiverAddress(e.target.value)}
          placeholder="Enter the Receiver Address ..."
          className="border-gray-400 text-[#4D43EF] font-semibold"
        />
      </div>
      <div className="py-2 px-4 mt-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded-md">
        <p className="font-semibold">Warning:</p>
        <ul className="list-disc list-inside mt-1">
          <li>
            Always verify the wallet address before proceeding. We cannot be
            held responsible for transactions sent to an incorrect address.
          </li>
          {/* <li>A 5% fee will be deducted from the amount entered.</li> */}
        </ul>
      </div>
    </div>
  );
};

export default Usdc;
