import React, { useEffect,useState } from "react";
import { motion } from "motion/react";
import axios from "axios";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

interface PaymentConfirmationProps {
  order_id: string;
  setOrder_Id: (order_id: string) => void;
  setAmounts: (amounts: { INR: string; USDT: string; USDC: string }) => void;
  setShowPaymentConfirmation: (showPaymentConfirmation: boolean) => void;
}

const PaymentConfirmation: React.FC<PaymentConfirmationProps> = ({
  order_id,
  setOrder_Id,
  setShowPaymentConfirmation,
  setAmounts,
}) => {
  const [confirmed, setConfirmed] = React.useState(false);

  const baseUrl = useSelector((state: RootState) => state.consts.baseUrl);
  const token = useSelector((state: RootState) => state.user.token);
  const [autoPlayEnabled] = useState(localStorage.getItem("auto_play_sound") === "1");
  

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await axios.post(
          `${baseUrl}/confirm-order-status`,
          { order_id },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(response.data);
        if (response.data.order_status === "completed") {
          setConfirmed(true);
          clearInterval(interval);
        }
      } catch (error) {
        console.log(error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!confirmed) {
      return;
    }
     if (!autoPlayEnabled) return;
    const audio = new Audio("/users/audio1.wav");
    audio.play();
  }, [confirmed]);

  return (
    <div className="absolute inset-0 bg-black/50 z-50 backdrop-blur-sm flex items-center justify-center">
      <div className="p-6 bg-white rounded-xl relative max-w-lg w-full mx-3 shadow-xl border border-gray-100">
        {/* <X
          onClick={() => {
            setShowPaymentConfirmation(false);
          }}
          className="absolute cursor-pointer top-3 right-3 text-gray-500 hover:text-gray-700 transition"
        /> */}

        <div className="text-xl font-semibold mb-4 text-gray-800">
          Payment Confirmation
        </div>
        {confirmed ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{
              scale: [0.9, 1, 1.04, 1],
              opacity: 1,
            }}
            transition={{
              duration: 0.9,
              ease: "easeOut",
            }}
            className="flex flex-col items-center gap-4 px-5 py-4 rounded-lg bg-green-50
        text-green-600 font-medium shadow-inner border border-green-100"
          >
            {/* <video autoPlay muted playsInline className="z-50 w-30 h-30">
              <source src="/users/success.webm" type="video/webm" />
            </video> */}
            <img
              src="/users/check.gif.gif"
              className="mx-auto aspect-square w-30"
            />

            {/* Title */}
            <motion.div
              animate={{ opacity: [0.7, 1] }}
              transition={{
                duration: 1,
                ease: "easeInOut",
              }}
              className="text-lg font-semibold tracking-wide"
            >
              Transaction Successful
            </motion.div>

            {/* CTA Button (No Event Attached) */}
            <button
              onClick={() => {
                setOrder_Id(null);
                setShowPaymentConfirmation(false);
                setAmounts({ INR: "0", USDT: "0", USDC: "0" });
              }}
              className="mt-2 px-5 py-2.5 rounded-lg bg-green-600 text-white font-medium
          hover:bg-green-700 cursor-pointer active:scale-95 transition ease-in-out duration-300"
            >
              Continue
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0.7 }}
            animate={{ opacity: 1 }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut",
            }}
            className="flex flex-col items-center gap-4 justify-center p-6 rounded-xl
        bg-white/60 backdrop-blur shadow-md text-center text-[#4D43EF] font-medium"
          >
            <img
              src="/users/process.gif"
              className="aspect-square w-20 mx-auto"
            />
            <motion.div
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{
                repeat: Infinity,
                duration: 2.2,
                ease: "easeInOut",
              }}
              className="text-base font-semibold tracking-wide"
            >
              Processing, Please Wait...
            </motion.div>

            <div className="text-sm text-muted-foreground">
              Do not close this tab or refresh the page.
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PaymentConfirmation;
