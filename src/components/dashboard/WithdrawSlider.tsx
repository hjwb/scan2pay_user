import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { setWithdrawSlider } from "@/store/slices/modelSlice";
import { AnimatePresence, motion } from "motion/react";
import { IoCloseCircleSharp } from "react-icons/io5";
import { IoMdArrowRoundBack } from "react-icons/io";
import axios from "axios";
import Tabs from "../Withdrawl/Tabs";
import Usdt from "../Withdrawl/Usdt";
import Usdc from "../Withdrawl/Usdc";
import { useShowError } from "@/hooks/useShowError";
import { useShowSuccess } from "@/hooks/useShowSuccess";
import { Spinner } from "../ui/spinner";
import { X } from "lucide-react";

interface Assets {
  total_usdt: string;
  total_usdc: string;
}

const WithdrawSlider: React.FC = () => {
  const [view, setView] = useState<number>(0);
  const [showModel, setShowModel] = useState<boolean>(false);
  const [assetsData, setAssetsData] = useState<Assets | null>(null);
  const [usdt, setUsdt] = useState<string>("");
  const [usdc, setUsdc] = useState<string>("");
  const [refresh, setRefresh] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [receiverAddress, setReceiverAddress] = useState<string>("");
  const [otp, setOtp] = useState("");

  const { showError } = useShowError();
  const { showSuccess } = useShowSuccess();

  const isWithdrawSliderVisible = useSelector(
    (state: RootState) => state.model.showWithdrawSlider
  );
  const baseUrl = useSelector((state: RootState) => state?.consts?.baseUrl);
  const userData = useSelector((state: RootState) => state?.user?.userData);
  const token = useSelector((state: RootState) => state?.user?.token);

  const dispatch = useDispatch<AppDispatch>();

  async function handleWithdraw() {
    try {
      setLoading(true);
      const type = view == 1 ? "usdt" : "usdc";
      const amount = view === 1 ? usdt : usdc;
      const balance =
        view === 1 ? assetsData?.total_usdt : assetsData?.total_usdc;

      if (amount > balance) {
        showError("Insufficient balance.", "");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        `${baseUrl}/withdraw`,
        {
          user_id: userData?.id,
          amount,
          from_wallet_address: String(userData?.wallet_address || ""),
          to_wallet_address: receiverAddress,
          type,
          // otp,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.data);
      if (response.data.status !== "success") {
        showError("Withdraw Failed", response?.data?.message);
        return;
      }

      setUsdt("");
      setUsdc("");
      setOtp("");
      setReceiverAddress("");
      setShowModel(false);
      setRefresh((prev) => !prev);
      showSuccess("Withdraw Successful.", "");
    } catch (error) {
      console.log(error);
      showError("Withdraw Failed.", "");
    } finally {
      setLoading(false);
    }
  }

  async function fetchBalance() {
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

      setAssetsData(response.data.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchBalance();
  }, [refresh]);

  function handleClose() {
    setView(0);
    setReceiverAddress("");
    setUsdc("");
    setUsdt("");
    setShowModel(false);
    dispatch(setWithdrawSlider({ showWithdrawSlider: false }));
  }

  return (
    <AnimatePresence mode="wait">
      {isWithdrawSliderVisible && (
        <motion.div
          key="sidebar-wrapper"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={handleClose}
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md"
        >
          <motion.div
            key="sidebar"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onClick={(e) => e.stopPropagation()}
            className="absolute py-4 md:py-5 px-5 slider bg-gray-100 border-t-2 rounded-t-xl border-gray-300 z-50 w-full bottom-0"
          >
            {view == 0 && (
              <div className="">
                <div className="font-bold text-lg flex items-center justify-between">
                  Withdraw Fund{" "}
                  <IoCloseCircleSharp
                    onClick={handleClose}
                    className="text-xl hover:text-[#4D43EF] transition ease-in-out duration-300 cursor-pointer"
                  />
                </div>
                <p className="text-xs text-gray-900 txt">
                  Send funds from your in app wallet.
                </p>
              </div>
            )}

            {view == 1 && (
              <div
                onClick={() => {
                  setView(0);
                  setUsdt("");
                  setShowModel(false);
                  setReceiverAddress("");
                }}
                className="relative font-bold text-lg flex justify-center items-center"
              >
                <IoMdArrowRoundBack className="absolute left-0 hover:text-[#4D43EF] transition ease-in-out duration-300 border-2 border-gray-800 rounded-full size-6 cursor-pointer hover:border-[#4D43EF] hover:bg-gray-300" />
                <div className="self-center w-fit">Withdraw USDT</div>
              </div>
            )}

            {view == 2 && (
              <div
                onClick={() => {
                  setView(0);
                  setUsdc("");
                  setShowModel(false);
                  setReceiverAddress("");
                }}
                className="relative font-bold text-lg flex justify-center items-center"
              >
                <IoMdArrowRoundBack className="absolute left-0 hover:text-[#4D43EF] transition ease-in-out duration-300 border-2 border-gray-800 rounded-full size-6 cursor-pointer hover:border-[#4D43EF] hover:bg-gray-300" />
                <div className="self-center w-fit">Withdraw USDC</div>
              </div>
            )}

            <motion.div
              key={view}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="overflow-hidden relative"
            >
              {showModel && (
                <div
                  onClick={() => setShowModel(false)}
                  className="bg-gray-900/60 flex justify-center items-center backdrop-blur-lg absolute inset-0 rounded-lg"
                >
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="relative bg-white mx-2 max-w-lg w-full px-6 py-4 rounded-2xl shadow-md space-y-3"
                  >
                    <X
                      onClick={() => setShowModel(false)}
                      className="absolute right-3 cursor-pointer hover:text-[#5728A6] transition ease-in-out duraiton-300 top-3"
                      size={18}
                    />
                    <div className="font-semibold text-lg text-gray-800">
                      Are you sure you want to withdraw?
                    </div>

                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <span className="font-medium">Amount:</span>
                      <span className="text-[#5728A6] font-semibold text-base">
                        ${usdc || usdt}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <span className="font-medium">Token:</span>
                      <span className="text-[#5728A6] font-semibold text-base">
                        {usdc ? "USDC" : "USDT"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <span className="font-medium">To:</span>
                      <span className="text-[#5728A6] font-semibold">
                        {receiverAddress.slice(0, 5) +
                          "..." +
                          receiverAddress.slice(-5)}
                      </span>
                    </div>

                    <div className="py-2 px-4 mt-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded-md">
                      <p className="font-semibold">Note:</p>
                      <ul className="list-disc list-inside mt-1">
                        <li>Verify the wallet address before proceeding.</li>
                      </ul>
                    </div>
                    <button
                      onClick={handleWithdraw}
                      className="disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-500 disabled:border-gray-500 bg-white text-[#5728A6] font-semibold border-2 border-[#5728A6] w-full py-2 rounded-lg hover:bg-black hover:border-black hover:text-white cursor-pointer transition ease-in-out duration-300"
                    >
                      {loading ? (
                        <Spinner className="size-6 mx-auto" />
                      ) : (
                        "Withdraw"
                      )}
                    </button>
                  </div>
                </div>
              )}

              {view == 0 && <Tabs setView={setView} />}

              {view == 1 && (
                <Usdt
                  receiverAddress={receiverAddress}
                  assetsData={assetsData}
                  usdt={usdt}
                  setUsdt={setUsdt}
                  setReceiverAddress={setReceiverAddress}
                  otp={otp}
                  setOtp={setOtp}
                />
              )}

              {view == 2 && (
                <Usdc
                  usdc={usdc}
                  receiverAddress={receiverAddress}
                  assetsData={assetsData}
                  setUsdc={setUsdc}
                  setReceiverAddress={setReceiverAddress}
                />
              )}

              {view != 0 && (
                <button
                  onClick={() => {
                    const amount = view === 1 ? usdt : usdc;
                    const balance =
                      view === 1
                        ? assetsData?.total_usdt
                        : assetsData?.total_usdc;

                    if (amount > balance) {
                      showError("Insufficient balance.", "");
                      setLoading(false);
                      return;
                    }
                    // console.log(receiverAddress.trim().startsWith("0x"))
                    if (
                      receiverAddress.trim().length !== 42 ||
                      !receiverAddress.trim().startsWith("0x")
                    ) {
                      showError("Invalid wallet address.", "");
                      return;
                    }
                    setShowModel(true);
                  }}
                  disabled={(!usdc && !usdt) || !receiverAddress }
                  className="disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-500 disabled:border-gray-500 mt-5 bg-white text-[#4D43EF] font-semibold border-2 border-[#4D43EF] w-full py-2 rounded-lg hover:bg-black hover:border-black hover:text-white cursor-pointer transition ease-in-out duration-300"
                >
                  Withdraw
                </button>
              )}

              <button
                onClick={handleClose}
                className="mt-2 bg-[#4D43EF] font-semibold text-white w-full py-2 rounded-lg hover:bg-[#4D43EF]/70 cursor-pointer transition ease-in-out duration-300"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WithdrawSlider;
