import type { RootState } from "@/store/store";
import { Progress } from "@/components/ui/progress";
import axios from "axios";
import { ExternalLink, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useShowError } from "@/hooks/useShowError";
import { useShowSuccess } from "@/hooks/useShowSuccess";
import { Skeleton } from "../ui/skeleton";
import { useNavigate } from "react-router";

type ModelProps = {
  setOpen: (open: boolean) => void;
  order_id: string;
  method: string;
  setAmounts: (amounts: { INR: string; USDT: string; USDC: string }) => void;
  timeLeft: number;
  setShowPaymentConfirmation: (showPaymentConfirmation: boolean) => void;
};

const TOTAL_TIME = 300;

const Model: React.FC<ModelProps> = ({
  setOpen,
  order_id,
  setAmounts,
  timeLeft,
  setShowPaymentConfirmation,
  method,
}) => {
  const baseUrl = useSelector((state: RootState) => state.consts.baseUrl);
  const token = useSelector((state: RootState) => state.user.token);

  const { showError } = useShowError();
  const { showSuccess } = useShowSuccess();

  const [orderData, setOrderData] = useState(null);
  const [wait, setWait] = useState(false);
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [loading2, setLoading2] = React.useState(false);
  const [show, setShow] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    console.log(loading);
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

        if (status === "merchant_accepted") {
          setOrderData(response.data.order);
          clearInterval(interval);
          if (method === "automatic") {
            setShow(true);
            setTimeout(() => {
              showSuccess(
                "Request accepted.",
                "Please wait for some time for payment to process."
              );
              setShow(false);

              navigate(`/transaction`);
            }, 20000);
            return;
          }
          showSuccess("Request accepted.", "");
          setTimeout(() => setWait(true), 3000);
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

  useEffect(() => {
    if (!wait) {
      return;
    }
    const interval = setInterval(async () => {
      try {
        setLoading(true);
        if (data) {
          setLoading(false);
          clearInterval(interval);
          return;
        }
        const response = await axios.post(
          `${baseUrl}/merchant/get-payment-details`,
          { order_id },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(response.data);
        if (response.data.status) {
          setData(response.data.data);
          setLoading(false);
          clearInterval(interval);
        }
      } catch (error) {
        console.log(error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [wait]);

  async function handleApprove() {
    try {
      setLoading2(true);
      console.log(order_id);
      const response = await axios.post(
        `${baseUrl}/merchant/confirm-payment`,
        { order_id: order_id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);
      if (response.data.status) {
        // navigate("/dashboard");
        setOpen(false);
        setShowPaymentConfirmation(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading2(false);
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

  return (
    <div className="absolute inset-0 bg-black/50 z-50 backdrop-blur-sm flex items-center justify-center">
      {" "}
      {show && (
        <div className="absolute inset-0 bg-black/50 z-50 backdrop-blur-sm flex items-center justify-center">
          {" "}
          <div className="p-6 bg-white rounded-lg relative max-w-lg w-full mx-3">
            <div className="p-4 my-5 bg-green-50 border border-green-300 rounded-lg text-center">
              <img
                src="process.gif"
                className="aspect-square w-20 mx-auto mb-3"
              />
              <h2 className="text-lg font-semibold text-green-700">
                Order Accepted
              </h2>
              <p className="text-gray-700 mt-1">
                Please wait while we are processing you order
              </p>
            </div>
          </div>
        </div>
      )}
      <div className="p-6 bg-white rounded-lg relative max-w-lg w-full mx-3">
        <X onClick={cancel} className="absolute cursor-pointer top-2 right-2" />

        <div className="text-lg font-semibold">Payment {order_id}</div>

        {!data &&
          (orderData ? (
            <div className="p-4 my-5 bg-green-50 border border-green-300 rounded-lg text-center">
              <img
                src="/users/process.gif"
                className="aspect-square w-20 mx-auto mb-3"
              />
              <h2 className="text-lg font-semibold text-green-700">
                Order Accepted
              </h2>
              <p className="text-gray-700 mt-1">
                The merchant has accepted your order. Please wait…
              </p>
            </div>
          ) : (
            <div className="items-center justify-center my-5 flex flex-col gap-3">
              <Skeleton className="w-full h-[200px] bg-gray-300" />
              <div>Please Wait. Let Merchant accept your request...</div>
            </div>
          ))}

        {data && (
          <div className="p-5 my-6 bg-green-50 border border-green-300 rounded-xl">
            <h2 className="text-lg font-bold text-green-700 text-center mb-4">
              Data Received
            </h2>

            <div className="space-y-3 text-gray-700 text-sm">
              <div className="flex justify-between">
                <span className="font-semibold">Order ID:</span>
                <span className="font-mono">{data.order_id}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-semibold">Amount:</span>
                <span className="font-bold text-green-700">
                  {data.amount} {data.type.toUpperCase()}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="font-semibold">INR Amount:</span>
                <span className="font-bold text-green-700">
                  ₹ {data.inr_amount}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="font-semibold">Currency:</span>
                <span className="uppercase">{data.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">UPI Id:</span>
                <span className="font-mono">{data.upi_id ?? "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">UPI Reference:</span>
                <span className="font-mono">{data.upi_reference}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Proof (Screenshot):</span>
                <button
                  className="font-mono flex hover:text-gray-500 transition ease-in-out duration-300 items-center gap-1 cursor-pointer"
                  onClick={() => window.open(data?.payment_screenshot, "_")}
                >
                  Open <ExternalLink size={16} />
                </button>
              </div>
            </div>

            <button
              className="w-full cursor-pointer mt-5 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition ease-in-out duration-300"
              onClick={handleApprove}
              type="button"
            >
              {loading2 ? "Processing..." : "Approve"}
            </button>
          </div>
        )}

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
