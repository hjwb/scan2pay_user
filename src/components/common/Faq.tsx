import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useNavigate } from "react-router";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface FaqProps {
  data: FaqItem[];
}
const Faq: React.FC<FaqProps> = ({ data }) => {
  const navigate = useNavigate();

  return (
    <div className="mt-5">
      <div className="flex justify-between items-center">
        <div className="font-bold text-lg">FAQs</div>
        <div
          onClick={() => navigate("/support/allfaqs")}
          className="text-[#4D43EF] underline hover:text-blue-800 transition ease-in-out duration-300 font-semibold cursor-pointer"
        >
          See all
        </div>
      </div>
      <Accordion type="single" collapsible>
        {data.map((item) => (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger className="cursor-pointer">
              {item.question}
            </AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default Faq;
