import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Info } from "lucide-react";
import { motion } from "framer-motion";

export default function Order() {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  // handle upload button click
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  // handle file selection + preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imgURL = URL.createObjectURL(file);
    setPreview(imgURL);
  };

  return (
 <div className="w-full min-h-screen bg-white flex flex-col items-center mt-5 p-6 gap-6">

<div className="header mt-5"></div>
      {/* Image Upload Box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-[320px] h-[260px] border-2 border-indigo-200 rounded-2xl flex flex-col items-center justify-center shadow-sm overflow-hidden"
      >
        {!preview ? (
          <>
            <AlertTriangle className="w-10 h-10 text-indigo-400 mb-3" />
            <p className="text-base font-medium text-gray-600">
              Camera access failed
            </p>
          </>
        ) : (
          <img
            src={preview}
            alt="Selected"
            className="w-full h-full object-cover"
          />
        )}
      </motion.div>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Upload Button */}
      <Button
        className="px-6 py-2 rounded-xl border border-indigo-300 bg-white text-indigo-600 hover:bg-indigo-50 transition"
        onClick={handleUploadClick}
      >
        Upload QR
      </Button>

      {/* Progress & Payment Details */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow p-5 mt-6">
        {/* Header */}
        <div className="w-full text-center mb-4">
          <p className="text-gray-500 text-sm">
            Ask the vendor to generate QR only after your scanner opens
          </p>
          <p className="text-green-500 text-sm font-medium mt-1">On time</p>
<div className=" h-2 bg-blue-400 "></div>

        </div>
        {/* Progress Steps */}
      
 <div className="relative w-full px-6 py-4">
  <div className="relative flex justify-between px-2">
    {/* Dots */}
    <div className="w-4 h-4 bg-purple-600 rounded-full"></div>
    <div className="w-4 h-4 bg-purple-600 rounded-full "></div>
   <div className="relative w-4 h-4 rounded-full  border-white bg-purple-600 shadow">
  {/* Inner pulsing circle */}
  <span className="absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75 animate-ping"></span>
</div>


    {/* Solid line behind dots */}
    <div className="absolute top-1/2 left-2 w-[calc(100%-1rem)] h-1 bg-purple-600 -translate-y-1/2 rounded-full"></div>
  </div>
</div>

  <div className="w-full flex flex-col justify-center items-center mb-4">
          <div className="w-full flex items-center justify-between px-6 mb-2">
            <span className="text-xs text-gray-500">Merchant accepted</span>
            <span className="text-xs text-purple-600 font-semibold">Scan/Upload QR</span>
            <span className="text-xs text-gray-400">Processing payment</span>
          </div>

        </div>

        {/* Payment Card */}
        <div className="w-full mt-5 p-5 shadow-sm rounded-2xl border border-gray-200 bg-white">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2 text-sm">
              <span className="text-xl">💳</span> SCAN & PAY USDC
            </h2>
            <span className="bg-green-100 text-green-600 text-xs px-3 py-1 rounded-lg">Accepted</span>
          </div>

          <div className="text-sm text-gray-700 space-y-2">
            <div className="flex justify-between"><span>ID</span><span>267031</span></div>
            <div className="flex justify-between"><span>You send</span><span>0.136 USDC</span></div>
            <div className="flex justify-between"><span>Fee</span><span>0.125 USDC</span></div>
            <div className="flex justify-between"><span>You receive</span><span>₹1.00</span></div>

            <div className="flex justify-between text-red-500 font-medium">
              <span>Payment Details</span><span>Not sent</span>
            </div>

            <div className="border-t border-dashed border-gray-300 pt-3 flex justify-between font-semibold">
              <span>Total Receivable Amount</span><span>₹1.00</span>
            </div>
          </div>
        </div>

        {/* Note */}
        <div className="flex items-start gap-2 mt-4 text-gray-600 text-xs p-3 bg-indigo-50 rounded-xl">
          <Info className="w-4 h-4 mt-0.5 text-indigo-600" />
          <p>
            Your payment details will be sent once the merchant is connected.
            Please do not leave this page, otherwise the transaction will not complete.
          </p>
        </div>
      </div>
    </div>
  );
}
