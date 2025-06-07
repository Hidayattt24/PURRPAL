"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const qaItems = [
  {
    question: "What is PurrPal and how does it work?",
    answer: "PurrPal is a comprehensive cat care app that combines AI technology with veterinary expertise. It offers features like health monitoring, daily care tips, emergency guides, and a vet locator. The app uses advanced AI to detect potential health issues and provides personalized care recommendations for your cat.",
  },
  {
    question: "How accurate is the AI health detection?",
    answer: "Our AI health detection system has been trained on extensive veterinary data and validated by professional veterinarians. While it's highly accurate in detecting common issues, it's designed to be a supportive tool rather than a replacement for professional veterinary care. Always consult with a veterinarian for definitive diagnoses.",
  },
  {
    question: "Can I use PurrPal offline?",
    answer: "Yes! PurrPal has been designed with offline functionality in mind. Essential features like emergency guides, basic health information, and your cat's health records are available offline. However, features like the vet locator and community support require an internet connection.",
  },
  {
    question: "How do I connect with a veterinarian through PurrPal?",
    answer: "PurrPal's vet locator feature helps you find verified veterinarians in your area. You can view their profiles, specialties, operating hours, and contact information. While we don't provide direct veterinary consultations through the app, we make it easy to find and connect with local veterinary services.",
  },
  {
    question: "Is my cat's health data secure?",
    answer: "Absolutely. We take data security very seriously. All your cat's health data is encrypted and stored securely following industry best practices. You have full control over your data, and we never share personal information without your explicit consent.",
  },
  {
    question: "What kind of support does the community offer?",
    answer: "Our community section connects you with experienced cat owners and cat lovers worldwide. You can share experiences, ask questions, and get advice on daily care, behavior, and general well-being. All community content is moderated to ensure helpful and accurate information.",
  },
  {
    question: "How often should I use the health scanning feature?",
    answer: "We recommend regular health scans as part of your cat's routine care - typically once a week for healthy cats, or more frequently if you notice any changes in behavior or health. The app will also send you reminders for regular health checks based on your cat's age and health history.",
  },
  {
    question: "What should I do in case of an emergency?",
    answer: "In case of a medical emergency, PurrPal provides immediate access to our emergency care guide with step-by-step instructions. However, this should not delay seeking veterinary care. The app can quickly locate the nearest emergency vet clinic, but always prioritize getting your cat professional medical attention in serious situations.",
  },
];

export function QASection() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-orange-50/30 to-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#FF823C] to-[#C54F0C] bg-clip-text text-transparent font-poppins">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Everything you need to know about PurrPal and how it can help you care for your cat
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {qaItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left font-medium text-neutral-800 hover:text-[#FF823C]">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-neutral-600">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
} 