import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { allFaq } from "@/Data/faq";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const AllFaq: React.FC = () => {
  const [filteredData, setFilteredData] = useState(allFaq);
  // const [question, setQuestion] = useState("");

  function searchQuestion(e: React.ChangeEvent<HTMLInputElement>) {
    const query = e.target.value.toLowerCase().trim();

    if (!query) {
      setFilteredData(allFaq);
      return;
    }

    const res = allFaq.filter((item) =>
      item.question.toLowerCase().includes(query)
    );

    setFilteredData(res);
  }

  return (
    <div className="mt-24  p-2 flex flex-col gap-2 max-w-lg mx-auto">
      <Input
        onChange={searchQuestion}
        className="shadow bg-gray-100"
        placeholder="Type your question here..."
      />
      <div className="mt-4 md:mt-7 text-lg font-bold">FAQs</div>
      <Accordion type="single" collapsible>
        {filteredData.map((item) => (
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

export default AllFaq;
