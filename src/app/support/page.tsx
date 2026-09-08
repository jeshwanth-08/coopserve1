"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  HelpCircle,
  Search,
  MessageSquare,
  Phone,
  Calendar,
  CreditCard,
  XCircle,
  RotateCcw,
  UserX,
  ShieldCheck,
  User,
  PlusCircle,
  ChevronDown,
  Upload,
  CheckCircle2,
  Clock,
  Send,
  AlertCircle,
  X,
  Image as ImageIcon,
} from "lucide-react";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import MobileBottomNav from "@/components/home/MobileBottomNav";
import {
  SUPPORT_CATEGORIES,
  INITIAL_SUPPORT_TICKETS,
  SupportTicket,
  SupportCategory,
} from "@/lib/supportAndPackageData";

export default function SupportPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<SupportCategory | "All">("All");
  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_SUPPORT_TICKETS);
  const [activeTicket, setActiveTicket] = useState<SupportTicket | null>(null);

  // New Ticket Form State
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [formCategory, setFormCategory] = useState<SupportCategory>("Booking help");
  const [formSubject, setFormSubject] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formPhotos, setFormPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reply in active ticket
  const [replyText, setReplyText] = useState("");

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSubject.trim() || !formDesc.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newTicket: SupportTicket = {
        id: "t-" + Date.now(),
        ticketNumber: "TCK-" + Math.floor(1000 + Math.random() * 9000),
        category: formCategory,
        subject: formSubject,
        description: formDesc,
        status: "Open",
        priority: "High",
        createdAt: "Just now",
        updatedAt: "Just now",
        photos: formPhotos,
        messages: [
          {
            id: "m-" + Date.now(),
            sender: "user",
            senderName: "Aarav Mehta",
            timestamp: "Just now",
            text: formDesc,
          },
        ],
      };

      setTickets([newTicket, ...tickets]);
      setIsSubmitting(false);
      setIsNewTicketOpen(false);
      setFormSubject("");
      setFormDesc("");
      setFormPhotos([]);
      setActiveTicket(newTicket);
    }, 800);
  };

  const handleAddReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeTicket) return;

    const updated = {
      ...activeTicket,
      updatedAt: "Just now",
      messages: [
        ...activeTicket.messages,
        {
          id: "m-" + Date.now(),
          sender: "user" as const,
          senderName: "Aarav Mehta",
          timestamp: "Just now",
          text: replyText,
        },
      ],
    };

    setActiveTicket(updated);
    setTickets(tickets.map((t) => (t.id === updated.id ? updated : t)));
    setReplyText("");

    // Realistic auto-response after 1.5s
    setTimeout(() => {
      const agentReply = {
        ...updated,
        status: "Waiting for customer" as const,
        updatedAt: "Just now",
        messages: [
          ...updated.messages,
          {
            id: "m-" + (Date.now() + 1),
            sender: "agent" as const,
            senderName: "CoopServe Support Lead",
            timestamp: "Just now",
            text: "Thanks Aarav! We have logged your response and our supervisor has been notified. We will update you shortly.",
          },
        ],
      };
      setActiveTicket(agentReply);
      setTickets(tickets.map((t) => (t.id === agentReply.id ? agentReply : t)));
    }, 1500);
  };

  const handleCloseTicket = (ticketId: string) => {
    const updated = tickets.map((t) =>
      t.id === ticketId ? { ...t, status: "Resolved" as const, updatedAt: "Just now" } : t
    );
    setTickets(updated);
    if (activeTicket && activeTicket.id === ticketId) {
      setActiveTicket({ ...activeTicket, status: "Resolved" });
    }
  };

  const handleUploadSamplePhoto = () => {
    setFormPhotos([
      ...formPhotos,
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=300&q=80",
    ]);
  };

  const getStatusBadge = (status: SupportTicket["status"]) => {
    switch (status) {
      case "Open":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "In progress":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Waiting for customer":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Resolved":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
    }
  };

  const filteredTickets = tickets.filter((t) => {
    if (selectedCategory !== "All" && t.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        t.ticketNumber.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-brand-500 selection:text-white">
      <Navbar
        selectedCity="Bengaluru"
        selectedLocality="Indiranagar"
        onSelectLocation={() => {}}
        onOpenSearch={() => {}}
        onOpenBooking={() => router.push("/book/svc-1")}
      />

      <main className="flex-1 pb-20">
        {/* Support Header */}
        <section className="bg-gradient-to-b from-brand-900 via-slate-900 to-slate-950 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-5xl mx-auto text-center relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-black uppercase tracking-wider">
              <HelpCircle className="w-4 h-4" />
              <span>24/7 Cooperative Support Center</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              How Can We Assist You Today?
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
              Search answers, manage support tickets, or chat with our live help desk.
            </p>

            {/* Search Input */}
            <div className="max-w-2xl mx-auto pt-4 relative">
              <div className="relative">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by ticket number, 'refund', 'warranty', 'reschedule'..."
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white text-slate-900 text-sm font-medium shadow-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 7 Core Categories Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
            {SUPPORT_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(selectedCategory === cat.id ? "All" : cat.id)}
                className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-between ${
                  selectedCategory === cat.id
                    ? "bg-brand-600 text-white border-brand-600 shadow-md scale-105"
                    : "bg-white text-slate-800 border-slate-200 hover:border-brand-300 hover:shadow-sm"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${
                  selectedCategory === cat.id ? "bg-white/20 text-white" : "bg-brand-50 text-brand-600"
                }`}>
                  <HelpCircle className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold leading-tight line-clamp-2">{cat.name}</span>
                <span className={`text-[10px] mt-1 ${selectedCategory === cat.id ? "text-brand-100" : "text-slate-400"}`}>
                  {cat.avgResolution}
                </span>
              </button>
            ))}
          </div>

          {/* Quick Support Channels */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Priority Hotline</p>
                <a href="tel:18004192667" className="text-sm font-black text-slate-900 hover:text-brand-600">
                  1800-419-COOP (2667)
                </a>
                <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">? Average pickup in 30 sec</p>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">WhatsApp Support</p>
                <a href="https://wa.me/919876543210" className="text-sm font-black text-slate-900 hover:text-emerald-600">
                  +91 98765 43210
                </a>
                <p className="text-[11px] text-slate-400 mt-0.5">Photos, voice notes & live slots</p>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs text-brand-200 font-bold uppercase tracking-wider">Need Custom Resolution?</p>
                <h4 className="text-sm font-black text-white mt-0.5">Create Support Ticket</h4>
                <p className="text-[11px] text-brand-100">Upload photos & track supervisor audit</p>
              </div>
              <button
                onClick={() => setIsNewTicketOpen(true)}
                className="px-4 py-2 bg-white text-brand-700 hover:bg-brand-50 rounded-xl text-xs font-black shadow-md shrink-0"
              >
                + New Ticket
              </button>
            </div>
          </div>

          {/* Tickets Section */}
          <div className="mt-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Your Support Tickets</h2>
                <p className="text-xs text-slate-500">
                  Track live supervisor investigations, warranties, and payment refunds.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {selectedCategory !== "All" && (
                  <button
                    onClick={() => setSelectedCategory("All")}
                    className="text-xs font-bold text-brand-600 hover:underline"
                  >
                    Clear Filter ({selectedCategory})
                  </button>
                )}
                <button
                  onClick={() => setIsNewTicketOpen(true)}
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-brand-500/20"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Raise a Ticket</span>
                </button>
              </div>
            </div>

            {/* Tickets List */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Ticket Cards */}
              <div className="lg:col-span-6 space-y-3">
                {filteredTickets.length === 0 ? (
                  <div className="p-10 text-center bg-white rounded-3xl border border-slate-200">
                    <CheckCircle2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm font-bold text-slate-700">No tickets found</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Everything looks spotless! Click 'Raise a Ticket' if you ever need assistance.
                    </p>
                  </div>
                ) : (
                  filteredTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      onClick={() => setActiveTicket(ticket)}
                      className={`p-5 rounded-3xl border transition-all cursor-pointer ${
                        activeTicket?.id === ticket.id
                          ? "bg-white border-brand-500 shadow-md ring-2 ring-brand-500/20"
                          : "bg-white border-slate-200 hover:border-brand-300 shadow-sm"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-black text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md">
                              {ticket.ticketNumber}
                            </span>
                            <span className="text-xs text-slate-400">• {ticket.category}</span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 mt-1.5">{ticket.subject}</h4>
                        </div>
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${getStatusBadge(ticket.status)}`}>
                          {ticket.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 mt-2 line-clamp-2">{ticket.description}</p>

                      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                        <span>Created: {ticket.createdAt}</span>
                        <span>{ticket.messages.length} update{ticket.messages.length > 1 ? "s" : ""}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Active Ticket Conversation Drawer */}
              <div className="lg:col-span-6">
                {activeTicket ? (
                  <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 flex flex-col justify-between min-h-[500px]">
                    <div>
                      {/* Ticket header */}
                      <div className="flex items-start justify-between border-b border-slate-100 pb-4 mb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-black text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md">
                              {activeTicket.ticketNumber}
                            </span>
                            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(activeTicket.status)}`}>
                              {activeTicket.status}
                            </span>
                          </div>
                          <h3 className="text-base font-black text-slate-900 mt-1">{activeTicket.subject}</h3>
                          <p className="text-xs text-slate-400 mt-0.5">Category: {activeTicket.category}</p>
                        </div>

                        {activeTicket.status !== "Resolved" && (
                          <button
                            onClick={() => handleCloseTicket(activeTicket.id)}
                            className="px-3 py-1 text-xs font-bold text-slate-600 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 rounded-xl border border-slate-200 transition-colors"
                          >
                            Mark Resolved
                          </button>
                        )}
                      </div>

                      {/* Attached Photos */}
                      {activeTicket.photos.length > 0 && (
                        <div className="mb-4 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                            Attached Photo Evidence:
                          </p>
                          <div className="flex gap-2">
                            {activeTicket.photos.map((p, idx) => (
                              <img
                                key={idx}
                                src={p}
                                alt="Evidence"
                                className="w-16 h-16 object-cover rounded-xl border border-slate-300"
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Messages Timeline */}
                      <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                        {activeTicket.messages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`p-3.5 rounded-2xl text-xs space-y-1 ${
                              msg.sender === "user"
                                ? "bg-brand-50 text-slate-800 ml-8 border border-brand-100"
                                : "bg-slate-100 text-slate-800 mr-8 border border-slate-200"
                            }`}
                          >
                            <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                              <span>{msg.senderName}</span>
                              <span>{msg.timestamp}</span>
                            </div>
                            <p className="leading-relaxed">{msg.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Reply Input */}
                    {activeTicket.status !== "Resolved" ? (
                      <form onSubmit={handleAddReply} className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
                        <input
                          type="text"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Type an update or reply to support lead..."
                          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shrink-0"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Send</span>
                        </button>
                      </form>
                    ) : (
                      <div className="mt-4 pt-4 border-t border-slate-100 text-center text-xs text-emerald-700 font-bold bg-emerald-50 p-2.5 rounded-2xl">
                        ? This support ticket has been marked as Resolved.
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center text-slate-400">
                    <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-sm font-bold text-slate-600">Select a ticket to view conversation</p>
                    <p className="text-xs mt-1">Or click 'Raise a Ticket' to report a problem.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Raise New Ticket Modal */}
      {isNewTicketOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsNewTicketOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">Create Support Ticket</h3>
                <p className="text-xs text-slate-500">We resolve 94% of tickets within 2 hours</p>
              </div>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Select Issue Category</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as SupportCategory)}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-white font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  {SUPPORT_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} ({cat.avgResolution})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Subject / Summary</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AC cooling issue after jet service"
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Detailed Description</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Please describe what happened, technician name if known, and how we can help..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              {/* Photo upload simulator */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Upload Photo / Evidence (Optional)</label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleUploadSamplePhoto}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Attach Photo</span>
                  </button>
                  <span className="text-[11px] text-slate-400">JPG, PNG up to 10MB</span>
                </div>

                {formPhotos.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {formPhotos.map((p, idx) => (
                      <div key={idx} className="relative">
                        <img src={p} alt="Attached" className="w-14 h-14 object-cover rounded-xl border border-slate-300" />
                        <button
                          type="button"
                          onClick={() => setFormPhotos([])}
                          className="absolute -top-1 -right-1 bg-rose-600 text-white rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <span>Creating Ticket...</span> : <span>Submit Support Ticket</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <MobileBottomNav onOpenBooking={() => router.push("/book/svc-1")} />
      <Footer />
    </div>
  );
}
