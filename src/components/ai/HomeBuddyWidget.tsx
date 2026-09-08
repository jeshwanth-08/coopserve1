"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  MessageCircle,
  X,
  Send,
  ArrowRight,
  Bot,
  User,
  Wrench,
  CheckCircle2,
  Minimize2,
  Maximize2,
  Calendar,
} from "lucide-react";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  action?: {
    label: string;
    url: string;
  };
}

export default function HomeBuddyWidget() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m-init-1",
      sender: "bot",
      text: "Hello! I am Home Buddy ??. Tell me what is happening at home (e.g., 'My AC is not cooling' or 'Water leaking under sink') and I will connect you with the right specialist.",
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Conversational matcher
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;

    const userMsg: Message = {
      id: "u-" + Date.now(),
      sender: "user",
      text: inputQuery.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery("");
    setIsTyping(true);

    const q = userMsg.text.toLowerCase();

    setTimeout(() => {
      let botResponse: Message;

      if (q.includes("ac") || q.includes("cool") || q.includes("filter")) {
        botResponse = {
          id: "b-" + Date.now(),
          sender: "bot",
          text: "Sounds like your AC might need a service or inspection. Want me to find the earliest available professional?",
          action: {
            label: "Find a professional",
            url: "/book/svc-1",
          },
        };
      } else if (q.includes("leak") || q.includes("tap") || q.includes("pipe") || q.includes("sink") || q.includes("plumb")) {
        botResponse = {
          id: "b-" + Date.now(),
          sender: "bot",
          text: "Water leakage can damage walls and cabinetry quickly! I can dispatch our verified plumbing specialist to inspect and replace gaskets.",
          action: {
            label: "Book Plumbing Specialist",
            url: "/book/svc-2",
          },
        };
      } else if (q.includes("clean") || q.includes("bathroom") || q.includes("sofa") || q.includes("dust")) {
        botResponse = {
          id: "b-" + Date.now(),
          sender: "bot",
          text: "For thorough home hygiene, we recommend our Home Refresh Package (Deep clean + Sofa shampoo) with savings of ?500.",
          action: {
            label: "View Home Refresh Package",
            url: "/packages",
          },
        };
      } else if (q.includes("member") || q.includes("plus") || q.includes("discount") || q.includes("vip")) {
        botResponse = {
          id: "b-" + Date.now(),
          sender: "bot",
          text: "With our HOME+ VIP Membership (?999/yr), you get 10% off every service, ?0 visiting charges, and priority dispatch under 30 minutes!",
          action: {
            label: "Explore HOME+ Membership",
            url: "/membership",
          },
        };
      } else if (q.includes("support") || q.includes("ticket") || q.includes("refund") || q.includes("complaint")) {
        botResponse = {
          id: "b-" + Date.now(),
          sender: "bot",
          text: "Our dedicated support team is available 24/7. You can track live supervisor audits or raise a ticket with photos.",
          action: {
            label: "Open Support Center",
            url: "/support",
          },
        };
      } else {
        botResponse = {
          id: "b-" + Date.now(),
          sender: "bot",
          text: "I understand! Let's get this taken care of. I can connect you directly with our cooperative dispatch desk or find an available technician.",
          action: {
            label: "Explore All 20 Services",
            url: "/services",
          },
        };
      }

      setIsTyping(false);
      setMessages((prev) => [...prev, botResponse]);
    }, 900);
  };

  const handleQuickPrompt = (prompt: string) => {
    setInputQuery(prompt);
  };

  return (
    <>
      {/* Floating Entry Trigger Button */}
      <div className="fixed bottom-20 md:bottom-6 right-5 z-40">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xl shadow-slate-900/30 border border-slate-700 transition-all hover:scale-105 active:scale-95 group"
            aria-label="Ask Home Buddy AI"
          >
            <div className="relative">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-brand-500 to-indigo-500 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-900 animate-pulse" />
            </div>
            <div className="text-left hidden sm:block">
              <span className="block text-[11px] font-black text-white">Home Buddy</span>
              <span className="block text-[9px] text-slate-300 font-medium">Need something fixed?</span>
            </div>
          </button>
        )}
      </div>

      {/* Floating AI Drawer / Widget Modal */}
      {isOpen && (
        <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[520px] max-h-[85vh] animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-500 to-indigo-500 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                  <span>Home Buddy</span>
                  <span className="text-[9px] bg-brand-500/30 text-brand-300 border border-brand-400/40 px-1.5 py-0.2 rounded-full uppercase font-bold">
                    AI Concierge
                  </span>
                </h4>
                <p className="text-[10px] text-slate-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  <span>Online • Ready to assist</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/70">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.sender === "bot" && (
                  <div className="w-7 h-7 rounded-xl bg-brand-50 text-brand-600 border border-brand-200 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] p-3.5 rounded-2xl text-xs space-y-2.5 leading-relaxed shadow-sm ${
                    m.sender === "user"
                      ? "bg-brand-600 text-white rounded-tr-none font-medium"
                      : "bg-white text-slate-800 border border-slate-200/90 rounded-tl-none font-normal"
                  }`}
                >
                  <p>{m.text}</p>

                  {m.action && (
                    <div className="pt-1">
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          router.push(m.action!.url);
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-brand-500/25 transition-transform active:scale-95"
                      >
                        <span>{m.action.label}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {m.sender === "user" && (
                  <div className="w-7 h-7 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    U
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-slate-400 bg-white p-2.5 rounded-xl border border-slate-200 w-fit">
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce delay-100" />
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce delay-200" />
                <span className="ml-1 text-[11px]">Home Buddy is thinking...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="p-2 bg-white border-t border-slate-100 overflow-x-auto flex gap-1.5 text-[11px]">
            {[
              "My AC isn't cooling properly.",
              "Water leaking under sink",
              "What is HOME+ membership?",
              "Home Refresh Package",
            ].map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickPrompt(qp)}
                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-brand-50 hover:text-brand-700 text-slate-600 whitespace-nowrap transition-colors border border-slate-200 text-[10px] font-semibold"
              >
                {qp}
              </button>
            ))}
          </div>

          {/* Message Input Footer */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex gap-2">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask Home Buddy anything..."
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim()}
              className="p-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-40 text-white transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
