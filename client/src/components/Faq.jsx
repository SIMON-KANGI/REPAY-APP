import { useState, useEffect } from "react";
import axios from "axios";
import { Accordion, AccordionButton, AccordionItem, AccordionPanel, AccordionIcon, Box } from "@chakra-ui/react";
import { FaMinus, FaPlus } from "react-icons/fa";

function FAQ() {
  const [faqs, setFaqs] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);

  useEffect(() => {
    async function fetchFaqs() {
      try {
        const res = await axios.get('https://api.npoint.io/2ae1c0cbc906f5ff8e16');
        console.log("Fetched data:", res.data); // Log the fetched data
        setFaqs(res.data.faqs || []); // Adjust based on the structure of your fetched data
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      }
    }
    fetchFaqs();
  }, []);

  const handleToggle = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="p-4 bg-stone-950 rounded-md mx-3 my-4">
      <Accordion allowMultiple className="border-gray-500">
        {Array.isArray(faqs) && faqs.length > 0 ? (
          faqs.map((faq, index) => (
            <AccordionItem key={index}>
              <h2>
                <AccordionButton onClick={() => handleToggle(index)}>
                  <Box flex="1" textAlign="left" textColor="white" className="text-2xl">
                    {faq.question}
                  </Box>
                  {expandedIndex === index ? (
                    <FaMinus fontSize="1.5rem" class="text-slate-100" />
                  ) : (
                    <FaPlus fontSize="1.5rem" class="text-slate-100" />
                  )}
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <p className="text-emerald-400">
                  {faq.answer}
                </p>
              </AccordionPanel>
            </AccordionItem>
          ))
        ) : (
          <p className="text-center text-rose-600">No FAQs available.</p>
        )}
      </Accordion>
    </div>
  );
}

export default FAQ;
