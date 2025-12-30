import React from "react";
import { gettingStartedFaq } from "@/Data/faq";
import Faq from "@/components/common/Faq";

const GettingStarted: React.FC = () => {
  return (
    <div className="mt-24 px-2 flex flex-col gap-2 max-w-lg mx-auto">
      <div className="font-bold text-lg text-center">Getting Started</div>
      <Faq data={gettingStartedFaq} />
    </div>
  );
};

export default GettingStarted;
