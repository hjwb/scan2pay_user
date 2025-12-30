import React from "react";
import { AnimatePresence, motion } from "motion/react";
import type { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { setCount, setShowReferVerifyModel } from "@/store/slices/modelSlice";
import { useNavigate } from "react-router";

const ReferalVerifyModel: React.FC = () => {
  const isReferVerifyModelVisible = useSelector(
    (state: RootState) => state.model.showReferVerifyModel
  );
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  function handleClose() {
    dispatch(setCount({ count: 1 }));
    dispatch(setShowReferVerifyModel({ showReferVerifyModel: false }));
    dispatch(setShowReferVerifyModel({ showReferVerifyModel: false }));
  }

  return (
    <AnimatePresence mode="wait">
      {isReferVerifyModelVisible && (
        <motion.div
          key="sidebar-wrapper"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={handleClose}
          className="absolute inset-0 z-50 bg-black/40 backdrop-blur-md"
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
              <div>
                <img
                  src="gift.svg"
                  className="aspect-square w-50 mx-auto"
                  alt="img"
                />
                <div className="text-center text-lg font-bold flex items-center gap-2 justify-center">
                  You're Ready To Claim Your Bonus!
                </div>
                <div className="text-center txt mt-2 text-sm font-semibold text-gray-800">
                  You've received a special invite! Verify your socials to get
                  your bonus rewards.
                </div>
              </div>
            </div>

            <div className="max-w-lg self-center mt-3 text-sm  w-full">
              <div className=" font-semibold text-lg">
                How to get your bonous.
              </div>
              <ol className="list-disc list-inside ml-3">
                <li>
                  After clicking on{" "}
                  <span className="text-[#4D43EF] font-semibold">
                    Claim Access
                  </span>
                  , you,ll be taken to your My Limits page.
                </li>
                <li>Their you will see your rewards.</li>
                <li>Just verify your socials and grab your bonous!</li>
              </ol>
            </div>

            <button
              onClick={() => navigate("/limit")}
              className="mt-7 bg-[#4D43EF] font-semibold text-white w-full py-2 rounded-lg hover:bg-[#4D43EF]/80   cursor-pointer transition ease-in-out duration-300"
            >
              Claim Access
            </button>
            <button
              onClick={handleClose}
              className="md:mt-5 mt-3 bg-black  font-semibold text-white w-full py-2 rounded-lg cursor-pointer hover:bg-black/90 transition ease-in-out duration-300"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReferalVerifyModel;
