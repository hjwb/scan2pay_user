import React from "react";
import Faq from "@/components/common/Faq";
import { myLimitsFaq } from "@/Data/faq";

const Limits: React.FC = () => {
  return (
    <div className="mt-24 px-2 flex flex-col gap-2 max-w-lg mx-auto">
      <div className="font-bold text-lg text-center">My Limits</div>
      <Faq data={myLimitsFaq} />
    </div>
  );
};

export default Limits;
