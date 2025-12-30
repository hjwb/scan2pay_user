import React, { useEffect } from "react";
import Balance from "@/components/dashboard/Balance";
import Action from "@/components/dashboard/Action";
import TrxCard from "@/components/dashboard/TrxCard";
import Footer from "@/components/dashboard/Footer";
import DepositSlider from "@/components/dashboard/DepositSlider";
import WithdrawSlider from "@/components/dashboard/WithdrawSlider";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import axios from "axios";
import { setLimit } from "@/store/slices/priceSlice";
import ReferalVerifyModel from "@/components/dashboard/ReferalVerifyModel";
import { setShowReferVerifyModel } from "@/store/slices/modelSlice";

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const baseUrl = useSelector((state: RootState) => state.consts.baseUrl);
  const userData = useSelector((state: RootState) => state.user.userData);
  const token = useSelector((state: RootState) => state?.user?.token);
  const count = useSelector((state: RootState) => state.model.count);
  
  async function fetchLimit() {
    try {
      const response = await axios.post(
        `${baseUrl}/buy-sell-limit`,
        { user_id: userData.id.toString() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      
       const autoPlay = userData?.auto_play_sound === "1" ? "1" : "0";  
        localStorage.setItem("auto_play_sound", autoPlay);
    
      dispatch(
        setLimit({
          limit: {
            buy_limit: response.data.data.base_buy_limit,
            sell_limit: response.data.data.base_sell_limit,
            verified_social_media: response.data.data.verified_social_media,
          },
        })
      );

   
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchLimit();

    if (count != 0) {
      return;
    }

    console.log(userData);
    if (userData?.login_type?.toString().toLowerCase() == "true") {
      dispatch(setShowReferVerifyModel({ showReferVerifyModel: true }));
    } else {
      dispatch(setShowReferVerifyModel({ showReferVerifyModel: false }));
    }
  }, []);

  return (
    <div className="mt-24 px-2 flex flex-col gap-2 max-w-lg mx-auto min-h-screen">
      <Balance />
      <Action />
      <TrxCard />
      <Footer />
      <DepositSlider />
      <WithdrawSlider />
      <ReferalVerifyModel />
    </div>
  );
};

export default Dashboard;
