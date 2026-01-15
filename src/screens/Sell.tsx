import React, { useEffect, useState } from "react";
import { CgArrowsExchangeAltV } from "react-icons/cg";
import { FaRegCreditCard } from "react-icons/fa";
import { FaGreaterThan } from "react-icons/fa6";
import type { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import Keypad from "@/components/common/Keypad";
import { useNavigate } from "react-router";
import axios from "axios";
import { useShowError } from "@/hooks/useShowError";
import { useShowSuccess } from "@/hooks/useShowSuccess";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Model from "@/components/sell/Model";
import PaymentConfirmation from "@/components/buy/PaymentConfirmation";
import { IoIosWarning } from "react-icons/io";

type Currency = "INR" | "USDT" | "USDC";

interface Assets {
  total_usdt: string;
  total_usdc: string;
}

type Amounts = Record<Currency, string>;
const TOTAL_TIME = 420;
const Sell: React.FC = () => {
  const navigate = useNavigate();

  const [token, setToken] = useState<"usdt" | "usdc">("usdt");

  const [amounts, setAmounts] = useState<Amounts>({
    INR: "0",
    USDT: "0",
    USDC: "0",
  });

  const [enabled, setEnabled] = useState({
    gbk: true,
    usdc: true,
    usdt: true,
    payment_mode: "automatic",
    gateway_fee: 0.0,
    gateway_fee_inr: 0.0,
  });

  const [assetsData, setAssetsData] = useState<Assets | null>(null);
  const [refresh, setRefresh] = useState(false);
  const [order_id, setOrder_Id] = useState(null);
  const [loading, setLoading] = useState(false);
  // const [liveMerchants, setLiveMerchants] = useState(0);
  const [open, setOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);
  const [fee, setFee] = useState(0.0);
  const [fees, setFees] = useState(0.0);
  // @ts-ignore
  const [gst, setGst] = useState(0.0);
  const [total, setTotal] = useState(0.0);

  const priceData = useSelector((state: RootState) => state.price);
  const limit = useSelector((state: RootState) => state.price.limit);
  const baseUrl = useSelector((state: RootState) => state.consts.baseUrl);
  const userData = useSelector((state: RootState) => state.user.userData);
  const tokenHeader = useSelector((state: RootState) => state.user.token);
  const tkn = useSelector((state: RootState) => state.user.token);

  const { showError } = useShowError();
  const { showSuccess } = useShowSuccess();

  const activeSellingPrice =
    token === "usdt" ? priceData.sellingPriceUSDT : priceData.sellingPriceUSDC;

  const availableBalance =
    token === "usdt" ? assetsData?.total_usdt : assetsData?.total_usdc;

  // useEffect(() => {
  //   const fetchLiveMerchants = async () => {
  //     try {
  //       const response = await axios.get(`${baseUrl}/live-merchants`);
  //       setLiveMerchants(response.data.data.count);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   fetchLiveMerchants();
  // }, []);

  useEffect(() => {
    const cryptoAmount = token === "usdt" ? amounts.USDT : amounts.USDC;
     const inrAmount = parseFloat(amounts.INR || "0");

    console.log(enabled);
    if (amounts.INR == "0") {
      setFee(0);
      setGst(0);
      setTotal(0);
    } else if (inrAmount < 15) {
      setFee(0);
      setFees(0);
      setGst(0);
      setTotal(parseFloat(cryptoAmount));
    }        
    else if (inrAmount < 1000 && amounts.INR !== "0"  ) {
      const usdValue =
        enabled?.gateway_fee_inr / parseFloat(activeSellingPrice || "1");
      setFee(usdValue);
      const gstValue = (usdValue * 18) / 100;
      setFees(usdValue);
      setGst(gstValue);
      setTotal(parseFloat(cryptoAmount) + usdValue + gstValue);
    } 
    else if (inrAmount >= 1000) {
     const usdValue =0;    
      setFee(usdValue);
      const gstValue = (usdValue * 18) / 100;
      setGst(gstValue);
      setTotal(parseFloat(cryptoAmount) + usdValue + gstValue);

    }  
    else {
      const usdValue =(parseFloat(cryptoAmount ?? "0") * enabled?.gateway_fee) / 100;    
      setFee(usdValue);
      const gstValue = (usdValue * 18) / 100;
      setGst(gstValue);
      setTotal(parseFloat(cryptoAmount) + usdValue + gstValue);
    }
  }, [amounts]);

  async function fetchData() {
    try {
      const response = await axios.get(`${baseUrl}/enabled-currencies`);
      setEnabled(response.data.enabled_currencies);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let interval;

    if (open) {
      setTimeLeft(TOTAL_TIME);

      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setOpen(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [open]);

  async function fetchBalance() {
    try {
      const response = await axios.post(
        `${baseUrl}/user-currency-list`,
        { user_id: userData?.id },
        {
          headers: {
            Authorization: `Bearer ${tokenHeader}`,
            "Content-Type": "application/json",
          },
        }
      );

      // console.log(response.data.data)
      setAssetsData(response.data.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchBalance();
  }, [refresh]);

  // ---------------------------------------------
  // 🔄 REVERSED LOGIC: INR → convert to USDT/USDC
  // ---------------------------------------------
  useEffect(() => {
    if (!amounts.INR || amounts.INR === "0") {
      setAmounts((prev) => ({
        ...prev,
        USDT: "0",
        USDC: "0",
      }));
      return;
    }

    const inrValue = parseFloat(amounts.INR);
    const usdValue = inrValue / parseFloat(activeSellingPrice || "1");

    setAmounts((prev) => ({
      ...prev,
      USDT: token === "usdt" ? usdValue.toFixed(6) : prev.USDT,
      USDC: token === "usdc" ? usdValue.toFixed(6) : prev.USDC,
    }));
  }, [amounts.INR, token, activeSellingPrice]);

  // ---------------------------------------------
  // 🔢 Keypad now edits INR ONLY
  // ---------------------------------------------
  const updateAmount = (value: string) => {
    const current = amounts.INR;

    if (value === "0" && current === "0") return;
    if (current.includes(".") && value === ".") return;

    const updated =
      current === "0" ? (value === "." ? "0." : value) : current + value;

    setAmounts((prev) => ({
      ...prev,
      INR: updated,
    }));
  };

  const backspace = () => {
    const current = amounts.INR;

    if (current === "0") return;

    if (current.length === 1) {
      setAmounts((prev) => ({ ...prev, INR: "0" }));
      return;
    }

    setAmounts((prev) => ({
      ...prev,
      INR: current.slice(0, -1),
    }));
  };

  const handleClear = () => {
    setAmounts((prev) => ({ ...prev, INR: "0" }));
  };

  const handleMax = () => {
    // INR MAX = crypto_balance * price
    const bal =
      token === "usdt"
        ? parseFloat(assetsData?.total_usdt || "0")
        : parseFloat(assetsData?.total_usdc || "0");

    const maxInr = bal * parseFloat(activeSellingPrice || "1");

    setAmounts((prev) => ({
      ...prev,
      INR: maxInr.toFixed(2),
    }));
  };

  // ---------------------------------------------
  // 🟣 Submit SELL using converted crypto amount
  // ---------------------------------------------
  async function handlSell() {
    const cryptoAmount = token === "usdt" ? amounts.USDT : amounts.USDC;

    // if (parseFloat(cryptoAmount) > parseFloat(availableBalance)) {
    //   showError("Insufficient Balance", "");
    //   return;
    // }

    try {
      setLoading(true);

      // if (parseInt(amounts.INR) < 10) {
      //   showError("Minimum sell amount is 10 INR", "");
      //   setLoading(false);
      //   return;
      // }
      if(limit?.sell_limit < cryptoAmount){
        showError(`Limit exceeded! Your sell limit is ${limit?.sell_limit} USDT.`, "");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        `${baseUrl}/buy-order`,
        {
          user_id: userData?.id,
          amount: cryptoAmount, // ✔ sending crypto
          inr_amount: amounts.INR, // ✔ entered by user
          type: token,
          order_type: "sell",
          fees,
          total_fees: total,
        },
        {
          headers: {
            Authorization: `Bearer ${tkn}`,
            "Content-Type": "application/json",
          },
        }
      );

      // if (enabled?.payment_mode == "automatic"){

      // }
      if (response.data.status) {
        setOrder_Id(response?.data?.order_id);
        setOpen(true);
        showSuccess("Transaction Requested.", "");
        setRefresh((prev) => !prev);
      }
    } catch (error) {
      showError(error.response.data.message, "");
      setAmounts({ INR: "0", USDT: "0", USDC: "0" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      {open && (
        <Model
          timeLeft={timeLeft}
          setOpen={setOpen}
          method={enabled?.payment_mode}
          order_id={order_id}
          setAmounts={setAmounts}
          setShowPaymentConfirmation={setShowPaymentConfirmation}
        />
      )}

      {showPaymentConfirmation && (
        <PaymentConfirmation
          order_id={order_id}
          setOrder_Id={setOrder_Id}
          setAmounts={setAmounts}
          setShowPaymentConfirmation={setShowPaymentConfirmation}
        />
      )}

      <div className="max-w-lg overflow-hidden w-full px-2">
        <div className="text-center">
          {/* Amount + Token Selector */}
          <div className="flex justify-center gap-3 items-center font-bold text-xl">
            <p className="text-5xl pb-1 font-extrabold text-[#847ef1] ">
              {amounts.INR}
            </p>
            INR
          </div>

          {/* Conversion */}
          <div className="mt-1 text-lg gap-2 w-fit flex mx-auto font-semibold items-center">
            <CgArrowsExchangeAltV className="bg-[#e0defa] cursor-pointer rounded-full p-.5 text-2xl text-[#4D43EF]" />{" "}
            {token === "usdt" ? amounts.USDT : amounts.USDC}{" "}
            <Select
              value={token}
              onValueChange={(v) => {
                setAmounts({
                  INR: amounts.INR,
                  USDT: "0",
                  USDC: "0",
                });
                setToken(v as "usdt" | "usdc");
              }}
            >
              <SelectTrigger className="w-[100px] text-lg">
                <SelectValue placeholder="Select Token" />
              </SelectTrigger>

              <SelectContent>
                {enabled.usdt && <SelectItem value="usdt">USDT</SelectItem>}
                {enabled.usdc && <SelectItem value="usdc">USDC</SelectItem>}
                {enabled.gbk && <SelectItem value="gbk">GBK</SelectItem>}
              </SelectContent>
            </Select>
          </div>

          {/* Available Balance */}
          <div className="font-semibold text-gray-600 mt-2">
            Available Balance:{" "}
            <span className="font-bold text-[#4D43EF]">
              {availableBalance
                ? parseFloat(availableBalance)?.toFixed(4)
                : "0.0000"}{" "}
              {token?.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Live Merchants */}
        {/* <div className="flex  items-center  gap-2 mt-2 mx-auto w-fit px-6 py-2 rounded-full bg-[#4D43EF]/10 border border-[#4D43EF]/40 font-bold text-[#4D43EF] relative overflow-hidden">
          <div
            className={`w-4 h-4  bg-green-300 rounded-full flex items-center justify-center`}
          >
            <div
              className={`w-2.5 h-2.5 bg-green-600 rounded-full animate-ping`}
              style={{ animationDuration: "1.4s" }}
            ></div>
          </div>
          <span className="animate-[shine_2s_linear_infinite] absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"></span>
          <span className="relative z-10">
            Live Merchants – {liveMerchants}
          </span>
        </div> */}

        {parseFloat(amounts.USDT) < 10 && parseFloat(amounts.INR) > 15 && (
          <div className="flex gap-3 items-center bg-yellow-300/30 rounded-lg mt-3 py-3 px-5">
            <IoIosWarning className="text-yellow-500" size={25} />
            <div className="flex-1 text-sm font-semibold">
              Flat {fee.toFixed(4)} USDT fee applies for order below 10 USDT.
              You will pay {total.toFixed(4)} USDT.
            </div>
          </div>
        )}
        {parseFloat(amounts.USDT) >= 10 &&
          parseFloat(amounts.INR) < 1000 && (
          <div className="flex gap-3 items-center bg-yellow-300/30 rounded-lg mt-3 py-3 px-5">
            <IoIosWarning className="text-yellow-500" size={25} />
            <div className="flex-1 text-sm font-semibold">
              Flat {fee.toFixed(4)} USDT fee applies for order above 10 USDT.
              You will pay {total.toFixed(4)} USDT.
            </div>
          </div>
        )}

        {/* Limit Card */}
        <div
          onClick={() => navigate("/limit")}
          className="card bg-[#e0defa] cursor-pointer hover:scale-105 transition ease=in-out duration-300 rounded-lg items-center py-3 px-2 my-4 flex justify-center gap-3"
        >
          <FaRegCreditCard className="text-xl text-[#4D43EF]" />
          <span className="font-semibold text-sm">
            Your Sell Limit :
            <span className=" text-[#4D43EF]">
              {" "}
              {limit?.sell_limit} USDT BEP20/BNB CHAIN{" "}
            </span>
          </span>
          <FaGreaterThan className="text-sm text-gray-600" />
        </div>

        {/* Keypad */}
        <Keypad updateAmount={updateAmount} backspace={backspace} />

        {/* Max & Clear */}
        <div className="flex gap-3 mt-2">
          <button
            onClick={handleMax}
            className="cursor-pointer flex-1 text-[#4D43EF] hover:bg-gray-300 py-2 rounded-lg transition ease-in-out duration-300 font-semibold"
          >
            Max
          </button>
          <button
            onClick={handleClear}
            className="cursor-pointer flex-1 text-[#4D43EF] hover:bg-gray-300 py-2 rounded-lg transition ease-in-out duration-300 font-semibold"
          >
            Clear
          </button>
        </div>

        {/* Continue */}
        <div>
          <button
            disabled={amounts.INR === "0"}
            onClick={handlSell}
            className="w-full mt-2 disabled:bg-[#4D43EF]/60 disabled:cursor-not-allowed bg-[#4D43EF] text-white font-semibold py-4 rounded-lg hover:bg-[#4D43EF]/70 transition ease-in-out duration-300 cursor-pointer"
          >
            {loading ? "Processing..." : "Sell"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Sell);
