import React from "react";
import Faq from "@/components/common/Faq";
import { transactionFaq } from "@/Data/faq";

const Transaction: React.FC = () => {
  return (
    <div className="mt-24 px-2 flex flex-col gap-2 max-w-lg mx-auto">
      <div className="font-bold text-lg text-center">Transactions</div>
      <Faq data={transactionFaq} />
    </div>
  );
};

export default Transaction;
