import type { RootState } from "@/store/store";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface Assets {
  total_usdt: string;
  total_usdc: string;
}

const WalletModelAssetsView: React.FC = () => {
  const [assetsData, setAssetsData] = useState<Assets | null>(null);

  const baseUrl = useSelector((state: RootState) => state.consts.baseUrl);
  const userData = useSelector((state: RootState) => state.user.userData);
  const token = useSelector((state: RootState) => state?.user?.token);

  const fetchAssets = async () => {
    try {
      const response = await axios.post(
        `${baseUrl}/user-currency-list`,
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
      setAssetsData(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3 cursor-pointer transition ease-in-out duration-300 rounded-lg hover:bg-gray-300 px-3 py-1">
        <img src="usdt.svg" className="w-10 aspect-square" />
        <div className="flex flex-col">
          <span className="font-bold">USDT</span>
          <span className="font-semibold">
            {!assetsData
              ? "Loading..."
              : `$${parseFloat(assetsData?.total_usdt).toFixed(2) ?? 0.0}`}
          </span>
        </div>
      </div>

      {/* <div className="flex items-center gap-3 cursor-pointer transition ease-in-out duration-300 rounded-lg hover:bg-gray-300 px-3 py-1">
        <img src="usdc.svg" className="w-10 aspect-square" />
        <div className="flex flex-col">
          <span className="font-bold">USDC</span>
          <span className="font-semibold">
            {!assetsData
              ? "Loading..."
              : `$${parseFloat(assetsData?.total_usdc).toFixed(2) ?? 0.0}`}
          </span>
        </div>
      </div> */}
    </div>
  );
};

export default WalletModelAssetsView;
