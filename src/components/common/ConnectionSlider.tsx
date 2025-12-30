import React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { setConnectionSlider } from "@/store/slices/modelSlice";
import { AnimatePresence, motion } from "motion/react";
import useOnlineStatus from "@/hooks/useOnlineStatus";

const ConnectionSlider: React.FC = () => {
  const isOnline = useOnlineStatus();

  const isConnectionSliderVisible = useSelector(
    (state: RootState) => state.model.showConnectionSlider
  );
  const dispatch = useDispatch<AppDispatch>();

  function handleClose() {
    dispatch(setConnectionSlider({ showConnectionSlider: false }));
  }

  return (
    <AnimatePresence mode="wait">
      {isConnectionSliderVisible && (
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
            className="absolute flex flex-col slider py-4 md:py-5 px-5 bg-gray-100 border-t-2 rounded-t-xl border-gray-300 z-50 w-full bottom-0"
          >
            <div className="max-w-lg self-center">
              {isOnline ? (
                <div>
                  <div className="text-center text-lg font-bold flex items-center gap-2 justify-center">
                    You Are Connected
                    <div
                      className={`w-3 h-3 bg-green-300 rounded-full flex items-center justify-center`}
                    >
                      <div
                        className={`w-2 h-2 bg-green-600 rounded-full animate-ping`}
                        style={{ animationDuration: "1.4s" }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-center txt mt-2 text-sm font-semibold text-gray-800">
                    You are connected & everything's working great.
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-center text-lg font-bold flex items-center gap-2 justify-center">
                    You Are Disconnected
                    <div
                      className={`w-3 h-3 bg-red-300 rounded-full flex items-center justify-center`}
                    >
                      <div
                        className={`w-2 h-2 bg-red-600 rounded-full animate-ping`}
                        style={{ animationDuration: "1.4s" }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-center mt-2 text-sm font-semibold text-gray-800">
                    You are disconnected. Please Connect To Internet.
                  </div>
                </div>
              )}
            </div>

            <div className="max-w-lg self-center  mt-2 text-sm text-center font-semibold">
              To ensure smooth experience, uninterrupted access & timely
              updates, we recommend:
            </div>

            <div className="max-w-lg self-center mt-3 text-sm  w-full">
              <div className=" font-semibold text-lg">
                1. Use a VPN(Recommended)
              </div>
              <ul className="list-disc list-inside ml-3">
                <li>Install Turbo VPN(mobile) or Zenmate(desktop).</li>
                <li>Connect to any server and refresh.</li>
              </ul>
            </div>

            <div className="max-w-lg self-center mt-3 text-sm  w-full">
              <div className=" font-semibold text-lg">2. Change DNS</div>
              <ul className="ml-3">
                <li>
                  <span className="font-semibold">Android:</span> Settings →
                  Network → Private DNS → Select Private DNS
                </li>
                <li className="mt-2">
                  <span className="font-semibold ">IOS:</span> Settings → Tap
                  'i' → Configure DNS → Manual → Add
                </li>
              </ul>
            </div>

            <div className="max-w-lg txt self-center mt-7 text-gray-600 text-sm text-center font-semibold">
              Already installed the app? It may still work, but we recommend
              VPN/DNS to keep things updated.
            </div>

            <button
              onClick={() => window.open("https://telegram.org/", "_")}
              className="mt-7 bg-black font-semibold text-white w-full py-2 rounded-lg hover:bg-black/90 cursor-pointer transition ease-in-out duration-300"
            >
              Get Quick Help
            </button>
            <button
              onClick={handleClose}
              className="md:mt-5 mt-3 bg-[#4D43EF] font-semibold text-white w-full py-2 rounded-lg hover:bg-[#4D43EF]/80 cursor-pointer transition ease-in-out duration-300"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConnectionSlider;
