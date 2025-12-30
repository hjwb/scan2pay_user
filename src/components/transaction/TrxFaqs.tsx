import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useNavigate } from "react-router";
import { transactionFaq } from "@/Data/faq";

const TrxFaqs: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="mt-5 mb-10">
      <div className="flex justify-between items-center">
        <div className="font-bold text-lg">FAQs</div>
        <div
          onClick={() => navigate("/support")}
          className="text-blue-800 underline hover:text-blue-700 transition ease-in-out duration-300 font-semibold cursor-pointer"
        >
          See all
        </div>
      </div>{" "}
      <Accordion type="single" collapsible>
        {transactionFaq.slice(0, 3).map((item) => (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default TrxFaqs;
