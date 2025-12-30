import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router";
import { Html5Qrcode } from "html5-qrcode";
import type { Html5QrcodeCameraScanConfig } from "html5-qrcode";
import { motion } from "framer-motion";
import { ExternalLink, Info } from "lucide-react";
import type { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import axios from "axios";
import { useShowError } from "@/hooks/useShowError";
import { useShowSuccess } from "@/hooks/useShowSuccess";
import QrCode from "qrcode-decoder";
import { Progress } from "@/components/ui/progress";

const QR_REGION_ID = "html5qr-reader-confirm";
const TOTAL_TIME = 420;

const ConfirmSell: React.FC = () => {
  const navigate = useNavigate();
  const { inr, usdt, order_id } = useParams<{
    inr: string;
    usdt: string;
    order_id: string;
  }>();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const token = (query.get("token") || "usdt") as "usdt" | "usdc" | "gbk";

  const baseUrl = useSelector((state: RootState) => state?.consts?.baseUrl);
  // const userData = useSelector((state: RootState) => state?.user?.userData);
  const tokenHeader = useSelector((state: RootState) => state?.user?.token);
  const { showError } = useShowError();
  const { showSuccess } = useShowSuccess();
  const [timer, setTimer] = useState(TOTAL_TIME);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [autoPlayEnabled] = useState(localStorage.getItem("auto_play_sound") === "1");


  // QR scanner refs/state
  const qrRef = useRef<Html5Qrcode | null>(null);
  const [scannerError, setScannerError] = useState<string | null>(null);
  const [scannedValue, setScannedValue] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [payLoading, setPayLoading] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [proceed, setProceed] = useState(false);
  const [showModel, setShowModel] = useState(false);
  const [data, setData] = useState(null);
  const [approved, setApproved] = useState(false);
  const [approveLoad, setApprovedLoad] = useState(false);
  const [link, setLink] = useState("");

  useEffect(() => {
    if (timer <= 0) {
      navigate("/scan");
      showError("Time Up for the transaction.", "Try Again.");
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, navigate]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" + s : s}`;
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/check-order-status/${order_id}`,
          {
            headers: {
              Authorization: `Bearer ${tokenHeader}`,
              "Content-Type": "application/json",
            },
          }
        );

        const status = response?.data?.order?.status;

        if (status === "merchant_accepted") {
          clearInterval(interval);
          showSuccess("Request accepted.", "");
          setProceed(true);
          setCurrentStep(2);
        }

        if (status === "rejected_by_all") {
          clearInterval(interval);
          showError("Request rejected.", "");
          navigate("/scan");
        }
      } catch (err) {
        console.error("Order polling failed:", err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [order_id, baseUrl, token, showError, showSuccess]);

  useEffect(() => {
    if (!showModel) return;
    const interval = setInterval(async () => {
      try {
        console.log({ order_id });
        const response = await axios.post(
          `${baseUrl}/confirm-scan-order-status`,
          { order_id },
          {
            headers: {
              Authorization: `Bearer ${tokenHeader}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Polling order status:", response.data);
        if (response.data.payment_mode === "automatic") {
          setTimeout(() => {
            showSuccess(
              "Transaction Completed",
              "Redirecting to Transactions Page"
            );
            navigate("/transaction");
          }, 20000);
          return;
        }
        if (response.data.status) {
          setData(response.data.order);
          setLink(response?.data?.payment_screenshot);
          clearInterval(interval);
          setShowModel(false);
        }
      } catch (err) {
        console.error("Order polling failed:", err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [showModel, order_id, baseUrl, tokenHeader]);

  useEffect(() => {
    if (!proceed) {
      return;
    }
    const initScanner = async () => {
      await startScanner();
    };

    initScanner();

    return () => {
      stopScanner(); // fire and forget
    };
  }, [proceed]);

  useEffect(() => {
    if (!scannedValue) {
      return;
    }


    if (!autoPlayEnabled) return;
    const audio = new Audio("/users/audio1.wav");
    audio.play();
  }, [scannedValue]);

  const extractUpiId = (qrText: string): string | null => {
    try {
      const url = new URL(qrText);
      if (url.protocol === "upi:") {
        return url.searchParams.get("pa");
      }
      const match = qrText.match(/pa=([^\&]+)/);
      return match ? match[1] : null;
    } catch {
      const match = qrText.match(/pa=([^\&]+)/);
      return match ? match[1] : null;
    }
  };

  const startScanner = async () => {
    setScannerError(null);
    setScannedValue(null);

    try {
      const cameras = await Html5Qrcode.getCameras();
      if (!cameras || cameras.length === 0) {
        setScannerError("No camera found on this device.");
        return;
      }

      let chosenCameraId = cameras[0].id;
      for (const cam of cameras) {
        const label = (cam.label || "").toLowerCase();
        if (
          label.includes("back") ||
          label.includes("rear") ||
          label.includes("environment")
        ) {
          chosenCameraId = cam.id;
          break;
        }
      }

      if (qrRef.current) {
        try {
          await qrRef.current.stop();
          qrRef.current.clear();
        } catch (e) {
          console.debug(e);
        }
        qrRef.current = null;
      }

      await new Promise((r) => setTimeout(r, 50));
      qrRef.current = new Html5Qrcode(QR_REGION_ID, { verbose: false });

      const config: Html5QrcodeCameraScanConfig = {
        fps: 10,
        qrbox: { width: 300, height: 300 },
      };

      await qrRef.current.start(
        chosenCameraId,
        config,
        onScanSuccess,
        onScanError
      );
      setIsScanning(true);
    } catch (err) {
      setScannerError(
        err?.message ||
          "Failed to start scanner. Check camera permission & HTTPS."
      );
      try {
        if (qrRef.current) {
          await qrRef.current.stop();
          qrRef.current.clear();
        }
      } catch (e) {
        console.debug(e);
      }
      qrRef.current = null;
      setIsScanning(false);
    }
  };

  const stopScanner = async () => {
    if (qrRef.current) {
      try {
        await qrRef.current.stop();
      } catch (e) {
        console.debug(e);
      }
      try {
        qrRef.current.clear();
      } catch (e) {
        console.debug(e);
      }
      qrRef.current = null;
    }
    setIsScanning(false);
  };

  const onScanSuccess = async (decodedText: string) => {
    const upi = extractUpiId(decodedText);
    if (!upi) {
      showError("Invalid QR", "Could not detect UPI from the QR code");
      return;
    }
    setScannedValue(upi);
    console.log("UPI extracted from camera:", upi);
    setCurrentStep(3);
    await stopScanner();
  };

  const onScanError = (errorMessage: string) => {
    console.debug("scan error", errorMessage);
    console.debug("scan error", scannerError);
  };

  // const handleUploadQRImage = async (
  //   e: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;

  //   setPreview(URL.createObjectURL(file));
  //   setScannerError(null);

  //   try {
  //     if (qrRef.current) await stopScanner(); // Stop camera if scanning

  //     const img = new Image();
  //     img.src = URL.createObjectURL(file);

  //     img.onload = async () => {
  //       const qr = new QrCode();
  //       const result = await qr.decode(img);
  //       const upi = extractUpiId(result.data);
  //       if (!upi) {
  //         showError(
  //           "Invalid QR",
  //           "Could not detect UPI from the uploaded QR image"
  //         );
  //         return;
  //       }
  //       setScannedValue(upi);
  //       console.log("UPI extracted from image:", upi);
  //       setCurrentStep(3);
  //     };
  //   } catch (err) {
  //     console.error(err);
  //     setScannerError("Unable to read QR from image. Try a clearer picture.");
  //   }
  // };

  const handleUploadQRImage = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setScannerError(null);

    try {
      // stop any ongoing camera scan
      await stopScanner();

      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = async () => {
        const qr = new QrCode();
        try {
          const result = await qr.decodeFromImage(img);
          const decodedText = result.data || result;
          const upi = extractUpiId(decodedText.toString());
          if (!upi) {
            showError(
              "Invalid QR",
              "Could not detect UPI from the uploaded QR image"
            );
            return;
          }
          setScannedValue(upi);
          console.log("UPI extracted from image:", upi);
          setCurrentStep(3);
        } catch (err) {
          console.error("QR decode error:", err);
          setScannerError(
            "Unable to read QR from image. Make sure it's a valid QR code."
          );
        }
      };

      img.onerror = () => {
        setScannerError("Failed to load image for QR scan.");
      };
    } catch (err) {
      console.error(err);
      setScannerError("Unable to read QR from image. Try a clearer picture.");
    }
  };

  const handlePay = async () => {
    if (!scannedValue) {
      showError("No QR", "Please scan or upload merchant QR first.");
      return;
    }

    try {
      setPayLoading(true);
      const response = await axios.post(
        `${baseUrl}/submit-scan-details`,
        {
          scan_upi: scannedValue,
          order_id,
        },
        {
          headers: {
            Authorization: `Bearer ${tokenHeader}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Submit scan details response:", response.data);
      if (response.data?.status === false) {
        showError("Transaction Failed.", response.data?.message || "");
        return;
      }

      setShowModel(true);
      showSuccess("Transfer Successful", "Funds Transferred Successfully");
      // navigate("/orders");
    } catch (error) {
      console.error(error);
      showError("Transaction Failed.", "");
    } finally {
      setPayLoading(false);
    }
  };

  useEffect(() => {
    if (!scannedValue) {
      return;
    }
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  }, [scannedValue]);

  useEffect(() => {
    if (!data) {
      return;
    }
       if (!autoPlayEnabled) return;
    const audio = new Audio("/users/audio1.wav");
    audio.play();
  }, [data]);

  const steps = Array.from({ length: 3 }, (_, i) => i + 1);

  async function handleApprove() {
    try {
      setApprovedLoad(true);
      const response = await axios.post(
        `${baseUrl}/approve-scan-order-status`,
        {
          order_id,
        },
        {
          headers: {
            Authorization: `Bearer ${tokenHeader}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.data);
      navigate("/scan");
    } catch (error) {
      console.log(error);
    } finally {
      setApprovedLoad(false);
    }
  }
  return (
    <div className="w-full min-h-screen bg-white flex flex-col items-center mt-18 p-6 gap-6">
      {showModel && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
          {/* Loader Animation */}
          <img
            src="/users/process.gif"
            className="aspect-square w-20 mx-auto mb-5"
          />

          {/* Text */}
          <div className="mt-6 text-center">
            <h2 className="text-gray-800 text-lg font-semibold tracking-wide">
              Waiting for merchant...
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Please stay on this page while we process your payment.
            </p>
          </div>
        </div>
      )}
      {data && (
        <div className="fixed inset-0 bg-linear-to-b from-white to-slate-100 z-50 flex flex-col items-center justify-center px-4">
          <div className="flex flex-col items-center justify-center py-10 w-full">
            <div className="bg-white/80 backdrop-blur-xl shadow-xl border border-slate-200 rounded-2xl p-8 w-full max-w-md space-y-6 animate-in fade-in zoom-in duration-300">
              {/* Success Icon */}
              {/* <video
                autoPlay
                muted
                playsInline
                className="z-50 w-30 h-30 mx-auto"
              >
                <source src="/users/success.webm" type="video/webm" />
              </video> */}
              {/* <img
                src="/users/check.gif.gif"
                className="aspect-square w-30 mx-auto"
              /> */}

              <h2 className="text-2xl font-bold text-slate-800 text-center">
                Payment Details
              </h2>

              {/* Payment Info Card */}
              <div className="space-y-2 text-slate-700 text-center">
                <p className="flex justify-between">
                  <span className="font-semibold text-slate-900">Order Id</span>{" "}
                  <span className="text-green-600 font-bold">
                    {data.order_id}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span className="font-semibold text-slate-900">You Send</span>{" "}
                  <span className="text-green-600 font-bold">
                    {data.amount} {data.type.toUpperCase()}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span className="font-semibold text-slate-900">
                    You Receive
                  </span>{" "}
                  <span className="text-green-600 font-bold">
                    ₹ {data.inr_amount.toFixed(4)}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span className="font-semibold text-slate-900">
                    Trxn Id / UTR Number
                  </span>{" "}
                  <span className="text-green-600 font-bold">
                    {data.upi_reference}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span className="font-semibold text-slate-900">
                    Proof (Screenshot)
                  </span>{" "}
                  <button
                    className="font-mono flex hover:text-gray-500 transition ease-in-out duration-300 items-center gap-1 cursor-pointer"
                    onClick={() => window.open(link, "_")}
                  >
                    Open <ExternalLink size={16} />
                  </button>
                </p>
                <p className="text-[#4D43EF] font-medium italic">
                  Transaction completed by the merchant. Please check the screenshot proof before approval.
                </p>
              </div>

              {/* Continue Button */}
              <button
                disabled={approveLoad}
                onClick={() => setApproved(true)}
                className="w-full cursor-pointer transtion ease-in-out bg-[#4D43EF] text-white py-3 rounded-xl font-semibold text-lg
        shadow-md hover:bg-[#4D43EF]/80 hover:shadow-lg active:scale-95
        transition-all duration-200"
              >
                {approveLoad ? "Please Wait" : "Approve"}
              </button>
            </div>
          </div>
        </div>
      )}
      {approved && (
        <div className="fixed inset-0 bg-linear-to-b from-white to-slate-100 z-50 flex flex-col items-center justify-center px-4">
          <div className="flex flex-col items-center justify-center py-10 w-full">
            <div className="bg-white/80 backdrop-blur-xl shadow-xl border border-slate-200 rounded-2xl p-8 w-full max-w-md space-y-6 animate-in fade-in zoom-in duration-300">
              {/* Success Icon */}
              {/* <video
                autoPlay
                muted
                playsInline
                className="z-50 w-30 h-30 mx-auto"
              >
                <source src="/users/success.webm" type="video/webm" />
              </video> */}
              <img
                src="/users/check.gif.gif"
                className="aspect-square w-30 mx-auto"
              />

              <h2 className="text-2xl font-bold text-slate-800 text-center">
                Payment Successful
              </h2>

              {/* Continue Button */}
              <button
                onClick={handleApprove}
                className="w-full cursor-pointer transtion ease-in-out bg-[#4D43EF] text-white py-3 rounded-xl font-semibold text-lg
        shadow-md hover:bg-[#4D43EF]/80 hover:shadow-lg active:scale-95
        transition-all duration-200"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
        className={`w-[380px] ${!proceed ? "h-[380px]" : "h-full"} bg-red-400 border-2 border-indigo-200 rounded-2xl flex flex-col items-center justify-center shadow-sm overflow-hidden`}
      >
        {/* !proceed */}
         {/* !preview */}
        {!proceed ? (
          <div
            id={QR_REGION_ID}
            className="w-full text-center text-sm text-gray-600 font-semibold h-full flex items-center flex-col justify-center bg-gray-50"
          >
            <img
              src="/users/process.gif"
              className="aspect-square w-20 mx-auto mb-5"
            />
            Please Wait For <br />
            Merchant Confirmation
          </div>
        ) : !preview ? (
          <div
            id={QR_REGION_ID}
            className="w-[380px] h-full bg-gray-50"
          />
        ) : (
          <img
            src={preview}
            alt="Selected"
            className="w-full h-full  object-cover"
          />
        )}
      </motion.div>

      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleUploadQRImage}
        className="hidden"
      />

      <button
        onClick={() => fileInputRef.current?.click()}
        className="px-6 cursor-pointer py-2 rounded-xl border border-indigo-300 bg-white text-indigo-600 hover:bg-indigo-50 transition"
      >
        Upload QR
      </button>

      <div className="w-full max-w-md bg-white rounded-3xl shadow p-5 mt-6">
        <div className="w-full text-center mb-4">
          <p className="text-gray-500 text-sm">Time Remaining </p>
          <p className="text-red-500 text-lg font-bold mt-1">
            {formatTime(timer)}
          </p>
          <Progress value={(timer / TOTAL_TIME) * 100} className="h-2 w-full" />
        </div>

        <div className="relative w-full px-6 py-4">
          <div className="relative flex justify-between px-2">
            <div className="absolute top-1/2 left-2 w-[calc(100%-1rem)] h-1 bg-[#4D43EF]/50 -translate-y-1/2 rounded-full" />
            {steps.map((step) => {
              const isActive = step <= currentStep;
              const isCurrent = step === currentStep;
              return (
                <div
                  key={step}
                  className={`relative w-4 h-4 rounded-full shadow ${
                    isActive ? "bg-[#4D43EF]" : "bg-gray-300"
                  }`}
                >
                  {isCurrent && (
                    <span className="absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75 animate-ping" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="w-full flex flex-col justify-center items-center mb-4">
          <div className="w-full flex items-center justify-between px-6 mb-2">
            {["Merchant accepted", "Scan/Upload QR", "Processing payment"].map(
              (label, index) => {
                const step = index + 1; // steps are 1-based
                const isActive = step <= currentStep;
                const isCurrent = step === currentStep;

                // Dynamic text color
                const textColor = isCurrent
                  ? "text-[#4D43EF] font-semibold"
                  : isActive
                  ? "text-gray-700"
                  : "text-gray-400";

                return (
                  <span key={label} className={`text-xs ${textColor}`}>
                    {label}
                  </span>
                );
              }
            )}
          </div>
        </div>

        <div className="w-full mt-5 p-5 shadow-sm rounded-2xl border border-gray-200 bg-white">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2 text-sm">
              <span className="text-xl">💳</span> SCAN & PAY{" "}
              {token.toUpperCase()}
            </h2>
            {proceed ? (
              <span className="bg-green-100 text-green-600 text-xs px-3 py-1 rounded-lg">
                Accepted
              </span>
            ) : (
              <span className="bg-red-100 text-red-600 text-xs px-3 py-1 rounded-lg">
                Waiting
              </span>
            )}
          </div>

          <div className="text-sm text-gray-700 space-y-2">
            <div className="flex justify-between">
              <span>ID</span>
              <span>{order_id}</span>
            </div>
            {/* <div className="flex justify-between">
              <span>email</span>
              <span>{userData.email}</span>
            </div> */}
            <div className="flex justify-between">
              <span>Scanner UPI</span>
              <span>{scannedValue ? scannedValue : "-"}</span>
            </div>
            <div className="flex justify-between">
              <span>You send</span>
              <span>
                {usdt} {token.toUpperCase()}
              </span>
            </div>
            {/* <div className="flex justify-between">
              <span>Fees</span>
              <span>5%</span>
            </div> */}
            <div className="flex justify-between">
              <span>You receive</span>
              <span>₹{inr}</span>
            </div>
            <div className="flex justify-between text-red-500 font-medium">
              <span>Payment Details</span>
              <span>{scannedValue ? "Scanned" : "Not sent"}</span>
            </div>
            <div className="border-t border-dashed border-gray-300 pt-3 flex justify-between font-semibold">
              <span>Total Receivable Amount</span>
              <span>₹{inr}</span>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2 mt-4 text-gray-600 text-xs p-3 bg-indigo-50 rounded-xl">
          <Info className="w-4 h-4 mt-0.5 text-indigo-600" />
          <p>
            Your payment details will be sent once the merchant is connected.
            Please do not leave this page, otherwise the transaction may not
            complete.
          </p>
        </div>

        <div className="mt-4">
          <button
            onClick={handlePay}
            disabled={payLoading || isScanning || !scannedValue}
            className="w-full py-3 cursor-pointer hover:bg-green-500 transition ease-in-out duration-300 rounded-lg bg-green-600 text-white font-semibold disabled:opacity-60"
          >
            {payLoading ? "Processing..." : "Proceed"}
          </button>
        </div>

        <div id="qr-upload-temp-confirm" style={{ display: "none" }} />
      </div>
    </div>
  );
};

export default ConfirmSell;
