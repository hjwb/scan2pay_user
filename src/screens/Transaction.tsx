import React from "react";
import TrxFaqs from "@/components/transaction/TrxFaqs";
import TrxCard from "@/components/transaction/TrxCard";
import TrxTable from "@/components/transaction/TrxTable";

const Transaction: React.FC = () => {
  return (
    <div className="mt-24 px-2 flex flex-col gap-2 max-w-lg mx-auto">
      <TrxCard />
      <TrxTable />
      <TrxFaqs />
    </div>
  );
};

export default Transaction;
