"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { FAQS } from "@/lib/homeData";

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-brand-600" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Frequently asked questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Everything you need to know about booking, guarantees, and our verified pros.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200/90 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                >
                  <span className="text-xs sm:text-sm font-bold text-slate-900">
                    {faq.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-brand-600 border-brand-200 bg-brand-50" : ""
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="p-4 sm:p-5 bg-white text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 animate-in fade-in duration-150">
                    <p>{faq.answer}</p>
                    <span className="inline-block mt-3 text-[10px] uppercase font-bold text-brand-600 tracking-wider">
                      Category: {faq.category}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
