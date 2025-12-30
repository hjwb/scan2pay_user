import React, { useEffect, useState } from "react";
import { CgArrowsExchangeAltV } from "react-icons/cg";
import { FaRegCreditCard } from "react-icons/fa";
import { FaGreaterThan } from "react-icons/fa6";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import Keypad from "@/components/common/Keypad";
import { useNavigate } from "react-router";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { useShowError } from "@/hooks/useShowError";
import { useShowSuccess } from "@/hooks/useShowSuccess";
import Model from "@/components/buy/Model";
import PaymentConfirmation from "@/components/buy/PaymentConfirmation";

type Currency = "INR" | "USDT" | "USDC";

type Pair = {
  from: Currency;
  to: Currency;
};
type Amounts = Record<Currency, string>;

const TOTAL_TIME = 420;

const Buy: React.FC = () => {
  const navigate = useNavigate();

  const [token, setToken] = useState("usdt");
  const [loading, setloading] = useState(false);
  const [open, setOpen] = useState(false);
  const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);
  const [order_id, setOrder_Id] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [enabled, setEnabled] = useState({
    gbk: true,
    usdc: true,
    usdt: true,
    payment_mode: "automatic",
    gateway_fee: 0.0,
    gateway_fee_inr: 0.0,
  });
  // const [liveMerchants, setLiveMerchants] = useState(0);
  const { showSuccess } = useShowSuccess();
  const { showError } = useShowError();

  // *** UPDATED: INPUT = INR, OUTPUT = USDT / USDC ***
  const pair: Pair = { from: "INR", to: token.toUpperCase() as Currency };

  const [amounts, setAmounts] = useState<Amounts>({
    INR: "0",
    USDT: "0",
    USDC: "0",
  });
  // @ts-ignore
  const [fee, setFee] = useState(0.0);
  const [fees, setFees] = useState(0.0);
  // @ts-ignore
  const [gst, setGst] = useState(0.0);
  const [total, setTotal] = useState(0.0);

  const currentAmount = amounts[pair.from];

  const buyingPrice = useSelector((state: RootState) =>
    token == "usdt" ? state.price.buyingPriceUSDT : state.price.buyingPriceUSDC
  );
  const limit = useSelector((state: RootState) => state.price.limit);
  const baseUrl = useSelector((state: RootState) => state.consts.baseUrl);
  const userData = useSelector((state: RootState) => state.user.userData);
  const tkn = useSelector((state: RootState) => state.user.token);
  const priceData = useSelector((state: RootState) => state.price);
  const activeSellingPrice =
    token === "usdt" ? priceData.sellingPriceUSDT : priceData.sellingPriceUSDC;

  useEffect(() => {
    const cryptoAmount = amounts[pair.to];
    console.log(amounts);
    if (amounts.INR == "0") {
      setFee(0);
      setGst(0);
      setTotal(0);
    } else if (parseFloat(amounts.INR) < 15) {
      setFee(0);
      setFees(0);
      setGst(0);
      setTotal(parseFloat(cryptoAmount));
    } else if (parseFloat(cryptoAmount) < 10 && amounts.INR !== "0") {
      const usdValue =
        enabled.gateway_fee_inr / parseFloat(activeSellingPrice || "1");
      setFee(usdValue);
      const gstValue = (usdValue * 18) / 100;
      setFees(usdValue);
      setGst(gstValue);
      setTotal(parseFloat(cryptoAmount) + usdValue + gstValue);
    } else {
      const usdValue =
        (parseFloat(cryptoAmount ?? "0") * enabled?.gateway_fee) / 100;
      setFee(usdValue);
      const gstValue = (usdValue * 18) / 100;
      setGst(gstValue);
      setTotal(parseFloat(cryptoAmount) + usdValue + gstValue);
    }
  }, [amounts]);

  useEffect(() => {
    if (amounts[pair.from] == "0") {
      setAmounts((prev) => ({
        ...prev,
        [pair.to]: "",
      }));
    } else {
      // *** UPDATED FORMULA: INR → USDT/USDC ***
      const price =
        parseFloat(amounts[pair.from]) / parseFloat(buyingPrice || "1");

      setAmounts((prev) => ({
        ...prev,
        [pair.to]: price,
      }));
    }
  }, [currentAmount, token]);

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

  const updateAmount = (value: string) => {
    if (value == "0" && amounts[pair.from] == "0") return;

    if (amounts[pair.from].includes(".") && value == ".") return;

    setAmounts((prev) => {
      const current = prev[pair.from];

      let updated: string;

      if (current === "0" && value === ".") {
        updated = "0.";
      } else if (current === "0") {
        updated = value;
      } else {
        updated = current + value;
      }
      return {
        ...prev,
        [pair.from]: updated,
      };
    });
  };

  function backspace() {
    if (amounts[pair.from] === "0") return;

    if (amounts[pair.from].length == 1) {
      setAmounts((prev) => ({
        ...prev,
        [pair.from]: "0",
      }));
      return;
    }

    const editedValue = amounts[pair.from].slice(
      0,
      amounts[pair.from].length - 1
    );
    setAmounts((prev) => ({
      ...prev,
      [pair.from]: editedValue,
    }));
  }

  function handleClear() {
    setAmounts((prev) => ({
      ...prev,
      [pair.from]: "0",
    }));
  }

  async function handleBuy() {
    try {
      setloading(true);

      if(limit?.buy_limit < amounts[pair.to]){
        showError(`Limit exceeded! Your buy limit is ${limit?.buy_limit} USDT.`, "");
        setloading(false);
        return;
      }

      // *** UPDATED: API must send USDT/USDC as 'amount' AND INR separately ***
      const response = await axios.post(
        `${baseUrl}/buy-order`,
        {
          user_id: userData?.id,
          amount: amounts[pair.to], // USDT/USDC
          inr_amount: amounts[pair.from], // INR
          type: token,
          order_type: "buy",
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
   

    if (response?.data?.status === true) {
      setOrder_Id(response?.data?.order_id);
      setOpen(true);
      showSuccess("Transaction Requested.", "");
    } else {
      showError(response?.data?.message || "Something went wrong", "");
    }
  
    



    } catch (error) {
      showError(error.response.data.message, "");
      setAmounts({ INR: "0", USDT: "0", USDC: "0" });
    } finally {
      setloading(false);
    }
  }

  async function fetchData() {
    try {
      const response = await axios.get(`${baseUrl}/enabled-currencies`);
      setEnabled(response.data.enabled_currencies);
      // console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);
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

  return (
    <div className="min-h-screen flex items-center justify-center">
      {open && (
        <Model
          timeLeft={timeLeft}
          amount={amounts[pair.from]}
          setOpen={setOpen}
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
          <div className="flex justify-center gap-3 items-center font-bold text-xl">
            <p className="text-5xl pb-1 font-extrabold text-[#847ef1] ">
              {amounts[pair.from]}
            </p>{" "}
            INR
          </div>
          <div className="mt-1 text-lg gap-2 w-fit flex mx-auto font-semibold items-center">
            <CgArrowsExchangeAltV className="bg-[#e0defa] cursor-pointer rounded-full p-.5 text-2xl text-[#4D43EF]" />{" "}
            {amounts[pair.to] !== "0" && amounts[pair.to]
              ? parseFloat(amounts[pair.to]).toFixed(4)
              : "0"}{" "}
            <Select value={token} onValueChange={setToken}>
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
        </div>

        {/* <div className="flex  items-center  gap-2 mt-2 mx-auto w-fit px-6 py-2 rounded-full bg-[#4D43EF]/10 border border-[#4D43EF]/40 font-bold text-[#4D43EF] relative overflow-hidden">
          <div
            className={`w-4 h-4 bg-green-300 rounded-full flex items-center justify-center`}
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

        <style>
          {`
@keyframes shine {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
`}
        </style>

        <div
          onClick={() => {
            navigate("/limit");
          }}
          className="card bg-[#e0defa] relative cursor-pointer hover:scale-105 transition ease=in-out duration-300 rounded-lg items-center py-3 px-2 my-2 md:my-4 flex justify-center gap-3"
        >
          <FaRegCreditCard className="text-xl text-[#4D43EF]" />
          <span className="font-semibold text-sm">
            Your Buy Limit :{" "}
            <span className=" text-[#4D43EF]">
              {limit?.buy_limit} USDT BEP20/BNB CHAIN
            </span>
          </span>
          <FaGreaterThan
            size={10}
            className="text-sm text-gray-600 absolute right-10"
          />
        </div>

        <Keypad updateAmount={updateAmount} backspace={backspace} />

        <div className="flex gap-3 mt-2">
          <button
            onClick={handleClear}
            className="cursor-pointer bg-gray-200 flex-1 text-[#4D43EF] hover:bg-gray-300 py-4 md:py-3 rounded-lg transition ease-in-out duration-300 font-semibold"
          >
            Clear
          </button>
        </div>
        <div>
          <button
            disabled={amounts["INR"] === "0"}
            onClick={handleBuy}
            className="w-full mt-3 disabled:bg-[#4D43EF]/60 disabled:cursor-not-allowed bg-[#4D43EF] text-white font-semibold py-4 md:py-3 rounded-lg hover:bg-[#4D43EF]/70 transition ease-in-out duration-300 cursor-pointer"
          >
            {loading ? "Buying..." : "Buy"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Buy);
