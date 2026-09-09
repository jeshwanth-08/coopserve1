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
  GraduationCap,
  Activity,
  Calendar,
  Award,
  AlertTriangle,
  Zap,
  Check,
  Stethoscope,
  Umbrella,
  ShieldAlert,
  Download,
  Flame,
} from "lucide-react";
import {
  getWelfareAccount,
  verifyEShramUan,
  getAllInsuranceClaims,
  submitInsuranceClaim,
  getAllAssistanceRequests,
  submitAssistanceRequest,
  enrollOrCompleteTraining,
  submitLeaveRequest,
  WelfareAccount,
  InsuranceClaim,
  WelfareAssistanceRequest,
  SkillTrainingProgram,
  HealthCheckupRecord,
  WorkerLeaveRecord,
  AiWorkerRiskAlert,
} from "@/lib/welfareService";
import { useLanguage } from "@/lib/i18nContext";

export default function ProviderWelfarePage() {
  const { t } = useLanguage();
  const [account, setAccount] = useState<WelfareAccount | null>(null);
  const [activeTab, setActiveTab] = useState<"insurance" | "welfare_requests" | "training" | "health" | "leaves">("insurance");

  // UAN Verification Form
  const [uanInput, setUanInput] = useState("");
  const [uanNameInput, setUanNameInput] = useState("");
  const [isVerifyingUan, setIsVerifyingUan] = useState(false);
  const [uanSuccessMsg, setUanSuccessMsg] = useState("");

  // Claim Modal State
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [claimPolicyType, setClaimPolicyType] = useState<InsuranceClaim["insuranceType"]>("PERSONAL_ACCIDENT");
  const [claimDate, setClaimDate] = useState("Today");
  const [claimAmount, setClaimAmount] = useState("4500");
  const [claimDesc, setClaimDesc] = useState("");
  const [claimCustomerAffected, setClaimCustomerAffected] = useState("");
  const [claimNotice, setClaimNotice] = useState(false);

  // Assistance Request Modal State
  const [isAssistanceModalOpen, setIsAssistanceModalOpen] = useState(false);
  const [assistCategory, setAssistCategory] = useState<WelfareAssistanceRequest["category"]>("MEDICAL_EMERGENCY");
  const [assistAmount, setAssistAmount] = useState("5000");
  const [assistReason, setAssistReason] = useState("");
  const [assistBeneficiary, setAssistBeneficiary] = useState("");
  const [assistNotice, setAssistNotice] = useState(false);

  // Leave Modal State
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [leaveType, setLeaveType] = useState<WorkerLeaveRecord["type"]>("CASUAL_LEAVE");
  const [leaveStartDate, setLeaveStartDate] = useState("");
  const [leaveEndDate, setLeaveEndDate] = useState("");
  const [leaveDays, setLeaveDays] = useState(2);
  const [leaveReason, setLeaveReason] = useState("");
  const [leaveNotice, setLeaveNotice] = useState(false);

  const loadData = () => {
    const acc = getWelfareAccount();
    setAccount(acc);
    setUanInput(acc.eShramUan);
    setUanNameInput(acc.eShramCardHolderName);
  };

  useEffect(() => {
    loadData();
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

    submitInsuranceClaim({
      providerId: account.workerId,
      providerName: account.workerName,
      trade: account.trade,
      insuranceType: claimPolicyType,
      incidentDate: claimDate,
      description: claimDesc || "On-duty incident claim submitted via cooperative provider app.",
      amountClaimed: Number(claimAmount) || 3500,
      photoEvidence: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=300&q=80",
      customerAffected: claimPolicyType === "THIRD_PARTY_LIABILITY" ? claimCustomerAffected || "Prestige Ozone, Flat 402" : undefined,
    });

    loadData();
    setIsClaimModalOpen(false);
    setClaimNotice(true);
    setClaimDesc("");
    setTimeout(() => setClaimNotice(false), 6000);
  };

  const handleApplyAssistance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) return;

    submitAssistanceRequest({
      workerId: account.workerId,
      workerName: account.workerName,
      category: assistCategory,
      amountRequested: Number(assistAmount) || 5000,
      reason: assistReason || "Emergency financial assistance requested from cooperative welfare fund.",
      beneficiaryDetails: assistBeneficiary || "Self / Family Member",
    });

    loadData();
    setIsAssistanceModalOpen(false);
    setAssistNotice(true);
    setAssistReason("");
    setTimeout(() => setAssistNotice(false), 6000);
  };

  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) return;

    submitLeaveRequest({
      type: leaveType,
      startDate: leaveStartDate || "Tomorrow",
      endDate: leaveEndDate || "Day After Tomorrow",
      days: Number(leaveDays) || 2,
      reason: leaveReason || "Personal / Health leave requested.",
    });

    loadData();
    setIsLeaveModalOpen(false);
    setLeaveNotice(true);
    setLeaveReason("");
    setTimeout(() => setLeaveNotice(false), 6000);
  };

  const handleTrainingAction = (trainingId: string) => {
    enrollOrCompleteTraining(trainingId);
    loadData();
  };

  if (!account) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-200 text-xs font-bold border border-emerald-300/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Worker-Owned Cooperative Protection &bull; SIH 2026</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
                Worker Welfare &amp; Comprehensive Social Security
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
                Beyond regular gig earnings: 2% Cooperative Welfare Fund, PF tracking, 4 comprehensive insurance covers, child scholarships, health records, and AI risk prevention.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsClaimModalOpen(true)}
                className="px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-all flex items-center gap-2 active:scale-95"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>File Insurance Claim</span>
              </button>

              <button
                onClick={() => setIsAssistanceModalOpen(true)}
                className="px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-lg shadow-emerald-500/30 transition-all flex items-center gap-2 active:scale-95"
              >
                <HeartHandshake className="w-4 h-4" />
                <span>Apply Welfare Grant</span>
              </button>
            </div>
          </div>

          {/* Quick Member Identity Badge */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center font-black text-white text-base">
                MT
              </div>
              <div>
                <div className="font-bold text-white flex items-center gap-2 text-sm">
                  <span>{account.workerName}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-400/20 text-emerald-300 font-bold border border-emerald-400/30">
                    Co-Owner Member
                  </span>
                </div>
                <div className="text-slate-300 text-[11px]">{account.trade} &bull; Bengaluru Cooperative Chapter</div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/5 px-3 py-2 rounded-2xl border border-white/10">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">e-Shram National UAN</span>
                <span className="text-emerald-300 font-mono font-bold text-xs">{account.eShramUan}</span>
              </div>
              <span className="ml-2 px-2 py-0.5 rounded-full bg-emerald-500 text-white font-black text-[10px]">
                VERIFIED
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 space-y-8 relative z-20">
        {/* Success Notifications */}
        {claimNotice && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs font-bold flex items-center gap-2 shadow-sm animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Insurance Claim successfully registered! Assigned to Cooperative Emergency Claims Board for instant review.</span>
          </div>
        )}

        {assistNotice && (
          <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl text-teal-900 text-xs font-bold flex items-center gap-2 shadow-sm animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
            <span>Welfare Assistance Request submitted! District Node Committee will review and disburse funds directly via UPI.</span>
          </div>
        )}

        {leaveNotice && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-blue-900 text-xs font-bold flex items-center gap-2 shadow-sm animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Paid Leave approved! Peer specialist Suresh Patil has been auto-assigned so your customer jobs are uninterrupted.</span>
          </div>
        )}

        {/* 🌟 4 KEY WELFARE & FINANCIAL METRIC PILLARS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Monthly & Annual Earnings */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-3 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Worker Earnings</span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">₹{account.monthlyEarnings.toLocaleString("en-IN")}</div>
              <p className="text-[11px] text-slate-500 mt-0.5">This Month &bull; ₹{account.totalAnnualEarnings.toLocaleString("en-IN")} YTD</p>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-emerald-600 font-bold">100% Retained</span>
              <span className="text-slate-400">₹0 commission fee</span>
            </div>
          </div>

          {/* 2. Cooperative Welfare Fund (2% Contribution) */}
          <div className="bg-white rounded-3xl p-5 border border-emerald-200 shadow-sm space-y-3 hover:shadow-md transition-shadow bg-gradient-to-br from-emerald-50/40 to-white">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Welfare Fund (2%)</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <HeartHandshake className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-emerald-950">₹{account.welfareFundBalance.toLocaleString("en-IN")}</div>
              <p className="text-[11px] text-emerald-700 mt-0.5">2% auto-credited per job + Co-op match</p>
            </div>
            <div className="pt-2 border-t border-emerald-100/80 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">₹{account.emergencyGrantsDisbursed.toLocaleString("en-IN")} disbursed</span>
              <button
                onClick={() => setIsAssistanceModalOpen(true)}
                className="text-emerald-700 font-bold hover:underline"
              >
                Apply Grant &rarr;
              </button>
            </div>
          </div>

          {/* 3. Provident Fund (PF / EPFO) Tracking */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-3 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Provident Fund (PF)</span>
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Wallet className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">₹{account.pfAccumulatedCorpus.toLocaleString("en-IN")}</div>
              <p className="text-[11px] text-slate-500 mt-0.5">₹{account.pfContributionMonthly}/mo &bull; 8.25% Govt Interest</p>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-purple-700 font-mono font-bold text-[10px] truncate max-w-[140px]">{account.uanPfNumber}</span>
              <span className="text-emerald-600 font-semibold">EPFO Linked</span>
            </div>
          </div>

          {/* 4. Pension & Old-Age Trust (PM-SYM) */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-3 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pension (PM-SYM)</span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">₹{account.pensionStatus.guaranteedMonthlyPension.toLocaleString("en-IN")}<span className="text-xs font-normal text-slate-500">/mo</span></div>
              <p className="text-[11px] text-slate-500 mt-0.5">Guaranteed for life after age 60</p>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5 w-full">
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: `${(account.pensionStatus.vestedYears / account.pensionStatus.totalYearsRequired) * 100}%` }} />
                </div>
                <span className="font-bold text-slate-700 shrink-0 text-[10px]">{account.pensionStatus.vestedYears}/{account.pensionStatus.totalYearsRequired} Yrs</span>
              </div>
            </div>
          </div>
        </div>

        {/* 🤖 SIH AI FEATURE: WORKER RISK & SAFETY GUARDIAN */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-7 text-white shadow-xl space-y-5 border border-indigo-900/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-400 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                  <span>CoopServe AI Worker Risk &amp; Safety Guardian</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-400/20 text-indigo-300 font-bold border border-indigo-400/30">
                    Active Sentinel
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Continuous AI monitoring of earnings trends, safety near-misses, and neighborhood skill shortages.
                </p>
              </div>
            </div>
            <span className="text-xs text-indigo-300 font-mono bg-white/5 px-3 py-1 rounded-full self-start sm:self-auto">
              3 Intelligence Signals Detected
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {account.aiRiskAlerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between space-y-3 hover:bg-white/10 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        alert.severity === "WARNING"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                      }`}
                    >
                      {alert.type.replace("_", " ")}
                    </span>
                    <span className="text-slate-400 text-[10px]">Co-op AI Sentinel</span>
                  </div>
                  <h4 className="text-xs font-bold text-white leading-snug">{alert.title}</h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed">{alert.description}</p>
                  <div className="p-2.5 rounded-xl bg-indigo-950/60 border border-indigo-500/20 text-[11px] text-indigo-200">
                    <strong className="text-white block text-[10px] uppercase tracking-wider mb-0.5">Recommendation:</strong>
                    {alert.aiRecommendation}
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (alert.actionType === "APPLY_STIPEND") {
                      setIsAssistanceModalOpen(true);
                      setAssistCategory("CRITICAL_LIVELIHOOD");
                      setAssistAmount("5000");
                      setAssistReason("Pre-approved ₹5,000 seasonal income assistance stipend");
                    } else if (alert.actionType === "START_SAFETY_TRAINING") {
                      setActiveTab("training");
                    } else if (alert.actionType === "ENROLL_SKILL") {
                      setActiveTab("training");
                      handleTrainingAction("TRN-02");
                    }
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm shadow-indigo-600/30"
                >
                  <span>{alert.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 🛡️ 4 COMPREHENSIVE INSURANCE POLICIES SECTION */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>Cooperative Insurance Cover Portfolio</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                  4 Active Policies
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                100% funded by cooperative society pool dues &amp; government labor schemes with ₹0 salary deduction.
              </p>
            </div>

            <button
              onClick={() => setIsClaimModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors shadow-sm"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>Submit Damage or Medical Claim</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {account.policies.map((policy) => {
              const borderStyles =
                policy.colorTheme === "rose"
                  ? "border-rose-200 hover:border-rose-300"
                  : policy.colorTheme === "purple"
                  ? "border-purple-200 hover:border-purple-300"
                  : policy.colorTheme === "emerald"
                  ? "border-emerald-200 hover:border-emerald-300"
                  : "border-amber-200 hover:border-amber-300";

              const badgeStyles =
                policy.colorTheme === "rose"
                  ? "bg-rose-50 text-rose-800"
                  : policy.colorTheme === "purple"
                  ? "bg-purple-50 text-purple-800"
                  : policy.colorTheme === "emerald"
                  ? "bg-emerald-50 text-emerald-800"
                  : "bg-amber-50 text-amber-800";

              return (
                <div
                  key={policy.id}
                  className={`bg-white rounded-3xl p-5 border ${borderStyles} shadow-sm space-y-3 flex flex-col justify-between transition-all hover:shadow-md`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${badgeStyles}`}>
                        {policy.type.replace("_", " ")}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        ACTIVE
                      </span>
                    </div>

                    <h4 className="text-sm font-black text-slate-900 leading-snug">{policy.title}</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{policy.description}</p>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-slate-100">
                    <div className="flex items-baseline justify-between">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Sum Insured:</span>
                      <span className="text-lg font-black text-slate-900">₹{policy.coverageAmount.toLocaleString("en-IN")}</span>
                    </div>

                    {policy.nominee && (
                      <div className="text-[10px] text-purple-700 font-semibold truncate">
                        Nominee: {policy.nominee}
                      </div>
                    )}

                    {policy.cashlessHospitals && (
                      <div className="text-[10px] text-emerald-700 font-semibold">
                        ✓ {policy.cashlessHospitals} Cashless Network Hospitals
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 font-mono">
                      <span>{policy.policyNumber}</span>
                      <span>Till {policy.validUntil}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 📑 TABBED WORKSPACE: CLAIMS, WELFARE REQUESTS, TRAINING, HEALTH, LEAVES */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Navigation Bar */}
          <div className="flex flex-wrap border-b border-slate-200 bg-slate-50/50 p-1.5 gap-1 text-xs">
            <button
              onClick={() => setActiveTab("insurance")}
              className={`px-4 py-2.5 rounded-2xl font-bold transition-all flex items-center gap-2 ${
                activeTab === "insurance"
                  ? "bg-white text-slate-900 shadow-xs border border-slate-200/80"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              <span>Insurance Claims ({account.claims.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("welfare_requests")}
              className={`px-4 py-2.5 rounded-2xl font-bold transition-all flex items-center gap-2 ${
                activeTab === "welfare_requests"
                  ? "bg-white text-slate-900 shadow-xs border border-slate-200/80"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <HeartHandshake className="w-3.5 h-3.5 text-emerald-600" />
              <span>Welfare &amp; Scholarships ({account.assistanceRequests.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("training")}
              className={`px-4 py-2.5 rounded-2xl font-bold transition-all flex items-center gap-2 ${
                activeTab === "training"
                  ? "bg-white text-slate-900 shadow-xs border border-slate-200/80"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
              <span>Skill Academy &amp; Certifications</span>
            </button>

            <button
              onClick={() => setActiveTab("health")}
              className={`px-4 py-2.5 rounded-2xl font-bold transition-all flex items-center gap-2 ${
                activeTab === "health"
                  ? "bg-white text-slate-900 shadow-xs border border-slate-200/80"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
              <span>Health Camps &amp; Vitals</span>
            </button>

            <button
              onClick={() => setActiveTab("leaves")}
              className={`px-4 py-2.5 rounded-2xl font-bold transition-all flex items-center gap-2 ${
                activeTab === "leaves"
                  ? "bg-white text-slate-900 shadow-xs border border-slate-200/80"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span>Paid Leaves ({account.leaveBalance.remaining} Left)</span>
            </button>
          </div>

          {/* TAB 1: INSURANCE CLAIMS */}
          {activeTab === "insurance" && (
            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-black text-slate-900">Insurance Claims &amp; Settlement Ledger</h3>
                  <p className="text-xs text-slate-500">
                    Track incident reports, cashless medical authorizations, and third-party customer property settlements.
                  </p>
                </div>
                <button
                  onClick={() => setIsClaimModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>File New Incident Claim</span>
                </button>
              </div>

              <div className="space-y-3">
                {account.claims.map((claim) => (
                  <div
                    key={claim.id}
                    className="p-4 sm:p-5 rounded-2xl border border-slate-200 hover:border-slate-300 transition-colors space-y-3 bg-slate-50/40"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono font-bold text-slate-900 bg-white px-2 py-1 rounded-lg border border-slate-200">
                          {claim.id}
                        </span>
                        <span className="font-bold text-slate-700">{claim.insuranceType.replace("_", " ")}</span>
                        <span className="text-slate-400">&bull; {claim.incidentDate}</span>
                      </div>

                      <span
                        className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase self-start sm:self-auto ${
                          claim.status === "DISBURSED"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            : claim.status === "APPROVED"
                            ? "bg-blue-100 text-blue-800 border border-blue-200"
                            : "bg-amber-100 text-amber-800 border border-amber-200"
                        }`}
                      >
                        {claim.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">{claim.description}</p>

                    {claim.customerAffected && (
                      <div className="text-[11px] text-amber-800 font-semibold bg-amber-50 p-2 rounded-xl border border-amber-200 flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5 text-amber-600" />
                        <span>Customer Property Affected: {claim.customerAffected} &bull; Client compensated directly.</span>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                      <div className="flex items-center gap-4">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Claimed:</span>
                          <span className="font-bold text-slate-800">₹{claim.amountClaimed.toLocaleString("en-IN")}</span>
                        </div>
                        {claim.amountApproved && (
                          <div>
                            <span className="text-[10px] text-emerald-600 block">Disbursed DBT:</span>
                            <span className="font-bold text-emerald-700">₹{claim.amountApproved.toLocaleString("en-IN")}</span>
                          </div>
                        )}
                      </div>

                      {claim.transactionRef && (
                        <span className="font-mono text-[10px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                          Ref: {claim.transactionRef}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: WELFARE & SCHOLARSHIP REQUESTS */}
          {activeTab === "welfare_requests" && (
            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-black text-slate-900">Cooperative Welfare Grants &amp; Child Scholarships</h3>
                  <p className="text-xs text-slate-500">
                    Direct grants from the 2% Cooperative Welfare Fund for medical emergencies, tool repairs, and children's tuition fees.
                  </p>
                </div>
                <button
                  onClick={() => setIsAssistanceModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Apply for Welfare Assistance</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {account.assistanceRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-5 rounded-2xl border border-slate-200 space-y-3 bg-white hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        {req.id}
                      </span>
                      <span
                        className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase ${
                          req.status === "DISBURSED"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-emerald-700">
                        {req.category.replace("_", " ")}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900">{req.beneficiaryDetails}</h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed">{req.reason}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-500">Amount Sanctioned:</span>
                      <span className="text-emerald-700 text-sm">₹{req.amountRequested.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: TRAINING & SKILL DEVELOPMENT */}
          {activeTab === "training" && (
            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="text-base font-black text-slate-900">Skill Development &amp; Wage Boost Masterclasses</h3>
                <p className="text-xs text-slate-500">
                  Government-recognized certifications (Skill India &amp; NSDC). Completing courses unlocks higher-tier job dispatch with enhanced earnings.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {account.trainings.map((trn) => (
                  <div
                    key={trn.id}
                    className={`p-5 rounded-3xl border transition-all space-y-3 flex flex-col justify-between ${
                      trn.enrolledStatus === "COMPLETED"
                        ? "bg-emerald-50/40 border-emerald-200"
                        : trn.isAiRecommended
                        ? "bg-indigo-50/40 border-indigo-200 ring-2 ring-indigo-400/20"
                        : "bg-white border-slate-200"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{trn.category}</span>
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                            trn.enrolledStatus === "COMPLETED"
                              ? "bg-emerald-600 text-white"
                              : trn.enrolledStatus === "ENROLLED"
                              ? "bg-indigo-600 text-white"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {trn.enrolledStatus}
                        </span>
                      </div>

                      <h4 className="text-sm font-black text-slate-900 leading-snug">{trn.title}</h4>
                      <p className="text-xs text-slate-600">
                        {trn.certification} &bull; {trn.duration}
                      </p>

                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>Wage Potential: {trn.wageBoost}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between">
                      {trn.certificateNumber ? (
                        <span className="font-mono text-[10px] text-emerald-700 font-bold">
                          {trn.certificateNumber}
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">★ {trn.rating} Course Rating</span>
                      )}

                      <button
                        onClick={() => handleTrainingAction(trn.id)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                          trn.enrolledStatus === "COMPLETED"
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            : trn.enrolledStatus === "ENROLLED"
                            ? "bg-emerald-600 text-white hover:bg-emerald-700"
                            : "bg-indigo-600 text-white hover:bg-indigo-700"
                        }`}
                      >
                        {trn.enrolledStatus === "COMPLETED"
                          ? "Download Certificate ↗"
                          : trn.enrolledStatus === "ENROLLED"
                          ? "Mark as Completed"
                          : "Enroll in Program"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: HEALTH CAMPS */}
          {activeTab === "health" && (
            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="text-base font-black text-slate-900">Occupational Health Records &amp; Fitness Camps</h3>
                <p className="text-xs text-slate-500">
                  Preventive health screenings funded by the cooperative federation. Certified fitness records are required for high-risk wiring &amp; plumbing.
                </p>
              </div>

              <div className="space-y-4">
                {account.healthRecords.map((hlth) => (
                  <div
                    key={hlth.id}
                    className="p-5 rounded-2xl border border-slate-200 space-y-3 bg-slate-50/40"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{hlth.location}</div>
                        <div className="text-xs text-slate-500">{hlth.doctorName} &bull; {hlth.campDate}</div>
                      </div>
                      <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase self-start sm:self-auto">
                        {hlth.fitnessStatus.replace("_", " ")}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-3 p-3 bg-white rounded-xl border border-slate-200 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Blood Pressure:</span>
                        <span className="font-bold text-slate-800">{hlth.bloodPressure}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Fasting Glucose:</span>
                        <span className="font-bold text-slate-800">{hlth.bloodGlucose}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Vision Acuity:</span>
                        <span className="font-bold text-slate-800">{hlth.vision}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 italic leading-relaxed">
                      &ldquo;{hlth.recommendations}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: LEAVE MANAGEMENT */}
          {activeTab === "leaves" && (
            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-black text-slate-900">Cooperative Paid Leaves &amp; Peer Coverage</h3>
                  <p className="text-xs text-slate-500">
                    18 annual paid co-op leaves. Automated peer dispatch guarantees that customer bookings remain fulfilled when you take time off.
                  </p>
                </div>
                <button
                  onClick={() => setIsLeaveModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Request Paid Leave</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 text-center">
                  <span className="text-xs text-blue-700 font-bold block">Annual Quota</span>
                  <span className="text-2xl font-black text-blue-950">{account.leaveBalance.totalAnnual} Days</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-xs text-slate-500 font-bold block">Used Leaves</span>
                  <span className="text-2xl font-black text-slate-800">{account.leaveBalance.used} Days</span>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-center">
                  <span className="text-xs text-emerald-700 font-bold block">Remaining Paid Leaves</span>
                  <span className="text-2xl font-black text-emerald-950">{account.leaveBalance.remaining} Days</span>
                </div>
              </div>

              <div className="space-y-3">
                {account.leaves.map((l) => (
                  <div
                    key={l.id}
                    className="p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-slate-50/40"
                  >
                    <div>
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <span>{l.type.replace("_", " ")}</span>
                        <span className="text-slate-400 font-normal">({l.days} days)</span>
                      </div>
                      <p className="text-slate-500 mt-0.5">{l.startDate} &ndash; {l.endDate} &bull; Reason: {l.reason}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        {l.status}
                      </span>
                      <div className="text-[11px] text-slate-400 mt-1">Peer Assigned: {l.peerReplacement}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 🔴 MODAL 1: FILE INSURANCE CLAIM */}
      {isClaimModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                <h3 className="text-base font-black text-slate-900">File Cooperative Insurance Claim</h3>
              </div>
              <button
                onClick={() => setIsClaimModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFileClaim} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Insurance Category</label>
                <select
                  value={claimPolicyType}
                  onChange={(e) => setClaimPolicyType(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-bold text-slate-800 focus:ring-2 focus:ring-rose-500"
                >
                  <option value="PERSONAL_ACCIDENT">Personal Accident &amp; On-Duty Injury (₹5,00,000)</option>
                  <option value="THIRD_PARTY_LIABILITY">Third-Party Customer Property Damage (₹1,00,000)</option>
                  <option value="HEALTH_INSURANCE">Cashless Hospitalization Reimbursement (₹3,00,000)</option>
                  <option value="LIFE_INSURANCE">Life / Disability Compensation (₹10,00,000)</option>
                </select>
              </div>

              {claimPolicyType === "THIRD_PARTY_LIABILITY" && (
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Customer &amp; Society Affected</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mr. Sharma, Flat 301, Sobha City"
                    value={claimCustomerAffected}
                    onChange={(e) => setClaimCustomerAffected(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Incident Date</label>
                  <input
                    type="text"
                    value={claimDate}
                    onChange={(e) => setClaimDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Claim Amount (₹)</label>
                  <input
                    type="number"
                    required
                    value={claimAmount}
                    onChange={(e) => setClaimAmount(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description of Incident</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe what occurred (e.g. Electrician slipped from step-ladder while wiring or pipe valve burst damaged customer wall)..."
                  value={claimDesc}
                  onChange={(e) => setClaimDesc(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800"
                />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-slate-600">
                <span className="text-[11px] font-semibold">Incident Photo &amp; Hospital Bill:</span>
                <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  ✓ bill_evidence.jpg
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/30 transition-all"
              >
                Submit Claim for Immediate DBT Payout
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 🟢 MODAL 2: APPLY FOR WELFARE ASSISTANCE */}
      {isAssistanceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-black text-slate-900">Apply for Cooperative Welfare Assistance</h3>
              </div>
              <button
                onClick={() => setIsAssistanceModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplyAssistance} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Grant Purpose</label>
                <select
                  value={assistCategory}
                  onChange={(e) => setAssistCategory(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-bold text-slate-800"
                >
                  <option value="MEDICAL_EMERGENCY">Medical Emergency Assistance</option>
                  <option value="CHILD_SCHOLARSHIP">Children Education / Scholarship Grant (Vidya Nidhi)</option>
                  <option value="TOOL_EQUIPMENT_REPAIR">Tool / Equipment Emergency Repair</option>
                  <option value="CRITICAL_LIVELIHOOD">Seasonal Livelihood / Disaster Relief Stipend</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Beneficiary Name &amp; Relation</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Daughter Aarav Thorne (Class 10)"
                  value={assistBeneficiary}
                  onChange={(e) => setAssistBeneficiary(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Amount Requested (₹)</label>
                <input
                  type="number"
                  required
                  value={assistAmount}
                  onChange={(e) => setAssistAmount(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Reason &amp; Fund Utilization</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detail the specific requirement for this grant..."
                  value={assistReason}
                  onChange={(e) => setAssistReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition-all"
              >
                Submit Welfare Grant Application
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 🔵 MODAL 3: REQUEST PAID LEAVE */}
      {isLeaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-black text-slate-900">Request Cooperative Paid Leave</h3>
              </div>
              <button
                onClick={() => setIsLeaveModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplyLeave} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Leave Category</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-bold text-slate-800"
                >
                  <option value="CASUAL_LEAVE">Casual Leave</option>
                  <option value="SICK_LEAVE">Medical / Sick Leave</option>
                  <option value="FESTIVAL_LEAVE">Festival / Family Function Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={leaveStartDate}
                    onChange={(e) => setLeaveStartDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={leaveEndDate}
                    onChange={(e) => setLeaveEndDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Number of Days</label>
                <input
                  type="number"
                  min={1}
                  max={account.leaveBalance.remaining}
                  value={leaveDays}
                  onChange={(e) => setLeaveDays(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Reason</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Reason for time off..."
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-[11px] leading-relaxed">
                <strong>Peer Auto-Coverage:</strong> A verified local peer specialist will be routed any incoming bookings during your leave period.
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-md shadow-blue-600/20"
              >
                Approve Paid Leave &amp; Assign Peer
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
