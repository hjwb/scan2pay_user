import React, { useEffect, useState } from "react";
// import { QRCodeCanvas } from "qrcode.react";
import { Copy, X } from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { Skeleton } from "@/components/ui/skeleton";
import { useShowError } from "@/hooks/useShowError";
import { useShowSuccess } from "@/hooks/useShowSuccess";
import { Progress } from "@/components/ui/progress";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

const TOTAL_TIME = 300;

type ModelProps = {
  setOpen: (open: boolean) => void;
  order_id: string;
  amount: string;
  setAmounts: (amounts: { INR: string; USDT: string; USDC: string }) => void;
  timeLeft: number;
  setShowPaymentConfirmation: (showPaymentConfirmation: boolean) => void;
};

const Model: React.FC<ModelProps> = ({
  setOpen,
  order_id,
  setAmounts,
  timeLeft,
  amount,
  setShowPaymentConfirmation,
}) => {
  const token = useSelector((state: RootState) => state.user.token);
  const baseUrl = useSelector((state: RootState) => state.consts.baseUrl);

  const isMobile = /android|iphone|ipad|ipod/i.test(navigator.userAgent);
  // console.log({ isMobile });
  const { showError } = useShowError();
  const { showSuccess } = useShowSuccess();

  const [orderData, setOrderData] = useState(null);
  const [showSubmitBox, setShowSubmitBox] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [transactionId, setTransactionId] = useState("");
  const [upiId, setUpiId] = useState("");
  const [loading, setLoading] = useState(false);
  const [upi2, setUpi2] = useState("");

  const openPaytm = () => {
    const upiLink = `upi://pay?pa=${upi2}&am=${orderData?.inr_amount}&cu=INR&tn=Test%20Payment`;

    window.location.href = upiLink;
  };

  // Poll the backend to check order status every 3 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/check-order-status/${order_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const status = response?.data?.order?.status;

        setUpi2(response.data.upi_id);

        if (status === "merchant_accepted") {
          setOrderData(response.data.order);
          clearInterval(interval);
          showSuccess("Request accepted.", "");
        }

        if (status === "rejected_by_all") {
          clearInterval(interval);
          setOpen(false);
          setAmounts({ INR: "0", USDT: "0", USDC: "0" });
          showError("Request rejected.", "");
        }
      } catch (err) {
        console.error("Order polling failed:", err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [order_id, baseUrl, token, setOpen, setAmounts, showError, showSuccess]);

  // const handleSubmitProof = async () => {
  //   console.log("Submitted", imageFile, transactionId);
  //   // Handle proof submission logic here
  // };

  async function handleSubmitProof() {
    if (!imageFile) {
      showError("Please upload a screenshot.", "");
      return;
    }
    if (!transactionId.trim()) {
      showError("Please enter a transaction ID.", "");
      return;
    }

    try {
      setLoading(true);
      if (!upiId.includes("@") || upiId.split("@").length != 2) {
        showError("Incorrect Upi Id", "");
        return;
      }
      const formData = new FormData();
      formData.append("order_id", order_id);
      formData.append("upi_reference", transactionId);
      formData.append("upi_id", upiId);
      formData.append("screenshot", imageFile);

      // console.log({ order_id, transactionId, imageFile });
      const response = await axios.post(
        `${baseUrl}/submit-payment-proof`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
      if (response.data.status) {
        showSuccess(
          "Payment proof submitted successfully.",
          "Please wait for the merchant to accept the payment release."
        );
        setOpen(false);
        setShowPaymentConfirmation(true);
      }
      // setOpen(false);
    } catch (error) {
      console.log(error);
      showError("Error", "Please enter correct UPI details");
    } finally {
      setLoading(false);
    }
  }

  async function cancel() {
    try {
      const formData = new FormData();
      formData.append("order_id", order_id);

      const response = await axios.post(`${baseUrl}/delete`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.data);
      setOpen(false);
      showSuccess("Request cancelled successfully.", "");
    } catch (e) {
      console.log(e);
      showError("Request cancelled failed.", "");
    }
  }

  const upiQR = `upi://pay?pa=${upi2}&pn=Merchant&am=${orderData?.inr_amount}&cu=INR`;

  return (
    <div className="absolute inset-0 bg-black/50 z-50 backdrop-blur-sm flex items-center justify-center">
      {" "}
      <div className="p-6 bg-white rounded-lg relative max-w-lg w-full mx-3">
        <X onClick={cancel} className="absolute cursor-pointer top-2 right-2" />

        <div className="text-lg font-semibold">Payment</div>

        {/* Content (QR OR Submit Box) */}
        {!showSubmitBox ? (
          <div className="flex items-center justify-center">
            <div className="relative inline-block mx-auto my-5">
              {orderData ? (
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
                    upiQR
                  )}`}
                  alt="upi-qr"
                  className="rounded-xl shadow-lg"
                />
              ) : (
                <Skeleton className="w-[200px] h-[200px] bg-gray-300" />
              )}
            </div>
          </div>
        ) : (
          <div className="text-center text-sm font-semibold text-gray-500">
            <div>
              <div className="space-y-2 mt-3">
                {" "}
                <Label>Upload Screenshot</Label>{" "}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] ?? null;
                    setImageFile(file);
                  }}
                />{" "}
              </div>{" "}
              <div className="space-y-2 mt-3">
                {" "}
                <Label>UPI ID</Label>{" "}
                <Input
                  type="text"
                  placeholder="Enter UPI ID"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                />{" "}
              </div>
              {/* Transaction ID */}{" "}
              <div className="space-y-2 mt-3">
                {" "}
                <Label>Transaction ID / UTR Number</Label>{" "}
                <Input
                  type="text"
                  placeholder="Enter Transaction ID / UTR Number"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                />{" "}
              </div>{" "}
            </div>
          </div>
        )}

        {/* Instruction Text */}
        {!orderData ? (
          <div>
            <div className="text-center text-sm font-semibold text-gray-500">
              Please wait
            </div>
            <div className="text-center text-sm font-semibold text-gray-500">
              While any merchant accepts you buy order.
            </div>
          </div>
        ) : (
          !showSubmitBox && (
            <>
              <div className="text-center font-bold text-lg">
                Amount: ₹{amount}
              </div>
              <div className="text-center text-sm font-semibold text-gray-500">
                Scan QR & pay, then click proceed
              </div>
              <div className="flex gap-2 items-center justify-center mt-2">
                {upi2}{" "}
                <Copy
                  className="hover:text-gray-500 cursor-pointer transition ease-in-out duration-300"
                  size={15}
                  onClick={() => {
                    navigator.clipboard
                      .writeText(upi2)
                      .then(() => alert("Copied!"))
                      .catch((err) => console.error("Error copying:", err));
                  }}
                />
              </div>
            </>
          )
        )}
        {orderData && isMobile && (
          <button
            onClick={openPaytm}
            className="mt-3 hover:bg-sky-600 transition ease-in-out duration-300 cursor-pointer  bg-sky-500 text-semibold text-white w-full py-2 rounded-lg"
          >
            Pay with UPI App
          </button>
        )}
        {/* Buttons */}
        {orderData &&
          (!showSubmitBox ? (
            <button
              onClick={() => setShowSubmitBox(true)}
              className="w-full cursor-pointer bg-[#4D43EF] transition-all duration-300 ease-in-out hover:bg-[#847ef1] text-white py-2 rounded-lg mt-2"
            >
              Proceed
            </button>
          ) : (
            <button
              onClick={handleSubmitProof}
              disabled={loading}
              className="w-full cursor-pointer bg-[#4D43EF] transition-all duration-300 ease-in-out hover:bg-[#847ef1] text-white py-2 rounded-lg mt-5"
            >
              {loading ? "Submitting..." : "Submit Proof"}
            </button>
          ))}

        {/* Timer + Progress */}
        <div className="text-center space-y-3 mt-4">
          <div className="text-2xl font-bold text-[#4D43EF]">
            {Math.floor(timeLeft / 60)
              .toString()
              .padStart(2, "0")}
            :{(timeLeft % 60).toString().padStart(2, "0")}
          </div>

          <Progress
            value={(timeLeft / TOTAL_TIME) * 100}
            className="h-2 w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Model;
