import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
// import { TextAnimate } from "../ui/text-animate";
import { ShimmerButton } from "../ui/shimmer-button";
import { useNavigate, useLocation, useMatch } from "react-router";
import { Menu } from "lucide-react";
import { setSidebar } from "@/store/slices/modelSlice";
import {
  setSellingPriceUSDT,
  setBuyingPriceUSDT,
  setSellingPriceUSDC,
  setBuyingPriceUSDC,
} from "@/store/slices/priceSlice";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import { FaArrowLeft } from "react-icons/fa";
import { IoMdHelpCircle } from "react-icons/io";
import axios from "axios";
import InstallButton from "../PWAInstall/InstallButton";
import { useParams } from "react-router";
import { useShowError } from "@/hooks/useShowError";
import { useShowSuccess } from "@/hooks/useShowSuccess";

const Navbar: React.FC = () => {
  const [showSelling, setShowSelling] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { showError } = useShowError();
  const { showSuccess } = useShowSuccess();

  const { order_id } = useParams<{ order_id: string }>();

  const isSidebarVisible = useSelector(
    (state: RootState) => state.model.showSidebar
  );
  const sellingPriceUSDC = useSelector(
    (state: RootState) => state.price.sellingPriceUSDC
  );
  const buyingPriceUSDC = useSelector(
    (state: RootState) => state.price.buyingPriceUSDC
  );
  const sellingPriceUSDT = useSelector(
    (state: RootState) => state.price.sellingPriceUSDT
  );
  const buyingPriceUSDT = useSelector(
    (state: RootState) => state.price.buyingPriceUSDT
  );

  const baseUrl = useSelector((state: RootState) => state?.consts?.baseUrl);
  const token = useSelector((state: RootState) => state.user.token);

  const isDashboard = location.pathname == "/dashboard";

  const routeTitles: Record<string, string> = {
    "/buy": "Buy USDT BEP20",
    "/sell": "Sell USDT BEP20",
    "/scan": "Scan & Pay",
    "/limit": "My Limit",
    "/transaction": "Transaction",
    "/refer": "Refer & Earn",
    "/support": "Help & Support",
    "/profile": "Profile",
    "/support/gettingstarted": "Help & Support",
    "/support/general": "Help & Support",
    "/support/limits": "Help & Support",
    "/support/deposit&withdraw": "Help & Support",
    "/support/refer&earn": "Help & Support",
    "/support/transactions": "Help & Support",
    "/support/allfaqs": "Help & Support",
    "/incomplete-order": "Incomplete Orders",
    "/dispute" : "Dispute",
    "/dispute-details" : "Dispute Details",
    "/dispute-form": "Dispute Form"
  };

  let title = routeTitles[location.pathname];

  const match = useMatch("/confirm-sell/:inr/:usdt/:order_id");
  const matchOrder = useMatch("/order/:order_id?");

  if (match) {
    title = "Payment Confirmation";
  }

  if (matchOrder) {
    title = "Order Details (" + order_id + ")";
  }

  const showHelp: Record<string, boolean> = {
    "/buy": true,
    "/sell": true,
    "/scan": true,
    "/limit": true,
    "/transaction": true,
    "/refer": true,
    "/support": false,
    "/profile": true,
    "/support/gettingstarted": false,
    "/support/general": false,
    "/support/limits": false,
    "/support/deposit&withdraw": false,
    "/support/refer&earn": false,
    "/support/transactions": false,
    "/support/allfaqs": false,
  };

  const show = showHelp[location.pathname];

  useEffect(() => {
    const interval = setInterval(
      () => setShowSelling((prev) => (prev == 1 ? 0 : prev + 1)),
      3500
    );
    return () => clearInterval(interval);
  }, []);

  async function fetchData() {
    try {
      const response = await axios.get(`${baseUrl}/buy-sell-rate`);
      // console.log(response);
      if (response?.data?.status != "success") {
        return;
      }
      dispatch(
        setSellingPriceUSDC({
          sellingPriceUSDC: response.data.data.usdc_sell_inr
            .toFixed(2)
            .toString(),
        })
      );
      dispatch(
        setBuyingPriceUSDC({
          buyingPriceUSDC: response.data.data.usdc_buy_inr
            .toFixed(2)
            .toString(),
        })
      );

      dispatch(
        setSellingPriceUSDT({
          sellingPriceUSDT: response.data.data.usdt_sell_inr
            .toFixed(2)
            .toString(),
        })
      );
      dispatch(
        setBuyingPriceUSDT({
          buyingPriceUSDT: response.data.data.usdt_buy_inr
            .toFixed(2)
            .toString(),
        })
      );
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (sellingPriceUSDC == "0.00" || buyingPriceUSDC == "0.00") fetchData();

    const interval = setInterval(fetchData, 30000);

    return () => clearInterval(interval);
  }, [buyingPriceUSDC, sellingPriceUSDC]);

  async function back() {
    if (location.pathname.startsWith("/confirm-sell")) {
      navigate("/dashboard");
      return;
    }
    if (match) {
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
        showSuccess("Request cancelled successfully.", "");
      } catch (e) {
        console.log(e);
        showError("Request cancelled failed.", "");
      }
    }
    navigate("/dashboard");
  }
  return (
    <nav className="shadow-md shadow-[#ddd4ee] fixed top-0 left-0 bg-white w-full z-30">
      <div className={`max-w-lg ${!isDashboard && "py-4"} mx-auto px-2 flex justify-between items-center`}>
        {" "}
        <div className="text-xl font-bold flex gap-1 items-center relative">
          {isDashboard ? (
            <Menu
              onClick={() => {
                dispatch(setSidebar({ showSidebar: !isSidebarVisible }));
              }}
              size={30}
              className="md:absolute border hover:bg-gray-100 rounded p-1 -left-10 cursor-pointer hover:text-[#4D43EF] transition ease-in-out duration-300"
            />
          ) : (
            <FaArrowLeft
              onClick={back}
              size={30}
              className="md:absolute p-1 border rounded-full hover:bg-gray-100 -left-10 cursor-pointer hover:text-[#4D43EF] transition ease-in-out duration-300"
            />
          )}
          {isDashboard ? (
            <div
              className="flex items-center gap-2"
              onClick={() => {
                navigate("/dashboard");
              }}
            >
              <img className="" src="three.jpeg" alt="icon" width={82} />
              {/* <TextAnimate className="hidden sm:block">Scan2Pay Direct</TextAnimate> */}
            </div>
          ) : (
            <div>{title}</div>
          )}
        </div>
        {isDashboard ? (
          <div className="flex gap-2">
            <ShimmerButton
              disabled
              className="btn shadow-2xl flex gap-1 items-center relative overflow-hidden"
            >
              <div className="w-4 h-4 bg-[#dcdbfa] rounded-full flex items-center justify-center">
                <div
                  className="w-2.5 h-2.5 bg-[#4D43EF] rounded-full animate-ping"
                  style={{ animationDuration: "1.4s" }}
                ></div>
              </div>

              <div className="relative w-[150px] h-5 overflow-hidden flex justify-center items-center">
                <AnimatePresence mode="wait">
                  {showSelling === 0 && (
                    <motion.span
                      key="usdtSell"
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 20, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="absolute text-center text-xs leading-none font-medium tracking-tight text-white"
                    >
                      USDT Selling Price - ₹{sellingPriceUSDT}
                    </motion.span>
                  )}

                  {showSelling === 1 && (
                    <motion.span
                      key="usdtBuy"
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 20, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="absolute text-center text-xs leading-none font-medium tracking-tight text-white"
                    >
                      USDT Buying Price - ₹{buyingPriceUSDT}
                    </motion.span>
                  )}

                  {showSelling === 2 && (
                    <motion.span
                      key="usdcSell"
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 20, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="absolute text-center text-xs leading-none font-medium tracking-tight text-white"
                    >
                      USDC Selling Price - ₹{sellingPriceUSDC}
                    </motion.span>
                  )}

                  {showSelling === 3 && (
                    <motion.span
                      key="usdcBuy"
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 20, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="absolute text-center text-xs leading-none font-medium tracking-tight text-white"
                    >
                      USDC Buying Price - ₹{buyingPriceUSDC}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </ShimmerButton>
            <InstallButton />
          </div>
        ) : (
          show && (
            <div
              onClick={() => navigate("/support")}
              className="navbtn flex items-center gap-2 text-gray-600 border border-gray-300 cursor-pointer transition ease-in-out duration-300 hover:bg-gray-200 font-semibold rounded-full px-3 py-0.5"
            >
              <IoMdHelpCircle />
              Help
            </div>
          )
        )}
      </div>
    </nav>
  );
};

export default Navbar;
