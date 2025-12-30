import React from "react";
import Faq from "@/components/common/Faq";
import { depositAndWithdrawFaq } from "@/Data/faq";

const DepositAndWithdraw: React.FC = () => {
  return (
    <div className="mt-24 px-2 flex flex-col gap-2 max-w-lg mx-auto">
      <div className="font-bold text-lg text-center">Deposit & Withdraw</div>
      <Faq data={depositAndWithdrawFaq} />
    </div>
  );
};

export default DepositAndWithdraw;
