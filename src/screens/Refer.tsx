import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useNavigate } from "react-router";
import { referAndEarnFaq } from "@/Data/faq";
import { Spinner } from "@/components/ui/spinner";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { Copy } from "lucide-react";
import axios from "axios";
import { useShowError } from "@/hooks/useShowError";
import { useShowSuccess } from "@/hooks/useShowSuccess";

const Refer: React.FC = () => {
  const [generateLink, setGenerateLink] = useState(false);
  const [loading, setLoading] = useState(false);
  const [claimData, setClaimData] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [loader, setLoader] = useState("");

  const { showError } = useShowError();
  const { showSuccess } = useShowSuccess();

  const userData = useSelector((state: RootState) => state.user.userData);
  const baseUrl = useSelector((state: RootState) => state.consts.baseUrl);
  const token = useSelector((state: RootState) => state?.user?.token);
  const limit = useSelector((state: RootState) => state?.price?.limit);

  const navigate = useNavigate();

  const handleGenerateLink = () => {
    if (limit?.buy_limit <= claimData?.link_limit) {
      showError(
        "Error Generating Limit",
        `Buy limit must be atleast ${claimData.link_limit} `
      );
      return;
    }
    setLoading(true);

    setTimeout(() => {
      setGenerateLink(true);
      setLoading(false);
    }, 1000);
  };

  async function fetchRewardData() {
    try {
      const response = await axios.post(
        `${baseUrl}/refer-earn-limit`,
        { user_id: userData?.id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log({ response: response.data.data });
      setClaimData(response.data.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchRewardData();
  }, [refresh]);

  async function claimReward(type) {
    try {
      setLoader(type);
      const response = await axios.post(
        `${baseUrl}/referral-income`,
        { user_id: userData?.id, type },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response?.data);
      setRefresh((prev) => !prev);
      showSuccess(`${type.toUpperCase()} claim successful!`, "");
    } catch (error) {
      console.log(error);
      showError("Claim Failed!", "");
    } finally {
      setLoader("");
    }
  }
  return (
    <div className="mt-24 px-2 flex flex-col gap-2 max-w-lg mx-auto">
      <div className="text-xl font-bold">
        Refer your friends & Earn {claimData?.refer_earning}% of their volume
      </div>

      <div className="card mt-6 px-3 md:px-5 border-b-2 border-r border-[#4D43EF] py-5  bg-linear-to-br from-[#7728E2] via-[#5C5AD7] to-[#22BDCF] shadow-xl rounded-lg">
        <div className="font-semibold text-lg text-white">Refer & Earn</div>
        <p className="text-xs text-white font-semibold txt">
          Share your referral link with friends and earn {userData.refre_earn}%
          every time they trade.
        </p>
        <div className="py-3 px-3 mt-3 bg-white rounded-lg">
          <div className="font-bold text-sm">Invite via referral link</div>
          {generateLink ? (
            <div className="flex justify-between text-sm font-semibold mt-3 py-2 bg-[#d7d5fd]  px-2 rounded-lg items-center">
              https://scan2pay.direct/users/{userData.id}{" "}
              <Copy
                className="cursor-pointer hover:text-[#4D43EF] transition ease-in-out duration-300"
                onClick={() => {
                  navigator.clipboard
                    .writeText(
                      userData?.id
                        ? String(`https://scan2pay.direct/users/${userData.id}`)
                        : ""
                    )
                    .then(() => {
                      alert("Link copied to clipboard!");
                    })
                    .catch((err) => {
                      console.error("Failed to copy: ", err);
                    });
                }}
                size={15}
              />
            </div>
          ) : (
            <button
              onClick={handleGenerateLink}
              disabled={loading}
              className="bg-[#4D43EF] font-semibold cursor-pointer text-white w-full py-2 rounded-lg mt-3 hover:bg-[#4D43EF]/70 transition ease-in-out duration-300"
            >
              {loading ? (
                <Spinner className="size-6 mx-auto" />
              ) : (
                "Generate Link"
              )}
            </button>
          )}
        </div>
        {/* <div className="py-3 px-3 bg-white rounded-lg mt-3 flex items-center">
          <div className="flex-1">
            <div className="text-sm font-semibold text-gray-700">
              Claimable Rewards
            </div>
            <div className="text-[#4D43EF] font-extrabold text-lg">
              {claimData?.claim_usdc_limit == "0"
                ? "0"
                : claimData?.claim_usdc_limit
                ? claimData?.claim_usdc_limit
                : "Loading.."}{" "}
              USDC
            </div>
          </div>
          <button
            onClick={() => {
              claimReward("usdc");
            }}
            disabled
            className="bg-[#4D43EF] font-semibold cursor-pointer text-white  py-1.5 px-3 rounded-lg hover:bg-[#4D43EF]/70 transition ease-in-out duration-300"
          >
            {loader == "usdc" ? (
              <Spinner className="size-6 mx-7.5" />
            ) : (
              "Claim USDC"
            )}
          </button>
        </div> */}
        <div className="py-3 px-3 bg-white rounded-lg mt-3 flex items-center">
          <div className="flex-1">
            <div className="text-sm font-semibold text-gray-700">
              Claimable Rewards
            </div>
            <div className="text-[#4D43EF] font-extrabold text-lg">
              {claimData?.claim_usdt_limit == "0"
                ? "0"
                : claimData?.claim_usdt_limit
                ? claimData?.claim_usdt_limit
                : "Loading.."}{" "}
              USDT
            </div>
          </div>
          <button
            onClick={() => {
              claimReward("usdt");
            }}
            disabled
            className="bg-[#4D43EF] font-semibold cursor-pointer text-white  py-1.5 px-3 rounded-lg hover:bg-[#4D43EF]/70 transition ease-in-out duration-300"
          >
            {loader == "usdt" ? (
              <Spinner className="size-6 mx-7.5" />
            ) : (
              "Claim USDT"
            )}
          </button>
        </div>
      </div>

      <div className="mt-5 mb-10">
        <div className="flex justify-between items-center">
          <div className="font-bold text-lg">FAQs</div>
          <div
            onClick={() => navigate("/support")}
            className="text-[#4D43EF] underline hover:text-blue-800 transition ease-in-out duration-300 font-semibold cursor-pointer"
          >
            See all
          </div>
        </div>{" "}
        <Accordion type="single" collapsible>
          {referAndEarnFaq.slice(0, 3).map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger className="cursor-pointer">
                {item.question}
              </AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default Refer;
