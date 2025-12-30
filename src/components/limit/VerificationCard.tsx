import { setLimit } from "@/store/slices/priceSlice";
import type { AppDispatch, RootState } from "@/store/store";
import axios from "axios";
import React, { useEffect } from "react";
import {
  FaFacebook,
  FaGithub,
  FaLinkedinIn,
  FaSquareInstagram,
  FaXTwitter,
} from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";

const data = [
  { icon: FaXTwitter, tag: "X", price: "50", bonus: "0.5 " },
  { icon: FaSquareInstagram, tag: "Instagram", price: "50 ", bonus: "0.5" },
  { icon: FaFacebook, tag: "Facebook", price: "50 ", bonus: "0.5" },
  { icon: FaLinkedinIn, tag: "LinkedIn", price: "100 ", bonus: "2" },
  { icon: FaGithub, tag: "GitHub", price: "100 ", bonus: "2" },
];
const VerificationCard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const baseUrl = useSelector((state: RootState) => state.consts.baseUrl);
  const userData = useSelector((state: RootState) => state.user.userData);
  const tkn = useSelector((state: RootState) => state.user.token);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.post(
          `${baseUrl}/user-social-media-details`,
          {},
          {
            headers: {
              Authorization: `Bearer ${tkn}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  async function fetchLimit() {
    try {
      const response = await axios.post(
        `${baseUrl}/buy-sell-limit`,
        { user_id: userData.id.toString() },
        {
          headers: {
            Authorization: `Bearer ${tkn}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
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

  async function handleVerification() {
    try {
      const response = await axios.post(
        `${baseUrl}/verify-social-media`,
        {},
        {
          headers: {
            Authorization: `Bearer ${tkn}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      fetchLimit();
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="mt-10 flex flex-col gap-5">
      {data.map((item, index) => (
        <div
          key={index}
          className="border border-gray-400 py-4 px-3 rounded-lg flex items-start"
        >
          <div className="flex-1 flex items-center gap-3">
            <div className="text-[#4D43EF] bg-[#d5d3f8] p-3 rounded-full">
              <item.icon size={20} />
            </div>
            <span className="font-semibold text-lg">{item.tag}</span>
          </div>
          <div className="text-right flex flex-col gap-5">
            <div>
              <div className="text-xs font-semibold">
                <span className="text-xl font-bold">${item.price}</span> Limit
              </div>
              <div className="text-xs font-semibold">
                +{item.bonus} USDT Reward
              </div>
            </div>
            <div>
              <button
                onClick={handleVerification}
                className="text-sm font-bold border-2 px-7 py-2 rounded-lg text-[#4D43EF] border-[#4D43EF] cursor-pointer hover:text-white hover:bg-[#4D43EF] transition ease-in-out duration-300"
              >
                Get Verified
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VerificationCard;
