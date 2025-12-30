import type { RootState } from "@/store/store";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface Activity {
  buy_volume_usdc: string;
  buy_volume_usdt: string;
  complete_transaction: string;
  sell_pay_volume_usdc: string;
  sell_pay_volume_usdt: string;
}

const TrxCard: React.FC = () => {
  const [data, setData] = useState<Activity | null>(null);

  const baseUrl = useSelector((state: RootState) => state?.consts?.baseUrl);
  const userData = useSelector((state: RootState) => state?.user?.userData);
  const token = useSelector((state: RootState) => state?.user?.token);

  async function fetchActivity() {
    try {
      const response = await axios.post(
        `${baseUrl}/user-current-volume`,
        {
          user_id: userData?.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      // console.log(response.data.data);
      setData(response.data.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchActivity();
  }, []);

  return (
    <div className="card relative overflow-hidden border-b-2 border-r border-[#4D43EF] bg-[#ebe5f7] shadow-2xl rounded-2xl">
      <div className="absolute inset-0 bg-linear-to-br from-[#7728E2] via-[#5C5AD7] to-[#22BDCF] opacity-90 rounded-2xl" />

      <div className="relative z-10 p-4 sm:p-5 md:p-6 text-white">
        <div className="mb-4 text-center sm:text-left">
          <h3 className="font-semibold text-lg sm:text-xl tracking-wide">
            Your Activity
          </h3>
          <p className="text-xs sm:text-sm text-gray-100 font-medium">
            Non-cancelled transactions from this month
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="sm:col-span-2 grid grid-cols-2 xs:grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 sm:p-4">
              <div className="font-extrabold text-2xl sm:text-3xl text-gray-100">
                {data ? data.buy_volume_usdt : "0"}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-gray-200 mt-1">
                Buy Volume USDT
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 sm:p-4">
              <div className="font-extrabold text-2xl sm:text-3xl text-gray-100">
                {data ? data.sell_pay_volume_usdt : "0"}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-gray-200 mt-1">
                Sell & Pay Volume USDT
              </div>
            </div>

            {/* <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 sm:p-4">
              <div className="font-extrabold text-2xl sm:text-3xl text-gray-100">
                {data ? data.buy_volume_usdc : "0"}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-gray-200 mt-1">
                Buy Volume USDC
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 sm:p-4">
              <div className="font-extrabold text-2xl sm:text-3xl text-gray-100">
                {data ? data.sell_pay_volume_usdc : "0"}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-gray-200 mt-1">
                Sell & Pay Volume USDC
              </div>
            </div> */}
          </div>

          <div className="flex flex-col justify-center bg-white/10 backdrop-blur-md rounded-lg p-4">
            <div className="font-extrabold text-2xl sm:text-3xl text-gray-100">
              {data ? data.complete_transaction : "0"}
            </div>
            <div className="text-xs sm:text-sm font-semibold text-gray-200 mt-1">
              Successful Trx.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrxCard;
