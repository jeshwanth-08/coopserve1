"use client";

import React, { useRef } from "react";
import {
  X,
  Printer,
  Download,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Sparkles,
  ArrowRight,
  Share2,
} from "lucide-react";
import { CoopInvoice } from "@/lib/paymentService";

interface InvoiceModalProps {
  invoice: CoopInvoice | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function InvoiceModal({ invoice, isOpen, onClose }: InvoiceModalProps) {
  const invoiceRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Modal Top Actions */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Tax Invoice
            </span>
            <span className="text-xs font-mono font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded">
              {invoice.invoiceId}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="Print / Save as PDF"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div ref={invoiceRef} className="space-y-6 text-slate-800">
          {/* Header Brand */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <img
                  src="/logo.png"
                  alt="CoopServe"
                  className="h-9 w-auto object-contain"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Worker-Owned Cooperative Gig Services Federation
              </p>
              <p className="text-[10px] text-slate-400">
                GSTIN: 29AABCC1234F1Z8 &bull; Indiranagar Co-op Cluster
              </p>
            </div>

            <div className="text-right">
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{invoice.paymentStatus}</span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1">{invoice.dateTime}</p>
            </div>
          </div>

          {/* Customer & Worker Details Grid */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Billed To (Customer)
              </span>
              <p className="font-bold text-slate-900 text-sm">{invoice.customerName}</p>
              {invoice.customerPhone && <p className="text-slate-500">{invoice.customerPhone}</p>}
              {invoice.customerAddress && (
                <p className="text-slate-500 text-[11px] mt-0.5">{invoice.customerAddress}</p>
              )}
            </div>

            <div className="border-l border-slate-200 pl-4">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Fulfilled By (Co-op Specialist)
              </span>
              <p className="font-bold text-slate-900 text-sm">{invoice.workerName}</p>
              <p className="text-brand-600 font-semibold text-[11px]">{invoice.workerTrade}</p>
              <p className="text-slate-400 text-[10px]">Verified Cooperative Member &amp; Co-owner</p>
            </div>
          </div>

          {/* Service Line Items Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 text-slate-500 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-2.5 px-4">Service Description</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900">{invoice.serviceType}</p>
                    <p className="text-[10px] text-slate-400">Order ID: #{invoice.orderId}</p>
                  </td>
                  <td className="py-3 px-3 text-center font-bold">1</td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900">
                    ₹{invoice.serviceCharge.toLocaleString("en-IN")}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Fare Breakdown & Worker Co-op Split */}
          <div className="space-y-2 pt-1 border-t border-slate-100 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Service Charge:</span>
              <span className="font-bold text-slate-900">₹{invoice.serviceCharge.toLocaleString("en-IN")}</span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span className="flex items-center gap-1">
                <span>Cooperative Platform Fee &amp; Welfare Fund:</span>
                <span className="text-[10px] bg-slate-100 px-1 rounded text-slate-500">10%</span>
              </span>
              <span className="font-bold text-slate-900">₹{invoice.cooperativeFee.toLocaleString("en-IN")}</span>
            </div>

            {invoice.taxes > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>Taxes &amp; GST:</span>
                <span className="font-bold text-slate-900">₹{invoice.taxes.toLocaleString("en-IN")}</span>
              </div>
            )}

            {/* Total Paid */}
            <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t-2 border-slate-900">
              <span>Total Paid:</span>
              <span className="text-brand-600">₹{invoice.totalPaid.toLocaleString("en-IN")}</span>
            </div>
          </div>

          {/* Transparent Cooperative Split Pill */}
          <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl text-xs space-y-1">
            <div className="flex items-center justify-between text-emerald-950 font-bold">
              <span>Transparent Cooperative Payout Split:</span>
              <span className="text-emerald-700">90% Direct to Worker</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-emerald-800">
              <span>&bull; Worker Share ({invoice.workerName}):</span>
              <span className="font-mono font-bold">₹{invoice.workerShare.toLocaleString("en-IN")} (90%)</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-emerald-800">
              <span>&bull; Co-op Welfare Fund &amp; Maintenance:</span>
              <span className="font-mono font-bold">₹{invoice.cooperativeFee.toLocaleString("en-IN")} (10%)</span>
            </div>
          </div>

          {/* Payment Method & Transaction Auth */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Payment Method</span>
              <span className="font-bold text-slate-900">{invoice.paymentMethodLabel}</span>
            </div>

            <div className="sm:text-right font-mono text-[10px] text-slate-500">
              <span className="text-[10px] uppercase font-bold text-slate-400 block font-sans">Transaction ID</span>
              <span>{invoice.transactionId}</span>
            </div>
          </div>

          {/* AI Fraud & Verification Stamp */}
          {invoice.aiFraudCheck && (
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-100 text-[11px] text-slate-600">
              <div className="flex items-center gap-1.5 font-bold text-emerald-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>AI Fraud Sentinel: {invoice.aiFraudCheck.status.replace("_", " ")}</span>
              </div>
              <span className="text-[10px] text-slate-400">{invoice.aiFraudCheck.details}</span>
            </div>
          )}
        </div>

        {/* Modal Bottom Buttons */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
          <span className="text-[11px] text-slate-400">
            Official receipt recognized for tax &amp; society audits
          </span>
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-brand-500/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF Invoice</span>
          </button>
        </div>
      </div>
    </div>
  );
}
