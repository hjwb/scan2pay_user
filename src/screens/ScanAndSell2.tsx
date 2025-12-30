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
import { IoIosWarning } from "react-icons/io";

type Currency = "INR" | "USDT" | "USDC" | "GBK";

interface Assets {
  total_usdt: string;
  total_usdc: string;
  total_gbk: string;
}

type Amounts = Record<Currency, string>;
interface Assets {
  total_usdt: string;
  total_usdc: string;
}

const ScanAndSell: React.FC = () => {
  const navigate = useNavigate();

  const { showSuccess } = useShowSuccess();
  const { showError } = useShowError();

  // token select
  // const [liveMerchants, setLiveMerchants] = useState(0);
  const [loading, setloading] = useState(false);
  const [token, setToken] = useState<"usdt" | "usdc" | "gbk">("usdt");
  const [assetsData, setAssetsData] = useState<Assets | null>(null);
  const [amounts, setAmounts] = useState<Amounts>({
    INR: "0",
    USDT: "0",
    USDC: "0",
    GBK: "0",
  });
  const [enabled, setEnabled] = useState({
    gbk: true,
    usdc: true,
    usdt: true,
    payment_mode: "automatic",
    gateway_fee: 0.0,
    gateway_fee_inr: 0.0,
  });
  // @ts-ignore
  const [refresh, setRefresh] = useState<boolean>(false);
  const [fee, setFee] = useState(0.0);
  const [fees, setFees] = useState(0.0);
  const [gst, setGst] = useState(0.0);
  const [total, setTotal] = useState(0.0);

  const sellingPriceUSDT = useSelector(
    (state: RootState) => state.price.sellingPriceUSDT
  );
  const sellingPriceUSDC = useSelector(
    (state: RootState) => state.price.sellingPriceUSDC
  );
  const sellingPriceGBK = useSelector(
    (state: RootState) => state.price.sellingPriceGBK
  );
  const baseUrl = useSelector((state: RootState) => state.consts.baseUrl);
  const availableBalance =
    token === "usdt" ? assetsData?.total_usdt : assetsData?.total_usdc;
  const tokenHeader = useSelector((state: RootState) => state.user.token);
  const limit = useSelector((state: RootState) => state.price.limit);
  const userData = useSelector((state: RootState) => state.user.userData);

  const pairFrom = "INR";
  const pairTo = token === "usdt" ? "USDT" : token === "usdc" ? "USDC" : "GBK";
  const currentAmount = amounts[pairFrom as Currency];

  // existing app logic (fetchBalance kept minimal as before)

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
      console.log(response.data);
      setAssetsData(response.data.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchBalance();
  }, [refresh]);

  useEffect(() => {
    const cryptoAmount = amounts[pairTo];

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
    if (amounts[pairFrom] == "0") {
      setAmounts((prev) => ({
        ...prev,
        [pairTo]: "",
      }));
    } else {
      const price =
        parseFloat(amounts[pairFrom]) /
        parseFloat(
          pairTo === "USDT"
            ? sellingPriceUSDT
            : pairTo === "USDC"
            ? sellingPriceUSDC
            : sellingPriceGBK
        );

      setAmounts((prev) => ({
        ...prev,
        [pairTo]: price.toFixed(4).toString(),
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAmount, token]);

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

  const updateAmount = (value: string) => {
    if (value == "0" && amounts[pairFrom] == "0") return;

    if (amounts[pairFrom].split("").includes(".") && value == ".") return;

    setAmounts((prev) => {
      const current = prev[pairFrom];

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
        [pairFrom]: updated,
      };
    });
  };

  function backspace() {
    if (amounts[pairFrom] === "0") return;

    if (amounts[pairFrom].length == 1) {
      setAmounts((prev) => ({
        ...prev,
        [pairFrom]: "0",
      }));
      return;
    }

    const editedValue = amounts[pairFrom].slice(
      0,
      amounts[pairFrom].length - 1
    );
    setAmounts((prev) => ({
      ...prev,
      [pairFrom]: editedValue,
    }));
  }

  function handleClear() {
    setAmounts((prev) => ({
      ...prev,
      [pairFrom]: "0",
    }));
  }

  async function handleProceedToConfirm() {
    try {
      setloading(true);

      // *** UPDATED: API must send USDT/USDC as 'amount' AND INR separately ***
      // if (parseInt(amounts[pairFrom]) < 10) {
      //   showError("Minimum INR amount is 10.", "");
      //   setloading(false);
      //   return;
      // }

      if(limit?.sell_limit < amounts[pairTo]){
        showError(`Limit exceeded! Your sell limit is ${limit?.sell_limit} USDT.`, "");
        setloading(false);
        return;
      }

      const response = await axios.post(
        `${baseUrl}/buy-order`,
        {
          user_id: userData?.id,
          amount: amounts[pairTo], // USDT/USDC
          inr_amount: amounts[pairFrom], // INR
          type: token,
          order_type: "scan",
          fees,
          total_fees: total,
        },
        {
          headers: {
            Authorization: `Bearer ${tokenHeader}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log({ response });
      if (response.data.status) {
        showSuccess("Transaction Requested.", "");
        const inr = amounts["INR"] || "0";
        const tokenAmount = amounts[pairTo as Currency] || "0";
        navigate(
          `/confirm-sell/${encodeURIComponent(inr)}/${encodeURIComponent(
            tokenAmount
          )}/${response.data.order_id}?token=${token}`
        );
      }
    } catch (error) {
      showError(error.response.data.message, "");
    } finally {
      setloading(false);
    }
  }

  const priceData = useSelector((state: RootState) => state.price);
  const activeSellingPrice =
    token === "usdt" ? priceData.sellingPriceUSDT : priceData.sellingPriceUSDC;

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

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-lg overflow-hidden w-full px-2 mt-9">
        <div className="card flex items-center justify-center gap-3 bg-[#e0defa] rounded-lg py-3 font-semibold text-sm">
          <div
            className={`w-4 h-4 bg-indigo-300 rounded-full flex items-center justify-center`}
          >
            <div
              className={`w-2.5 h-2.5 bg-indigo-600 rounded-full animate-ping`}
              style={{ animationDuration: "1.4s" }}
            ></div>
          </div>
          Please ask the vendor for the bill amount first.
        </div>

        <div className=" text-center mt-1">
          <div className="font-bold text-xl flex justify-center gap-3 items-center">
            <span className="text-5xl font-extrabold text-[#847ef1] ">
              {amounts[pairFrom as Currency]}
            </span>
            {/* Token selector - keep your Select component usage */}
            INR
          </div>

          <div className="mt-2 text-lg gap-2 w-fit flex mx-auto font-semibold items-center">
            <CgArrowsExchangeAltV className="bg-[#e0defa] cursor-pointer rounded-full p-.5 text-2xl text-[#4D43EF]" />{" "}
            {amounts[pairTo] !== "0" && amounts[pairTo]}
            <select
              value={token}
              onChange={(e) => {
                const v = e.target.value as "usdt" | "usdc" | "gbk";
                setAmounts({
                  INR: "0",
                  USDT: "0",
                  USDC: "0",
                  GBK: "0",
                });
                setToken(v);
              }}
              className="border px-2 py-1 rounded text-lg"
            >
              {enabled.usdt && <option value="usdt">USDT</option>}
              {enabled.usdc && <option value="usdc">USDC</option>}
              {enabled.gbk && <option value="gbk">GBK</option>}
            </select>
          </div>

          <div className="font-semibold text-gray-600 mt-3 txt">
            Available Balance:{" "}
            <span className="font-bold text-[#4D43EF]">
              {availableBalance
                ? parseFloat(availableBalance)?.toFixed(4)
                : "0.0000"}{" "}
              {pairTo}
            </span>
          </div>
        </div>

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

        {parseFloat(amounts[pairTo]) < 10 &&
          parseFloat(amounts[pairFrom]) > 15 && (
            <div className="flex gap-3 items-center bg-yellow-300/30 rounded-lg mt-3 py-3 px-5">
              <IoIosWarning className="text-yellow-500" size={25} />
              <div className="flex-1 text-sm font-semibold">
                Flat {fee.toFixed(4)} USDT fee and applies for order below 10
                USDT. You will pay {total.toFixed(4)} USDT.
              </div>
            </div>
          )}

        {parseFloat(amounts[pairTo]) >= 10 && (
          <div className="flex gap-3 items-center bg-yellow-300/30 rounded-lg mt-3 py-3 px-5">
            <IoIosWarning className="text-yellow-500" size={25} />
            <div className="flex-1 text-sm font-semibold">
              Flat {fee.toFixed(4)} USDT fee and 18%({gst.toFixed(4)}) GST over
              it applies for order above 10 USDT. You will pay{" "}
              {total.toFixed(4)} USDT.
            </div>
          </div>
        )}

        <div
          onClick={() => {
            navigate("/limit");
          }}
          className="card bg-[#e0defa] cursor-pointer hover:scale-105 transition ease=in-out duration-300 rounded-lg items-center py-3 px-2 my-2 md:my-3 flex justify-center gap-3"
        >
          <FaRegCreditCard className="text-xl text-[#4D43EF]" />
          <span className="font-semibold text-sm">
            Your Transaction Limit :{" "}
            <span className=" text-[#4D43EF]">
              {limit?.sell_limit} USDT BEP20/BNB CHAIN
            </span>
          </span>
          <FaGreaterThan className="text-sm text-gray-600" />
        </div>

        <Keypad updateAmount={updateAmount} backspace={backspace} />

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

        <div>
          <button
            disabled={amounts["INR"] == "0" || loading}
            onClick={handleProceedToConfirm}
            className="w-full mt-2 disabled:bg-[#4D43EF]/60 disabled:cursor-not-allowed bg-[#4D43EF] text-white font-semibold py-4 md:py-3 rounded-lg hover:bg-[#4D43EF]/70 transition ease-in-out duration-300 cursor-pointer"
          >
            {loading ? "Processing..." : "Proceed to Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScanAndSell;
