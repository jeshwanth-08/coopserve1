"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  HeartHandshake,
  CreditCard,
  FileText,
  AlertCircle,
  CheckCircle2,
  Clock,
  Plus,
  ArrowRight,
  TrendingUp,
  Wallet,
  Building2,
  Upload,
  X,
  Sparkles,
  Phone,
  HelpCircle,
  DollarSign,
  ChevronRight,
} from "lucide-react";
import {
  getWelfareAccount,
  verifyEShramUan,
  getAllInsuranceClaims,
  submitInsuranceClaim,
  WelfareAccount,
  InsuranceClaim,
} from "@/lib/welfareService";
import { useLanguage } from "@/lib/i18nContext";

export default function ProviderWelfarePage() {
  const { t } = useLanguage();
  const [account, setAccount] = useState<WelfareAccount | null>(null);
  const [claims, setClaims] = useState<InsuranceClaim[]>([]);
  
  // UAN Verification Form
  const [uanInput, setUanInput] = useState("");
  const [uanNameInput, setUanNameInput] = useState("");
  const [isVerifyingUan, setIsVerifyingUan] = useState(false);
  const [uanSuccessMsg, setUanSuccessMsg] = useState("");

  // Claim Modal State
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [claimType, setClaimType] = useState<"ON_DUTY_INJURY" | "TOOL_THEFT_DAMAGE" | "EMERGENCY_MEDICAL">("ON_DUTY_INJURY");
  const [claimDate, setClaimDate] = useState("Today");
  const [claimAmount, setClaimAmount] = useState("3500");
  const [claimDesc, setClaimDesc] = useState("");
  const [claimAttachment, setClaimAttachment] = useState("hospital_slip_receipt.jpg");
  const [claimSubmittedNotice, setClaimSubmittedNotice] = useState(false);

  useEffect(() => {
    const acc = getWelfareAccount();
    setAccount(acc);
    setUanInput(acc.eShramUan);
    setUanNameInput(acc.eShramCardHolderName);
    setClaims(getAllInsuranceClaims());
  }, []);

  const handleVerifyUan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uanInput || uanInput.length < 12) {
      alert("Please enter a valid 12-digit e-Shram Universal Account Number (UAN)");
      return;
    }
    setIsVerifyingUan(true);
    setUanSuccessMsg("");

    setTimeout(() => {
      const updated = verifyEShramUan(uanInput, uanNameInput);
      setAccount(updated);
      setIsVerifyingUan(false);
      setUanSuccessMsg("✓ e-Shram UAN verified with Ministry of Labour & Employment Registry!");
    }, 800);
  };

  const handleFileClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) return;

    const newClaim = submitInsuranceClaim({
      providerId: account.workerId,
      providerName: account.workerName,
      trade: account.trade,
      incidentType: claimType,
      incidentDate: claimDate,
      description: claimDesc || "On-duty incident claim submitted through provider portal.",
      amountClaimed: Number(claimAmount) || 2500,
      photoEvidence: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=300&q=80",
    });

    setClaims(getAllInsuranceClaims());
    setIsClaimModalOpen(false);
    setClaimSubmittedNotice(true);
    setClaimDesc("");
    setTimeout(() => setClaimSubmittedNotice(false), 6000);
  };

  if (!account) return null;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Link href="/provider" className="hover:text-brand-600 transition-colors">
              Specialist Dashboard
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-900 font-bold">Welfare & Social Security</span>
          </div>
          <Link
            href="/provider"
            className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-2xs transition-all"
          >
            Back to Active Jobs
          </Link>
        </div>

        {/* Header Hero Banner */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-700 to-emerald-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 relative z-10">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold uppercase tracking-wider text-emerald-100 border border-white/20">
                Cooperative Social Security Portal
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/40 text-[11px] font-bold text-white flex items-center gap-1 border border-white/20">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-200" />
                <span>e-Shram Integrated</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Worker Welfare & Health Protection Hub
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl leading-relaxed">
              Every job you complete allocates <strong>5% directly into your personal cooperative welfare corpus</strong>. Protected with ₹5,00,000 group transit insurance and e-Shram government registry benefits.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3 relative z-10">
            <button
              onClick={() => setIsClaimModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-white text-emerald-900 hover:bg-emerald-50 font-black text-xs sm:text-sm shadow-lg shadow-black/10 flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
            >
              <Plus className="w-4 h-4 text-emerald-600" />
              <span>File Insurance Claim</span>
            </button>
          </div>
        </div>

        {/* Claim Submission Success Alert */}
        {claimSubmittedNotice && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center justify-between animate-in slide-in-from-top duration-300 shadow-sm">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div className="text-xs">
                <span className="font-black text-sm block">Insurance Claim Submitted Successfully!</span>
                <span>Your claim was dispatched to the Cooperative Node Committee. Escrow medical reimbursement updates within 24 hours.</span>
              </div>
            </div>
          </div>
        )}

        {/* 4 Core Welfare KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Corpus Balance */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Welfare Fund Balance
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Wallet className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              ₹{account.totalBalance.toLocaleString("en-IN")}
            </div>
            <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+5% added on every completed service</span>
            </p>
          </div>

          {/* Card 2: Total Contributed */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Total Lifetime Savings
              </span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              ₹{account.totalContributionsToDate.toLocaleString("en-IN")}
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Vested in cooperative interest pool
            </p>
          </div>

          {/* Card 3: Group Insurance Sum Insured */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Accidental & Transit Cover
              </span>
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              ₹{(account.activePolicy.sumInsuredAccidental / 100000).toFixed(1)} Lakhs
            </div>
            <p className="text-[11px] text-purple-600 font-bold">
              Cashless in {account.activePolicy.cashlessHospitalCount} hospitals
            </p>
          </div>

          {/* Card 4: e-Shram Status */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                e-Shram National Status
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-slate-900">
                {account.eShramStatus === "VERIFIED" ? "Verified" : "Pending"}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                Active
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-mono font-bold">
              UAN: {account.eShramUan}
            </p>
          </div>
        </div>

        {/* Middle Section: e-Shram Verification & Active Policy Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: e-Shram Universal Account Number (UAN) Integration */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-black">
                  🇮🇳
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    e-Shram National Database Verification
                  </h3>
                  <p className="text-xs text-slate-500">
                    Ministry of Labour & Employment, Government of India
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black uppercase flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified</span>
              </span>
            </div>

            <form onSubmit={handleVerifyUan} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  12-Digit e-Shram Universal Account Number (UAN)
                </label>
                <input
                  type="text"
                  value={uanInput}
                  onChange={(e) => setUanInput(e.target.value)}
                  placeholder="e.g. 1294-8849-2041"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Cardholder Full Name (As per Aadhaar/e-Shram)
                </label>
                <input
                  type="text"
                  value={uanNameInput}
                  onChange={(e) => setUanNameInput(e.target.value)}
                  placeholder="Marcus Thorne"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>Registered Trade Category:</span>
                  <span className="font-bold text-slate-900">{account.eShramOccupation}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Verification Timestamp:</span>
                  <span className="font-bold text-emerald-700">{account.verifiedAt || "15 Jan 2026"}</span>
                </div>
              </div>

              {uanSuccessMsg && (
                <div className="p-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{uanSuccessMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isVerifyingUan}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-colors"
              >
                {isVerifyingUan ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Validating with e-Shram API...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verify / Update e-Shram Registration</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right: Active Micro-Insurance Policy Details */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                  Active Protection
                </span>
                <h3 className="text-base font-black text-slate-900 mt-1">
                  CoopServe Special Group Micro-Insurance
                </h3>
              </div>
              <span className="text-xs font-bold text-emerald-600">
                Policy Active
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Policy Number:</span>
                <span className="font-mono font-bold text-slate-800">{account.activePolicy.policyNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Scheme:</span>
                <span className="font-bold text-slate-800 text-right max-w-[260px]">{account.activePolicy.schemeName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Accidental Disability Coverage:</span>
                <span className="font-bold text-emerald-700">₹{account.activePolicy.sumInsuredDisability.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tool Loss / Damage Coverage:</span>
                <span className="font-bold text-emerald-700">₹{account.activePolicy.toolDamageCoverage.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Policy Validity:</span>
                <span className="font-bold text-slate-800">Until {account.activePolicy.validUntil}</span>
              </div>
            </div>

            <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100 text-purple-900 text-xs flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Cashless Hospital Network Access</span>
                <span className="text-[11px] text-purple-700 leading-relaxed">
                  In case of an on-duty medical emergency, show your CoopServe Member ID at any of 1,420 empaneled hospitals across Bengaluru for instant admission.
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsClaimModalOpen(true)}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-500/20 flex items-center justify-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Submit New On-Duty Claim</span>
            </button>
          </div>
        </div>

        {/* Claims History Table */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Insurance Claims & Reimbursements History
              </h3>
              <p className="text-xs text-slate-500">
                Track status of tool replacements and on-duty medical claims approved by the cooperative committee.
              </p>
            </div>
            <button
              onClick={() => setIsClaimModalOpen(true)}
              className="px-4 py-2 bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 rounded-xl text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>File New Claim</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">Claim ID</th>
                  <th className="p-3">Incident Type</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Details</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Settlement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {claims.map((claim) => (
                  <tr key={claim.id} className="hover:bg-slate-50/50">
                    <td className="p-3 font-mono font-bold text-slate-900">{claim.id}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                        {claim.incidentType.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="p-3 text-slate-500 whitespace-nowrap">{claim.incidentDate}</td>
                    <td className="p-3 text-slate-700 max-w-xs truncate" title={claim.description}>
                      {claim.description}
                    </td>
                    <td className="p-3 font-bold text-slate-900">₹{claim.amountClaimed}</td>
                    <td className="p-3">
                      {claim.status === "DISBURSED" && (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black uppercase">
                          Disbursed
                        </span>
                      )}
                      {claim.status === "APPROVED" && (
                        <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-black uppercase">
                          Approved
                        </span>
                      )}
                      {claim.status === "SUBMITTED" && (
                        <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-black uppercase">
                          Under Review
                        </span>
                      )}
                    </td>
                    <td className="p-3 font-mono text-[11px] text-slate-500">
                      {claim.transactionRef || "In Escrow"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Claim Filing Modal */}
      {isClaimModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">File an Insurance Claim</h3>
                <p className="text-xs text-slate-500">
                  Zero paperwork. Verified directly by your local cooperative node.
                </p>
              </div>
              <button
                onClick={() => setIsClaimModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFileClaim} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Claim Incident Category</label>
                <select
                  value={claimType}
                  onChange={(e: any) => setClaimType(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                >
                  <option value="ON_DUTY_INJURY">On-Duty Medical Injury / Accident</option>
                  <option value="TOOL_THEFT_DAMAGE">Essential Tool Breakage / Theft on Job</option>
                  <option value="EMERGENCY_MEDICAL">Immediate Emergency Family Grant</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Date of Incident</label>
                  <input
                    type="text"
                    value={claimDate}
                    onChange={(e) => setClaimDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Claim Amount (₹)</label>
                  <input
                    type="number"
                    value={claimAmount}
                    onChange={(e) => setClaimAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description of Incident & Job Location</label>
                <textarea
                  rows={3}
                  value={claimDesc}
                  onChange={(e) => setClaimDesc(e.target.value)}
                  placeholder="Describe what occurred during service delivery, job address, and medical attention received..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500"
                  required
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-300 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Upload className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600 font-medium">Proof Attachment: {claimAttachment}</span>
                </div>
                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                  Attached
                </span>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-800 text-[11px]">
                Cooperative Welfare Fund disburses up to ₹15,000 for verified medical emergencies within 4 hours via UPI.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsClaimModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-500/20"
                >
                  Submit Official Claim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
