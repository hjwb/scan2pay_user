import React from "react";
import { CgArrowsExchangeAltV } from "react-icons/cg";
import { FaGreaterThan } from "react-icons/fa6";
import { GiTwoCoins } from "react-icons/gi";
import { IoMdSettings } from "react-icons/io";
import { IoRocket } from "react-icons/io5";
import { PiHandDepositFill } from "react-icons/pi";
import { SlBadge } from "react-icons/sl";
import { Search } from "lucide-react";
import { useNavigate } from "react-router";

const Data = [
  { icon: IoRocket, tag: "Getting Started", path: "/support/gettingstarted" },
  { icon: IoMdSettings, tag: "General", path: "/support/general" },
  { icon: SlBadge, tag: "My Limits", path: "/support/limits" },
  {
    icon: PiHandDepositFill,
    tag: "Deposit & Withdrawals",
    path: "/support/deposit&withdraw",
  },
  { icon: GiTwoCoins, tag: "Refer & Earn", path: "/support/refer&earn" },
  {
    icon: CgArrowsExchangeAltV,
    tag: "Transactions",
    path: "/support/transactions",
  },
];

const Faqs: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-2 mt-3">
      <div
        onClick={() => navigate("/support/allfaqs")}
        className="flex justify-between hover:scale-105 transition ease-in-out duration-300 cursor-pointer items-center bg-gray-200 text-gray-600 font-semibold px-3 py-3 rounded-lg"
      >
        Type your question here... <Search size={18} />
      </div>
      {Data.map((item, index) => (
        <div
          key={index}
          onClick={() => navigate(item.path)}
          className="flex items-center px-2 py-3 rounded justify-between cursor-pointer hover:bg-gray-200 transition ease-in-out duration-300"
        >
          <div className="flex items-center gap-3">
            <item.icon size={20} className="text-[#4D43EF]" />
            <div className="text-sm font-semibold">{item.tag}</div>
          </div>
          <FaGreaterThan size={12} className="text-[#4D43EF]" />
        </div>
      ))}
    </div>
  );
};

export default Faqs;
