import React from "react";
import { generalFaq } from "@/Data/faq";
import Faq from "@/components/common/Faq";

const General: React.FC = () => {
  return (
    <div className="mt-24 px-2 flex flex-col gap-2 max-w-lg mx-auto">
      <div className="font-bold text-lg text-center">General</div>
      <Faq data={generalFaq} />
    </div>
  );
};

export default General;
