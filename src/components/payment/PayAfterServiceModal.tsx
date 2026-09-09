"use client";

import React, { useState } from "react";
import {
  X,
  CreditCard,
  QrCode,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Building2,
  Lock,
  ArrowRight,
  Loader2,
  Smartphone,
  Wallet,
  DollarSign,
} from "lucide-react";
import {
  PaymentMethodType,
  PAYMENT_METHODS,
  processRealisticPayment,
  predictCustomerPaymentMethod,
  CoopInvoice,
} from "@/lib/paymentService";

interface PayAfterServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  serviceName: string;
  workerName: string;
  workerTrade: string;
  amount: number;
  customerName?: string;
  address?: string;
  onPaymentSuccess: (invoice: CoopInvoice) => void;
}

export default function PayAfterServiceModal({
  isOpen,
  onClose,
  orderId,
  serviceName,
  workerName,
  workerTrade,
  amount,
  customerName = "Rahul Sharma",
  address = "Indiranagar, Bengaluru",
  onPaymentSuccess,
}: PayAfterServiceModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>("UPI");
  const [selectedUpiApp, setSelectedUpiApp] = useState<"GPAY" | "PHONEPE" | "PAYTM" | "BHIM" | "QR">("GPAY");
  const [customAmount, setCustomAmount] = useState<string>(amount.toString());
  const [isProcessing, setIsProcessing] = useState(false);
  const [simulateFail, setSimulateFail] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const aiSuggestion = predictCustomerPaymentMethod(customerName);

  if (!isOpen) return null;

  const numericAmount = Math.max(100, Number(customAmount) || amount);
  const workerPayout = Math.round(numericAmount * 0.9); // 90%
  const coOpFee = Math.round(numericAmount * 0.1);      // 10%
  const totalPayable = numericAmount + coOpFee;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrorMessage("");

    try {
      const result = await processRealisticPayment(
        {
          orderId,
          amount: numericAmount,
          method: selectedMethod,
          customerName,
          workerName,
          serviceName,
          address,
          details: {
            upiApp: selectedUpiApp,
            upiId: "rahul@oksbi",
          },
        },
        simulateFail
      );

      setIsProcessing(false);

      if (result.success) {
        onPaymentSuccess(result.invoice);
      } else {
        setErrorMessage("Payment simulation rejected by gateway. Please retry or pick another method.");
      }
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMessage(err.message || "Payment handshake error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase text-brand-600 bg-brand-50 px-2 py-0.5 rounded">
                Order #{orderId}
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                Service Completed
              </span>
            </div>
            <h3 className="text-lg font-black text-slate-900 mt-1">Pay After Service Completion</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 🤖 AI Preferred Payment Pill */}
        <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200 text-xs space-y-1">
          <div className="flex items-center justify-between font-bold text-emerald-900">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>AI Preference Prediction &bull; {aiSuggestion.confidence}% Match</span>
            </span>
            <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
              Zero Surcharge
            </span>
          </div>
          <p className="text-[11px] text-emerald-800">{aiSuggestion.reason}</p>
        </div>

        {/* Service & Specialist Card */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-slate-500 text-[10px] uppercase font-bold">Service Executed</p>
              <h4 className="font-bold text-slate-900 text-sm">{serviceName}</h4>
            </div>
            <div className="text-right">
              <p className="text-slate-500 text-[10px] uppercase font-bold">Specialist</p>
              <p className="font-bold text-slate-900">{workerName}</p>
              <p className="text-[10px] text-brand-600 font-semibold">{workerTrade}</p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
            <label className="font-bold text-slate-700">Enter Verified Job Amount (₹):</label>
            <input
              type="number"
              min={100}
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="w-28 p-1.5 rounded-xl border border-slate-300 font-black text-slate-900 text-right text-sm"
            />
          </div>
        </div>

        {/* 🌟 Transparent Payout Split */}
        <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200 text-xs space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            Transparent Cooperative Split:
          </span>
          <div className="flex justify-between">
            <span className="text-slate-600">Base Service Charge:</span>
            <span className="font-bold text-slate-900">₹{numericAmount.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between text-emerald-800 font-semibold text-[11px]">
            <span>&bull; Worker Payout (90% Direct):</span>
            <span className="font-mono font-bold text-emerald-700">₹{workerPayout.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between text-emerald-800 font-semibold text-[11px]">
            <span>&bull; Cooperative Welfare Fund &amp; Platform Fee (10%):</span>
            <span className="font-mono font-bold text-emerald-700">₹{coOpFee.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
            <span>Total Payable:</span>
            <span className="text-brand-600">₹{totalPayable.toLocaleString("en-IN")}</span>
          </div>
        </div>

        {/* Payment Method Selector */}
        <form onSubmit={handlePay} className="space-y-4">
          <div className="space-y-2 text-xs">
            <label className="font-bold text-slate-800 block">Select Payment Method</label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PAYMENT_METHODS.map((pm) => {
                const isSelected = selectedMethod === pm.id;
                return (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setSelectedMethod(pm.id)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? "bg-brand-50/80 border-brand-500 ring-2 ring-brand-400/20"
                        : "bg-white border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs">{pm.title}</span>
                      {pm.badge && (
                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${pm.badgeColor}`}>
                          {pm.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">{pm.sub}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sub-options for UPI */}
          {selectedMethod === "UPI" && (
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Select UPI App:</span>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: "GPAY", name: "Google Pay" },
                  { id: "PHONEPE", name: "PhonePe" },
                  { id: "PAYTM", name: "Paytm" },
                  { id: "QR", name: "Scan QR" },
                ].map((app) => (
                  <button
                    key={app.id}
                    type="button"
                    onClick={() => setSelectedUpiApp(app.id as any)}
                    className={`py-2 px-1 text-center rounded-xl font-bold text-[11px] border transition-colors ${
                      selectedUpiApp === app.id
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {app.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Simulation Toggle for Judges */}
          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-2xl flex items-center justify-between text-xs text-amber-900">
            <span className="text-[11px]">
              <strong>Hackathon Test Mode:</strong> Toggle to simulate gateway failure response
            </span>
            <label className="flex items-center gap-1.5 cursor-pointer font-bold text-[11px]">
              <input
                type="checkbox"
                checked={simulateFail}
                onChange={(e) => setSimulateFail(e.target.checked)}
                className="rounded border-amber-300 text-amber-600"
              />
              <span>Simulate Fail</span>
            </label>
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Pay Button */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-black text-sm shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authorizing Payment with Bank...</span>
              </>
            ) : selectedMethod === "CASH_AFTER_SERVICE" ? (
              <>
                <span>Confirm Doorstep Cash Settlement (₹{totalPayable})</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Pay ₹{totalPayable.toLocaleString("en-IN")} via {selectedMethod}</span>
              </>
            )}
          </button>

          {/* Production Gateway Footnote */}
          <p className="text-[10px] text-center text-slate-400 italic">
            In production, payment processing connects to Razorpay, Cashfree, or PayU webhook listeners (<code>/api/webhooks/razorpay</code>).
          </p>
        </form>
      </div>
    </div>
  );
}
