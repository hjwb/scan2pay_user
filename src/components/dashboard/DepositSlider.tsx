import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { setDepositSlider } from "@/store/slices/modelSlice";
import { AnimatePresence, motion } from "motion/react";
import { IoCloseCircleSharp } from "react-icons/io5";
import { FaCircleDollarToSlot, FaGreaterThan } from "react-icons/fa6";
import { IoMdArrowRoundBack } from "react-icons/io";
import { QRCodeCanvas } from "qrcode.react";
import { CopyIcon } from "lucide-react";

const DepositSlider: React.FC = () => {
  const [view, setView] = useState(0);

  const isDepositSliderVisible = useSelector(
    (state: RootState) => state.model.showDepositSlider
  );
  const userData = useSelector((state: RootState) => state.user.userData);

  const dispatch = useDispatch<AppDispatch>();

  function handleClose() {
    setView(0);
    dispatch(setDepositSlider({ showDepositSlider: false }));
  }

  return (
    <AnimatePresence mode="wait">
      {isDepositSliderVisible && (
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
            {view === 0 ? (
              <div>
                <div className="font-bold text-lg flex items-center justify-between">
                  Deposit Fund USDT BNB CHAIN
                  <IoCloseCircleSharp
                    onClick={handleClose}
                    className="text-xl hover:text-[#4D43EF] transition ease-in-out duration-300 cursor-pointer"
                  />
                </div>
                <p className="text-xs text-gray-900 txt">
                  Receive funds in your in app wallet.
                </p>
              </div>
            ) : (
              <div
                onClick={() => setView(0)}
                className="relative font-bold text-lg flex justify-center items-center"
              >
                <IoMdArrowRoundBack className="absolute left-0 hover:text-[#4D43EF] transition ease-in-out duration-300 border-2 border-gray-800 rounded-full size-6 cursor-pointer hover:border-[#4D43EF] hover:bg-gray-300" />
                <div className="self-center w-fit">Deposit USDT Bep20</div>
              </div>
            )}

            <motion.div
              key={view}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              {view === 0 ? (
                <div
                  onClick={() => setView(1)}
                  className="group flex items-center mt-5 gap-3 md:gap-5 border border-gray-300 p-3 rounded-lg hover:bg-gray-300 transition ease-in-out duration-300 cursor-pointer justify-between"
                >
                  <div className="flex items-center gap-5">
                    <FaCircleDollarToSlot className="text-[#4D43EF] text-2xl" />
                    <div>
                      <div className="font-semibold">Deposit USDT BEP20</div>
                      <div className="text-sm text-gray-700">
                        Deposit USDT BEP20 to your in app wallet
                      </div>
                    </div>
                  </div>
                  <FaGreaterThan className="group-hover:text-[#4D43EF] transition ease-in-out duration-300" />
                </div>
              ) : (
                <div className="mt-5 text-gray-700 text-sm flex flex-col items-center">
                  <QRCodeCanvas
                    value={
                      userData?.wallet_address
                        ? String(userData.wallet_address)
                        : ""
                    }
                    size={200}
                    bgColor="transparent"
                    fgColor="#000000"
                    level="H"
                    includeMargin={true}
                  />
                  <span className="self-start font-semibold text-[16px] mt-5">
                    Wallet Address
                  </span>
                  <div className="flex justify-between items-center bg-[#dad8f8] rounded-lg w-full px-5 py-2">
                    <span className="font-semibold">
                      {userData?.wallet_address.toString().slice(0, 14) +
                        "..." +
                        userData?.wallet_address.toString().slice(-14)}
                    </span>
                    <CopyIcon
                      size={15}
                      className="hover:text-[#4D43EF] cursor-pointer transition ease-in-out duration-300"
                      onClick={() => {
                        navigator.clipboard
                          .writeText(
                            userData?.wallet_address
                              ? String(userData.wallet_address)
                              : ""
                          )
                          .then(() => {
                            alert("Address copied to clipboard!");
                          })
                          .catch((err) => {
                            console.error("Failed to copy: ", err);
                          });
                      }}
                    />
                  </div>
                  <div className="py-2 px-4 mt-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded-md">
                    <p className="font-semibold">Note:</p>
                    <ul className="list-disc list-inside mt-1">
                      <li>
                        Scan the QR code using your wallet/copy the wallet
                        address, submit the payment amount, and allow some time
                        for your balance to update.
                      </li>
                    </ul>
                  </div>
                </div>
              )}
              <button
                onClick={handleClose}
                className="mt-5 bg-[#4D43EF] font-semibold text-white w-full py-2 rounded-lg hover:bg-[#4D43EF]/70 cursor-pointer transition ease-in-out"
              >
                Close
              </button>{" "}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DepositSlider;
