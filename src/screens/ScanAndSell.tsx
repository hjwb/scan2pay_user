// import React, { useEffect, useRef, useState } from "react";
// import { Html5Qrcode } from "html5-qrcode";
// import type { Html5QrcodeCameraScanConfig } from "html5-qrcode";
// import { CgArrowsExchangeAltV } from "react-icons/cg";
// import { FaRegCreditCard } from "react-icons/fa";
// import { FaGreaterThan } from "react-icons/fa6";
// import type { RootState } from "@/store/store";
// import { useSelector } from "react-redux";
// import Keypad from "@/components/common/Keypad";
// import { useNavigate } from "react-router";
// import axios from "axios";
// import { useShowError } from "@/hooks/useShowError";
// import { useShowSuccess } from "@/hooks/useShowSuccess";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// type Currency = "INR" | "USDT" | "USDC";

// interface Assets {
//   total_usdt: string;
//   total_usdc: string;
// }

// type Amounts = Record<Currency, string>;

// const ScanAndSell: React.FC = () => {
//   const navigate = useNavigate();

//   const { showError } = useShowError();
//   const { showSuccess } = useShowSuccess();

//   // token select
//   const [token, setToken] = useState<"usdt" | "usdc">("usdt");

//   const [amounts, setAmounts] = useState<Amounts>({
//     INR: "0",
//     USDT: "0",
//     USDC: "0",
//   });

//   const [assetsData, setAssetsData] = useState<Assets | null>(null);
//   // @ts-ignore
//   const [refresh, setRefresh] = useState<boolean>(false);

//   const sellingPriceUSDT = useSelector(
//     (state: RootState) => state.price.sellingPriceUSDT
//   );
//   const sellingPriceUSDC = useSelector(
//     (state: RootState) => state.price.sellingPriceUSDC
//   );

//   const limit = useSelector((state: RootState) => state.price.limit);
//   const baseUrl = useSelector((state: RootState) => state?.consts?.baseUrl);
//   const userData = useSelector((state: RootState) => state?.user?.userData);
//   const tokenHeader = useSelector((state: RootState) => state?.user?.token);

//   const pairFrom = token === "usdt" ? "USDT" : "USDC";
//   const pairTo = "INR";
//   const currentAmount = amounts[pairFrom];

//   // ---------- QR scanner specific state & refs ----------
//   const [showScanner, setShowScanner] = useState(false);
//   const qrRef = useRef<Html5Qrcode | null>(null);
//   const QR_REGION_ID = "html5qr-reader";

//   const [scannedValue, setScannedValue] = useState<string | null>(null);
//   const [scannerError, setScannerError] = useState<string | null>(null);
//   const [openModel, setOpenModel] = useState<boolean>(false);
//   const [payLoader, setPayLoader] = useState<boolean>(false);
//   // Start: just open the modal — actual Html5Qrcode.start is done in useEffect when showScanner becomes true
//   const startScanner = () => {
//     setScannedValue(null);
//     setScannerError(null);
//     setShowScanner(true);
//   };

//   // Stop and cleanup scanner (callable from close button)
//   const stopScanner = async () => {
//     if (qrRef.current) {
//       try {
//         await qrRef.current.stop();
//       } catch (e) {
//         // ignore stop errors
//       }
//       try {
//         qrRef.current.clear();
//       } catch (e) {
//         // ignore clear errors
//       }
//       qrRef.current = null;
//     }
//     setShowScanner(false);
//   };

//   // Called when a QR is successfully decoded
//   function onScanSuccess(decodedText: string, _decodedResult: any) {
//     setScannedValue(decodedText);
//     console.log("QR scanned:", decodedText);

//     // Stop camera and close modal
//     stopScanner();
//     setOpenModel(true);
//     // TODO: use decodedText (e.g. payment id) to place order or navigate
//   }

//   function onScanError(errorMessage: string) {
//     // Non-fatal scan errors while scanning (ignore or log)
//     console.debug("scan error", errorMessage);
//   }

//   // When showScanner becomes true, initialize Html5Qrcode and start scanning.
//   useEffect(() => {
//     let mounted = true;
//     if (!showScanner) return;

//     // ensure the DOM element is mounted before starting
//     // Html5Qrcode.getCameras() returns available camera devices (if any)
//     (async () => {
//       try {
//         // get list of cameras
//         const cameras = await Html5Qrcode.getCameras();

//         if (!mounted) return;

//         if (!cameras || cameras.length === 0) {
//           setScannerError(
//             "No camera found on this device. Please use a device with a camera."
//           );
//           return;
//         }

//         // pick the back/rear camera if available (label often contains 'back' or 'rear')
//         let chosenCameraId = cameras[0].id;
//         for (const cam of cameras) {
//           const label = (cam.label || "").toLowerCase();
//           if (
//             label.includes("back") ||
//             label.includes("rear") ||
//             label.includes("environment")
//           ) {
//             chosenCameraId = cam.id;
//             break;
//           }
//         }

//         // create Html5Qrcode instance bound to the QR_REGION_ID
//         // If an instance already exists, clear it first (defensive)
//         if (qrRef.current) {
//           try {
//             await qrRef.current.stop();
//             qrRef.current.clear();
//           } catch (e) {
//             // ignore
//           }
//           qrRef.current = null;
//         }

//         // Wait a tick to ensure modal DOM is rendered
//         // (usually unnecessary since showScanner triggers re-render, but it's safe)
//         await new Promise((r) => setTimeout(r, 50));

//         qrRef.current = new Html5Qrcode(QR_REGION_ID, { verbose: false });

//         // camera config
//         const config: Html5QrcodeCameraScanConfig = {
//           fps: 10,
//           qrbox: { width: 300, height: 300 },
//         };

//         // Start scanning using chosen camera id
//         await qrRef.current.start(
//           chosenCameraId,
//           config,
//           onScanSuccess,
//           onScanError
//         );
//       } catch (err: any) {
//         console.error("Failed to start scanner:", err);
//         setScannerError(
//           (err && (err.message || String(err))) ||
//             "Failed to start scanner. Make sure camera permissions are allowed and you are on HTTPS or localhost."
//         );
//         // cleanup and close modal if cannot start
//         try {
//           if (qrRef.current) {
//             await qrRef.current.stop();
//             qrRef.current.clear();
//           }
//         } catch {}
//         qrRef.current = null;
//       }
//     })();

//     return () => {
//       mounted = false;
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [showScanner]);

//   // cleanup on unmount (safety)
//   useEffect(() => {
//     return () => {
//       if (qrRef.current) {
//         qrRef.current
//           .stop()
//           .catch(() => {})
//           .finally(() => {
//             try {
//               qrRef.current?.clear();
//             } catch {}
//             qrRef.current = null;
//           });
//       }
//     };
//   }, []);

//   // ---------- existing app logic ----------
//   async function fetchBalance() {
//     try {
//       const response = await axios.post(
//         `${baseUrl}/user-currency-list`,
//         {
//           user_id: userData?.id,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${tokenHeader}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       setAssetsData(response.data.data);
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   useEffect(() => {
//     fetchBalance();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [refresh]);

//   useEffect(() => {
//     if (amounts[pairFrom] == "0") {
//       setAmounts((prev) => ({
//         ...prev,
//         [pairTo]: "",
//       }));
//     } else {
//       const price =
//         parseFloat(amounts[pairFrom]) *
//         parseFloat(pairFrom === "USDT" ? sellingPriceUSDT : sellingPriceUSDC);

//       setAmounts((prev) => ({
//         ...prev,
//         [pairTo]: price.toString(),
//       }));
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [currentAmount, token]);

//   const updateAmount = (value: string) => {
//     if (value == "0" && amounts[pairFrom] == "0") return;

//     if (amounts[pairFrom].split("").includes(".") && value == ".") return;

//     setAmounts((prev) => {
//       const current = prev[pairFrom];

//       let updated: string;

//       if (current === "0" && value === ".") {
//         updated = "0.";
//       } else if (current === "0") {
//         updated = value;
//       } else {
//         updated = current + value;
//       }
//       return {
//         ...prev,
//         [pairFrom]: updated,
//       };
//     });
//   };

//   function backspace() {
//     if (amounts[pairFrom] === "0") return;

//     if (amounts[pairFrom].length == 1) {
//       setAmounts((prev) => ({
//         ...prev,
//         [pairFrom]: "0",
//       }));
//       return;
//     }

//     const editedValue = amounts[pairFrom].slice(
//       0,
//       amounts[pairFrom].length - 1
//     );
//     setAmounts((prev) => ({
//       ...prev,
//       [pairFrom]: editedValue,
//     }));
//   }

//   function handleClear() {
//     setAmounts((prev) => ({
//       ...prev,
//       [pairFrom]: "0",
//     }));
//   }

//   // Open scanner when user clicks Place Order
//   async function handleScanPay() {
//     if (amounts["USDT"] === "0" && amounts["USDC"] === "0") {
//       // optionally notify user
//       return;
//     }
//     startScanner();
//   }

//   async function handlePay() {
//     // console.log({ scannedValue, amt: amounts[pairFrom], pairFrom });
//     try {
//       setPayLoader(true);
//       const response = await axios.post(
//         `${baseUrl}/fund-transfer`,
//         {
//           user_id: userData?.id,
//           amount: amounts[pairFrom],
//           type: pairFrom,
//           send_wallet_address: scannedValue,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${tokenHeader}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       // console.log(response.data);
//       if (response.data.status == "false") {
//         showError("Transaction Failed.", response.data.message);
//         return;
//       }
//       showSuccess("Transfer Successful", "Funds Transfered Successfully");
//     } catch (error) {
//       console.log(error);
//       showError("Transaction Failed.", "");
//     } finally {
//       setShowScanner(false);
//       setOpenModel(false);
//       setPayLoader(false);
//     }
//   }
//   // ---------------- JSX ----------------
//   return (
//     <div className="min-h-screen flex items-center justify-center">
//       <div className="max-w-lg overflow-hidden w-full px-2 mt-9">
//         <div className="card flex items-center justify-center gap-3 bg-[#e0defa] rounded-lg py-3 font-semibold text-sm">
//           <div
//             className={`w-4 h-4 bg-indigo-300 rounded-full flex items-center justify-center`}
//           >
//             <div
//               className={`w-2.5 h-2.5 bg-indigo-600 rounded-full animate-ping`}
//               style={{ animationDuration: "1.4s" }}
//             ></div>
//           </div>
//           Please ask the vendor for the bill amount first.
//         </div>

//         <div className=" text-center mt-1">
//           <div className="font-bold text-xl flex justify-center gap-3 items-center">
//             <span className="text-5xl font-extrabold text-[#847ef1] ">
//               {amounts[pairFrom]}
//             </span>

//             <Select
//               value={token}
//               onValueChange={(v) => {
//                 setAmounts({
//                   INR: "0",
//                   USDT: "0",
//                   USDC: "0",
//                 });
//                 setToken(v as "usdt" | "usdc");
//               }}
//             >
//               <SelectTrigger className="w-[100px] text-lg">
//                 <SelectValue placeholder="Select Token" />
//               </SelectTrigger>

//               <SelectContent>
//                 <SelectItem value="usdt">USDT</SelectItem>
//                 <SelectItem value="usdc">USDC</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="mt-2 text-lg gap-2 w-fit flex mx-auto font-semibold items-center">
//             <CgArrowsExchangeAltV className="bg-[#e0defa] cursor-pointer rounded-full p-.5 text-2xl text-[#4D43EF]" />{" "}
//             {amounts[pairTo] !== "0" && amounts[pairTo]} {pairTo}
//           </div>

//           <div className="font-semibold text-gray-600 mt-3 txt">
//             Available Balance:{" "}
//             <span className="font-bold text-[#4D43EF]">
//               {pairFrom === "USDT"
//                 ? assetsData?.total_usdt ?? "00.00"
//                 : assetsData?.total_usdc ?? "00.00"}{" "}
//               {pairFrom}
//             </span>
//           </div>
//         </div>

//         <div
//           onClick={() => {
//             navigate("/limit");
//           }}
//           className="card bg-[#e0defa] cursor-pointer hover:scale-105 transition ease=in-out duration-300 rounded-lg items-center py-3 px-2 my-2 md:my-3 flex justify-center gap-3"
//         >
//           <FaRegCreditCard className="text-xl text-[#4D43EF]" />
//           <span className="font-semibold text-sm">
//             Your Transaction Limit :{" "}
//             <span className=" text-[#4D43EF]">
//               {limit?.sell_limit} USDT/USDC
//             </span>
//           </span>
//           <FaGreaterThan className="text-sm text-gray-600" />
//         </div>

//         <Keypad updateAmount={updateAmount} backspace={backspace} />

//         <div className="flex gap-3 mt-2">
//           <button className="cursor-pointer flex-1 text-[#4D43EF] hover:bg-gray-300 py-2 rounded-lg transition ease-in-out duration-300 font-semibold">
//             Max
//           </button>
//           <button
//             onClick={handleClear}
//             className="cursor-pointer flex-1 text-[#4D43EF] hover:bg-gray-300 py-2 rounded-lg transition ease-in-out duration-300 font-semibold"
//           >
//             Clear
//           </button>
//         </div>

//         <div>
//           <button
//             disabled={amounts["USDT"] == "0" && amounts["USDC"] == "0"}
//             onClick={handleScanPay}
//             className="w-full mt-2 disabled:bg-[#4D43EF]/60 disabled:cursor-not-allowed bg-[#4D43EF] text-white font-semibold py-4 md:py-3 rounded-lg hover:bg-[#4D43EF]/70 transition ease-in-out duration-300 cursor-pointer"
//           >
//             Place Order
//           </button>
//         </div>
//       </div>

//       {/* ---------- Scanner Modal ---------- */}
//       {showScanner && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
//           aria-modal="true"
//           role="dialog"
//         >
//           <div className="bg-white rounded-lg w-[90vw] max-w-md p-3">
//             <div className="flex justify-between items-center mb-2">
//               <h3 className="font-semibold">Scan QR</h3>
//               <button
//                 onClick={() => stopScanner()}
//                 className="text-sm px-2 py-1 rounded bg-gray-200"
//               >
//                 Close
//               </button>
//             </div>

//             <div
//               id={QR_REGION_ID}
//               className="w-full inset-0 bg-black/5 rounded"
//             />

//             <div className="mt-2 text-sm text-gray-600">
//               {scannerError ? (
//                 <div className="text-red-600">
//                   {scannerError}
//                   <div className="mt-1 text-xs text-gray-500">
//                     Make sure camera permissions are granted and the app is
//                     served over HTTPS or running on localhost.
//                   </div>
//                 </div>
//               ) : scannedValue ? (
//                 <div>
//                   Scanned: <span className="font-medium">{scannedValue}</span>
//                 </div>
//               ) : (
//                 <div className="text-center">
//                   Point the camera at a QR code to scan. Make sure camera
//                   permissions are allowed.
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ---------- Modal ---------- */}
//       {openModel && (
//         <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">
//           <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-5 animate-in fade-in-50 zoom-in-90">
//             <h2 className="text-xl font-semibold text-gray-800 text-center">
//               Confirm Payment
//             </h2>

//             {/* Wallet Address */}
//             <div className="space-y-1">
//               <p className="text-sm font-medium text-gray-500">
//                 Wallet Address
//               </p>
//               <p className="text-sm font-semibold bg-gray-100 p-3 rounded-lg break-all">
//                 {scannedValue ?? "No address found"}
//               </p>
//             </div>

//             {/* Amount */}
//             <div className="space-y-1">
//               <p className="text-sm font-medium text-gray-500">Amount</p>
//               <p className="text-2xl font-bold text-[#4D43EF]">
//                 {amounts[pairFrom]}
//               </p>
//               <p className="text-xs text-gray-500">{amounts[pairTo]} INR</p>
//             </div>

//             {/* Currency */}
//             <div className="space-y-1">
//               <p className="text-sm font-medium text-gray-500">Currency</p>
//               <p className="text-base font-semibold text-gray-700 uppercase">
//                 {pairFrom}
//               </p>
//             </div>

//             {/* Pay Button */}
//             <button
//               onClick={handlePay}
//               className="w-full py-3 cursor-pointer bg-[#4D43EF] text-white font-semibold rounded-lg hover:bg-[#372fce] transition ease-in-out duration-300"
//             >
//               {payLoader ? "Processing..." : "Pay"}
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ScanAndSell;

import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import type { Html5QrcodeCameraScanConfig } from "html5-qrcode";
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

type Currency = "INR" | "USDT" | "USDC";

interface Assets {
  total_usdt: string;
  total_usdc: string;
}

type Amounts = Record<Currency, string>;

const ScanAndSell: React.FC = () => {
  const navigate = useNavigate();

  const { showError } = useShowError();
  const { showSuccess } = useShowSuccess();

  // token select
  const [token, setToken] = useState<"usdt" | "usdc">("usdt");

  const [amounts, setAmounts] = useState<Amounts>({
    INR: "0",
    USDT: "0",
    USDC: "0",
  });

  const [assetsData, setAssetsData] = useState<Assets | null>(null);
  // @ts-ignore
  const [refresh, setRefresh] = useState<boolean>(false);

  const sellingPriceUSDT = useSelector(
    (state: RootState) => state.price.sellingPriceUSDT
  );
  const sellingPriceUSDC = useSelector(
    (state: RootState) => state.price.sellingPriceUSDC
  );

  const limit = useSelector((state: RootState) => state.price.limit);
  const baseUrl = useSelector((state: RootState) => state?.consts?.baseUrl);
  const userData = useSelector((state: RootState) => state?.user?.userData);
  const tokenHeader = useSelector((state: RootState) => state?.user?.token);

  const pairFrom = token === "usdt" ? "USDT" : "USDC";
  const pairTo = "INR";
  const currentAmount = amounts[pairFrom];

  // ---------- QR scanner specific state & refs ----------
  const [showScanner, setShowScanner] = useState(false);
  const qrRef = useRef<Html5Qrcode | null>(null);
  const QR_REGION_ID = "html5qr-reader";

  const [scannedValue, setScannedValue] = useState<string | null>(null);
  const [scannerError, setScannerError] = useState<string | null>(null);
  const [openModel, setOpenModel] = useState<boolean>(false);
  const [payLoader, setPayLoader] = useState<boolean>(false);

  const startScanner = () => {
    setScannedValue(null);
    setScannerError(null);
    setShowScanner(true);
  };

  const stopScanner = async () => {
    if (qrRef.current) {
      try {
        await qrRef.current.stop();
      } catch {}
      try {
        qrRef.current.clear();
      } catch {}
      qrRef.current = null;
    }
    setShowScanner(false);
  };

  function onScanSuccess(decodedText: string) {
    setScannedValue(decodedText);
    stopScanner();
    setOpenModel(true);
  }

  function onScanError(errorMessage: string) {
    console.debug("scan error", errorMessage);
  }

  // ----------- NEW: Scan QR From Uploaded Image ----------
  async function handleUploadQRImage(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];
    if (!file) return;

    setScannerError(null);

    try {
      const html5QrCode = new Html5Qrcode("qr-upload-temp");

      const result = await html5QrCode.scanFile(file, false);

      setScannedValue(result);
      await stopScanner();
      setOpenModel(true);
    } catch (err) {
      console.error(err);
      setScannerError("Unable to read QR from image. Try a clearer picture.");
    }
  }

  // scanner start
  useEffect(() => {
    let mounted = true;
    if (!showScanner) return;

    (async () => {
      try {
        const cameras = await Html5Qrcode.getCameras();
        if (!mounted) return;

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
          } catch {}
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
      } catch (err: any) {
        setScannerError(
          err?.message ||
            "Failed to start scanner. Check camera permission & HTTPS."
        );
        try {
          if (qrRef.current) {
            await qrRef.current.stop();
            qrRef.current.clear();
          }
        } catch {}
        qrRef.current = null;
      }
    })();

    return () => {
      mounted = false;
    };
  }, [showScanner]);

  // cleanup on unmount
  useEffect(() => {
    return () => {
      if (qrRef.current) {
        qrRef.current
          .stop()
          .catch(() => {})
          .finally(() => {
            try {
              qrRef.current?.clear();
            } catch {}
            qrRef.current = null;
          });
      }
    };
  }, []);

  // ---------- existing app logic ----------
  async function fetchBalance() {
    try {
      const response = await axios.post(
        `${baseUrl}/user-currency-list`,
        {
          user_id: userData?.id,
        },
        {
          headers: {
            Authorization: `Bearer ${tokenHeader}`,
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

  useEffect(() => {
    if (amounts[pairFrom] == "0") {
      setAmounts((prev) => ({
        ...prev,
        [pairTo]: "",
      }));
    } else {
      const price =
        parseFloat(amounts[pairFrom]) *
        parseFloat(pairFrom === "USDT" ? sellingPriceUSDT : sellingPriceUSDC);

      setAmounts((prev) => ({
        ...prev,
        [pairTo]: price.toString(),
      }));
    }
  }, [currentAmount, token]);

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

  async function handleScanPay() {
    if (amounts["USDT"] === "0" && amounts["USDC"] === "0") {
      return;
    }
    startScanner();
  }

  async function handlePay() {
    try {
      setPayLoader(true);
      const response = await axios.post(
        `${baseUrl}/fund-transfer`,
        {
          user_id: userData?.id,
          amount: amounts[pairFrom],
          type: pairFrom,
          send_wallet_address: scannedValue,
        },
        {
          headers: {
            Authorization: `Bearer ${tokenHeader}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status == "false") {
        showError("Transaction Failed.", response.data.message);
        return;
      }
      showSuccess("Transfer Successful", "Funds Transfered Successfully");
    } catch (error) {
      showError("Transaction Failed.", "");
    } finally {
      setShowScanner(false);
      setOpenModel(false);
      setPayLoader(false);
    }
  }

  // ---------------- JSX ----------------
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
              {amounts[pairFrom]}
            </span>

            <Select
              value={token}
              onValueChange={(v) => {
                setAmounts({
                  INR: "0",
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
                <SelectItem value="usdt">USDT</SelectItem>
                <SelectItem value="usdc">USDC</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-2 text-lg gap-2 w-fit flex mx-auto font-semibold items-center">
            <CgArrowsExchangeAltV className="bg-[#e0defa] cursor-pointer rounded-full p-.5 text-2xl text-[#4D43EF]" />{" "}
            {amounts[pairTo] !== "0" && amounts[pairTo]} {pairTo}
          </div>

          <div className="font-semibold text-gray-600 mt-3 txt">
            Available Balance3:{" "}
            <span className="font-bold text-[#4D43EF]">
              {pairFrom === "USDT"
                ? assetsData?.total_usdt ?? "00.00"
                : assetsData?.total_usdc ?? "00.00"}{" "}
              {pairFrom}
            </span>
          </div>
        </div>

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
              {limit?.sell_limit} USDT BEP20
            </span>
          </span>
          <FaGreaterThan className="text-sm text-gray-600" />
        </div>

        <Keypad updateAmount={updateAmount} backspace={backspace} />

        <div className="flex gap-3 mt-2">
          <button className="cursor-pointer flex-1 text-[#4D43EF] hover:bg-gray-300 py-2 rounded-lg transition ease-in-out duration-300 font-semibold">
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
            disabled={amounts["USDT"] == "0" && amounts["USDC"] == "0"}
            onClick={handleScanPay}
            className="w-full mt-2 disabled:bg-[#4D43EF]/60 disabled:cursor-not-allowed bg-[#4D43EF] text-white font-semibold py-4 md:py-3 rounded-lg hover:bg-[#4D43EF]/70 transition ease-in-out duration-300 cursor-pointer"
          >
            Place Order
          </button>
        </div>
      </div>

      {/* ---------- Scanner Modal ---------- */}
      {showScanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-lg w-[90vw] max-w-md p-3">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">Scan QR</h3>
              <button
                onClick={() => stopScanner()}
                className="text-sm px-2 py-1 rounded bg-gray-200"
              >
                Close
              </button>
            </div>

            <div
              id={QR_REGION_ID}
              className="w-full inset-0 bg-black/5 rounded"
            />

            {/* NEW UPLOAD QR BUTTON */}
            <div className="mt-3 flex flex-col items-center gap-2">
              <button
                onClick={() => document.getElementById("qrImageInput")?.click()}
                className="px-4 py-2 bg-[#4D43EF] text-white rounded-lg cursor-pointer text-sm"
              >
                Upload QR Image
              </button>

              <input
                id="qrImageInput"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleUploadQRImage}
              />
            </div>

            <div className="mt-2 text-sm text-gray-600">
              {scannerError ? (
                <div className="text-red-600">
                  {scannerError}
                  <div className="mt-1 text-xs text-gray-500">
                    Make sure camera permissions are granted and app is HTTPS.
                  </div>
                </div>
              ) : scannedValue ? (
                <div>
                  Scanned: <span className="font-medium">{scannedValue}</span>
                </div>
              ) : (
                <div className="text-center">
                  Point camera or upload QR image.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ---------- Confirm Payment Modal ---------- */}
      {openModel && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-5 animate-in fade-in-50 zoom-in-90">
            <h2 className="text-xl font-semibold text-gray-800 text-center">
              Confirm Payment
            </h2>

            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">
                Wallet Address
              </p>
              <p className="text-sm font-semibold bg-gray-100 p-3 rounded-lg break-all">
                {scannedValue ?? "No address found"}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Amount</p>
              <p className="text-2xl font-bold text-[#4D43EF]">
                {amounts[pairFrom]}
              </p>
              <p className="text-xs text-gray-500">{amounts[pairTo]} INR</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Currency</p>
              <p className="text-base font-semibold text-gray-700 uppercase">
                {pairFrom}
              </p>
            </div>

            <button
              onClick={handlePay}
              className="w-full py-3 cursor-pointer bg-[#4D43EF] text-white font-semibold rounded-lg hover:bg-[#372fce] transition ease-in-out duration-300"
            >
              {payLoader ? "Processing..." : "Pay"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScanAndSell;
