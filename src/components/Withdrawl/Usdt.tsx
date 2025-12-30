import React, { useState } from "react";
import { Input } from "../ui/input";
import axios from "axios";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useShowError } from "@/hooks/useShowError";
import { useShowSuccess } from "@/hooks/useShowSuccess";

interface UsdtProps {
  usdt: string;
  assetsData: {
    total_usdt: string;
    total_usdc: string;
  } | null;
  receiverAddress: string;
  otp: string;
  setUsdt: React.Dispatch<React.SetStateAction<string>>;
  setReceiverAddress: React.Dispatch<React.SetStateAction<string>>;
  setOtp: React.Dispatch<React.SetStateAction<string>>;
}

const Usdt: React.FC<UsdtProps> = ({
  setUsdt,
  usdt,
  assetsData,
  receiverAddress,
  setReceiverAddress,
  otp,
  setOtp,
}) => {
  const [loading, setLoading] = useState(false);

  const baseUrl = useSelector((state: RootState) => state.consts.baseUrl);
  const token = useSelector((state: RootState) => state?.user?.token);

  const { showSuccess } = useShowSuccess();
  const { showError } = useShowError();

  async function handleOtpSend() {
    try {
      setLoading(true);
      const response = await axios.post(
        `${baseUrl}/get-withdraw-otp`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      if (response.data.status) {
        showSuccess("Otp Sent.", "");
      }
    } catch (error) {
      console.log(error);
      showError("Error", "Error occured while sending the otp.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div>
        <img src="usdt.svg" className="w-15 mt-3 aspect-square mx-auto" />
      </div>
      <div className="flex md:flex-row flex-col mt-3 gap-2 px-5 py-3 bg-[#deddfd] rounded-lg">
        <div className="flex-1">
          <div className="font-semibold">Enter Amount</div>
          <Input
            value={usdt}
            onChange={(e) => setUsdt(e.target.value)}
            placeholder="Enter the amount"
            type="number"
            className="w-full border-gray-400 text-[#4D43EF] font-semibold"
          />
          <div className="mt-3 font-semibold text-sm">
            USDT Balance:{" "}
            <span>{parseFloat(assetsData?.total_usdt ?? "0").toFixed(2)}</span>
          </div>{" "}
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex w-full gap-2">
            <button
              onClick={() => {
                const val = parseFloat(assetsData?.total_usdt ?? "0") / 2;
                setUsdt(val.toString());
              }}
              className="md:flex-none flex-1 transition h-fit ease-in-out duration-300 font-semibold bg-white px-5 hover:bg-gray-300 py-2 md:py-1 rounded-lg cursor-pointer "
            >
              50%
            </button>
            <button
              onClick={() => {
                setUsdt(assetsData?.total_usdt ?? "0");
              }}
              className="md:flex-none flex-1 transition h-fit ease-in-out duration-300 font-semibold bg-white px-5 hover:bg-gray-300 py-2 md:py-1 rounded-lg cursor-pointer "
            >
              Max
            </button>
          </div>
          <div className="hidden md:flex  self-center  gap-2 items-center font-bold text-lg">
            <img className="aspect-square w-12" src="usdt.svg" />
            USDT
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
        <div className="mt-2 flex gap-1">
          <Input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter the Otp..."
            className="border-gray-400 flex-1 text-[#4D43EF] font-semibold"
          />
          <button
            onClick={handleOtpSend}
            disabled={loading}
            className="bg-[#4D43EF] text-white rounded-lg px-2 hover:bg-[#4D43EF]/80 cursor-pointer transition ease-in-out duration-300"
          >
            {loading ? "Sending.." : "Send Otp"}
          </button>
        </div>
      </div>
      {/* <div className="mt-3 bg-[#deddfd] px-2 py-3 rounded-lg">
        <Input
          value={receiverAddress}
          onChange={(e) => setReceiverAddress(e.target.value)}
          placeholder="Enter the Receiver Address ..."
          className="border-gray-400 text-[#4D43EF] font-semibold"
        />
      </div> */}
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

export default Usdt;
