"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Play,
  Pause,
  Upload,
  User,
  Phone,
  MessageSquare,
  ShieldCheck,
  Star,
  Plus,
  Trash2,
  Check,
  ExternalLink,
  Zap,
  RotateCcw,
  FileText,
  DollarSign,
  Compass,
} from "lucide-react";
import {
  ProviderJob,
  JobStatus,
  getProviderJobById,
  getProviderJobs,
  saveProviderJobs,
  canTransitionStatus,
} from "@/lib/providerData";

export default function ProviderJobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = (params?.id as string) || "JOB-401";

  const [job, setJob] = useState<ProviderJob | null>(null);

  // Modals
  const [showConfirmModal, setShowConfirmModal] = useState<{
    open: boolean;
    targetStatus: JobStatus;
    title: string;
    description: string;
  } | null>(null);

  const [showProofModal, setShowProofModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);

  // Service Proof Form State
  const [proofNotes, setProofNotes] = useState("");
  const [proofPhotos, setProofPhotos] = useState<string[]>([
    "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80",
  ]);
  const [materials, setMaterials] = useState<
    { name: string; cost: number; quantity: number }[]
  >([]);
  const [newPartName, setNewPartName] = useState("");
  const [newPartCost, setNewPartCost] = useState("");

  // Reschedule state
  const [rescheduleDate, setRescheduleDate] = useState("Tomorrow");
  const [rescheduleSlot, setRescheduleSlot] = useState("02:30 PM");

  // Load Job
  useEffect(() => {
    const loaded = getProviderJobById(jobId);
    if (loaded) {
      setJob(loaded);
      if (loaded.materialsUsed) setMaterials(loaded.materialsUsed);
      if (loaded.serviceProof?.technicianNotes) {
        setProofNotes(loaded.serviceProof.technicianNotes);
      }
    }
  }, [jobId]);

  if (!job) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleApplyTransition = (nextStatus: JobStatus, note?: string) => {
    if (!canTransitionStatus(job.status, nextStatus)) {
      alert(`Invalid Transition: Cannot change status from ${job.status} to ${nextStatus}.`);
      return;
    }

    const newHistory = [
      ...job.history,
      {
        status: nextStatus,
        timestamp: `Today, ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
        note: note || `Status updated to ${nextStatus}`,
      },
    ];

    const updatedJob: ProviderJob = {
      ...job,
      status: nextStatus,
      history: newHistory,
      ...(nextStatus === "PAUSED" ? { pausedReason: note || "Awaiting customer approval" } : {}),
    };

    setJob(updatedJob);

    // Persist to all provider jobs
    const allJobs = getProviderJobs();
    const updatedAll = allJobs.map((j) => (j.id === job.id ? updatedJob : j));
    saveProviderJobs(updatedAll);
    setShowConfirmModal(null);
  };

  // Add spare material
  const handleAddMaterial = () => {
    if (!newPartName.trim() || !newPartCost) return;
    const cost = parseFloat(newPartCost) || 0;
    const updated = [...materials, { name: newPartName.trim(), cost, quantity: 1 }];
    setMaterials(updated);
    setNewPartName("");
    setNewPartCost("");
  };

  const handleRemoveMaterial = (index: number) => {
    setMaterials(materials.filter((_, i) => i !== index));
  };

  const totalMaterialsCost = materials.reduce(
    (acc, item) => acc + item.cost * item.quantity,
    0
  );

  // Finalize completion with service proof
  const handleCompleteJobWithProof = () => {
    const newHistory = [
      ...job.history,
      {
        status: "COMPLETED" as JobStatus,
        timestamp: `Today, ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
        note: "Service completed with photo proof & inspection report",
      },
    ];

    const updatedJob: ProviderJob = {
      ...job,
      status: "COMPLETED",
      materialsUsed: materials,
      additionalPaymentRequested: totalMaterialsCost,
      serviceProof: {
        photos: proofPhotos,
        technicianNotes: proofNotes || "Comprehensive cleaning and pressure check completed successfully.",
        completedAt: `Today, ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
      },
      history: newHistory,
    };

    setJob(updatedJob);

    const allJobs = getProviderJobs();
    const updatedAll = allJobs.map((j) => (j.id === job.id ? updatedJob : j));
    saveProviderJobs(updatedAll);
    setShowProofModal(false);
  };

  // Handle Reschedule
  const handleConfirmReschedule = () => {
    const updatedJob: ProviderJob = {
      ...job,
      date: rescheduleDate,
      timeSlot: rescheduleSlot,
      history: [
        ...job.history,
        {
          status: job.status,
          timestamp: "Today",
          note: `Rescheduled to ${rescheduleDate}, ${rescheduleSlot}`,
        },
      ],
    };
    setJob(updatedJob);
    const allJobs = getProviderJobs();
    const updatedAll = allJobs.map((j) => (j.id === job.id ? updatedJob : j));
    saveProviderJobs(updatedAll);
    setShowRescheduleModal(false);
  };

  const STATUS_STEPS: JobStatus[] = [
    "ASSIGNED",
    "ACCEPTED",
    "ON_THE_WAY",
    "ARRIVED",
    "SERVICE_STARTED",
    "COMPLETED",
  ];

  const currentStepIndex = STATUS_STEPS.indexOf(
    job.status === "PAUSED" ? "SERVICE_STARTED" : job.status
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link
            href="/provider"
            className="hover:text-brand-600 flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Provider Portal</span>
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-bold">Job #{job.id}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowContactModal(true)}
            className="px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs shadow-sm flex items-center gap-1.5"
          >
            <Phone className="w-3.5 h-3.5 text-brand-600" />
            <span>Contact Customer</span>
          </button>

          <button
            onClick={() => setShowRescheduleModal(true)}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reschedule</span>
          </button>
        </div>
      </div>

      {/* Main Job Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        {/* Header with Service & Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full">
                {job.category}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  job.status === "COMPLETED"
                    ? "bg-emerald-100 text-emerald-800"
                    : job.status === "ON_THE_WAY"
                    ? "bg-amber-100 text-amber-900 animate-pulse"
                    : job.status === "SERVICE_STARTED"
                    ? "bg-blue-100 text-blue-900"
                    : job.status === "PAUSED"
                    ? "bg-rose-100 text-rose-900"
                    : "bg-slate-100 text-slate-800"
                }`}
              >
                {job.status.replace(/_/g, " ")}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              {job.serviceName}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Scheduled for <strong>{job.date}, {job.timeSlot}</strong>
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Payout</span>
            <span className="text-2xl font-black text-slate-900">₹{job.price + totalMaterialsCost}</span>
            <span className="text-[11px] text-emerald-600 font-semibold block">
              {job.paymentStatus.replace(/_/g, " ")}
            </span>
          </div>
        </div>

        {/* 7-Step Interactive Status Timeline */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Live Job Status Flow
            </span>
            <span className="text-xs font-bold text-brand-600">
              Current: {job.status.replace(/_/g, " ")}
            </span>
          </div>

          <div className="grid grid-cols-6 gap-1 sm:gap-2">
            {STATUS_STEPS.map((step, idx) => {
              const isPast = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              return (
                <div key={step} className="flex flex-col items-center text-center">
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                      isPast
                        ? "bg-emerald-600 text-white shadow-sm"
                        : isCurrent
                        ? "bg-brand-600 text-white ring-4 ring-brand-100"
                        : "bg-slate-200 text-slate-400"
                    }`}
                  >
                    {isPast ? "✓" : idx + 1}
                  </div>
                  <span
                    className={`text-[9px] sm:text-[10px] font-bold mt-1.5 uppercase truncate w-full ${
                      isCurrent
                        ? "text-brand-700 font-black"
                        : isPast
                        ? "text-emerald-700"
                        : "text-slate-400"
                    }`}
                  >
                    {step.replace(/_/g, " ")}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Action Buttons for Current Status */}
        <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-teal-950 text-xs sm:text-sm">
                Next Stage:{" "}
                {job.status === "ASSIGNED"
                  ? "Accept or Reject this appointment"
                  : job.status === "ACCEPTED"
                  ? "Mark On The Way when departing"
                  : job.status === "ON_THE_WAY"
                  ? "Mark Arrived when outside customer building"
                  : job.status === "ARRIVED"
                  ? "Begin service inspection"
                  : job.status === "SERVICE_STARTED"
                  ? "Complete service and capture work proof"
                  : job.status === "PAUSED"
                  ? "Resume paused work"
                  : "Service Completed"}
              </p>
              <p className="text-[11px] text-teal-700">
                CoopServe ensures full insurance coverage during active transitions.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {job.status === "ASSIGNED" && (
              <>
                <button
                  onClick={() =>
                    setShowConfirmModal({
                      open: true,
                      targetStatus: "ACCEPTED",
                      title: "Accept Job Appointment",
                      description: "Confirm your commitment to fulfill this request on time.",
                    })
                  }
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Accept Job</span>
                </button>
                <button
                  onClick={() =>
                    setShowConfirmModal({
                      open: true,
                      targetStatus: "REJECTED",
                      title: "Decline Service Request",
                      description: "Are you sure you want to decline? This job will be re-routed to another pro.",
                    })
                  }
                  className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs"
                >
                  Reject
                </button>
              </>
            )}

            {job.status === "ACCEPTED" && (
              <button
                onClick={() =>
                  setShowConfirmModal({
                    open: true,
                    targetStatus: "ON_THE_WAY",
                    title: "Mark On The Way",
                    description: "Notify customer Aarav Mehta that you are heading to the location.",
                  })
                }
                className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Mark On The Way</span>
              </button>
            )}

            {job.status === "ON_THE_WAY" && (
              <button
                onClick={() =>
                  setShowConfirmModal({
                    open: true,
                    targetStatus: "ARRIVED",
                    title: "Mark Arrived",
                    description: "Confirm you have reached Flat 402, Sunshine Heights.",
                  })
                }
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 flex items-center gap-1.5"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Mark Arrived</span>
              </button>
            )}

            {job.status === "ARRIVED" && (
              <button
                onClick={() =>
                  setShowConfirmModal({
                    open: true,
                    targetStatus: "SERVICE_STARTED",
                    title: "Start Service",
                    description: "Begin physical diagnosis, mask floors, and initiate high-pressure wash.",
                  })
                }
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Start Service</span>
              </button>
            )}

            {job.status === "SERVICE_STARTED" && (
              <>
                <button
                  onClick={() =>
                    setShowConfirmModal({
                      open: true,
                      targetStatus: "PAUSED",
                      title: "Pause Service",
                      description: "Pause service timer while waiting for customer approval or spare parts run.",
                    })
                  }
                  className="px-3.5 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs flex items-center gap-1"
                >
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pause</span>
                </button>
                <button
                  onClick={() => setShowProofModal(true)}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Complete Service & Upload Proof</span>
                </button>
              </>
            )}

            {job.status === "PAUSED" && (
              <button
                onClick={() => handleApplyTransition("SERVICE_STARTED", "Work resumed by Rahul")}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Resume Service</span>
              </button>
            )}

            {job.status === "COMPLETED" && (
              <span className="px-3.5 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-black flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Resolved & Certified</span>
              </span>
            )}
          </div>
        </div>

        {/* 3-Column Info Grid: Customer, Location, Service Notes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* 1. Customer Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-brand-600" />
              <span>Customer Details</span>
            </span>
            <p className="font-bold text-slate-900 text-sm">{job.customerName}</p>
            <p className="text-slate-600">{job.customerPhone}</p>
            <button
              onClick={() => setShowContactModal(true)}
              className="mt-1 text-xs font-bold text-brand-600 hover:underline flex items-center gap-1"
            >
              <MessageSquare className="w-3 h-3" />
              <span>Send Message</span>
            </button>
          </div>

          {/* 2. Address & Location */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-brand-600" />
              <span>Service Address</span>
            </span>
            <p className="font-bold text-slate-900">{job.locality}, {job.city}</p>
            <p className="text-slate-600 truncate">{job.address}</p>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(job.address)}`}
              target="_blank"
              rel="noreferrer"
              className="mt-1 text-xs font-bold text-brand-600 hover:underline flex items-center gap-1"
            >
              <Compass className="w-3 h-3" />
              <span>Navigate via Google Maps ↗</span>
            </a>
          </div>

          {/* 3. Schedule & Warranty */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-brand-600" />
              <span>Schedule & Protection</span>
            </span>
            <p className="font-bold text-slate-900">{job.date}, {job.timeSlot}</p>
            <p className="text-emerald-700 font-semibold">{job.warranty}</p>
            <span className="text-[11px] text-slate-500 block">Inspection slot confirmed</span>
          </div>
        </div>

        {/* Customer Issue Description & Reference Photos */}
        <div className="border-t border-slate-100 pt-6 space-y-3">
          <h3 className="text-sm font-black text-slate-900">Customer Problem Statement & Photos</h3>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Reported Issue
              </span>
              <p className="text-slate-800 bg-white p-3 rounded-xl border border-slate-200 font-medium">
                "{job.issueDescription}"
              </p>
            </div>

            {job.notes && (
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Access & Gate Instructions
                </span>
                <p className="text-slate-700 bg-white p-3 rounded-xl border border-slate-200">
                  {job.notes}
                </p>
              </div>
            )}

            {job.uploadedPhotos && job.uploadedPhotos.length > 0 && (
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">
                  Customer Uploaded Photos ({job.uploadedPhotos.length})
                </span>
                <div className="flex flex-wrap gap-3">
                  {job.uploadedPhotos.map((url, i) => (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="group relative block w-24 h-24 rounded-xl overflow-hidden border-2 border-slate-200 hover:border-brand-500 shadow-sm"
                    >
                      <img
                        src={url}
                        alt="Customer Photo"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Billable Materials & Extra Payment Section */}
        <div className="border-t border-slate-100 pt-6 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-900">Spare Parts & Billable Materials</h3>
              <p className="text-xs text-slate-500">
                Add genuine replacement parts fitted during the service.
              </p>
            </div>
            {totalMaterialsCost > 0 && (
              <span className="text-xs font-black text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-200">
                Extra: +₹{totalMaterialsCost}
              </span>
            )}
          </div>

          {materials.length > 0 ? (
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white text-xs">
              {materials.map((mat, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{mat.name}</span>
                    <span className="text-slate-400">x{mat.quantity}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-black text-slate-900">₹{mat.cost * mat.quantity}</span>
                    <button
                      onClick={() => handleRemoveMaterial(idx)}
                      className="text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-500">
              No additional materials or spare parts added yet.
            </div>
          )}

          {/* Add Part Form */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="text"
              placeholder="Part name (e.g. 45uF Running Capacitor)"
              value={newPartName}
              onChange={(e) => setNewPartName(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-brand-500"
            />
            <input
              type="number"
              placeholder="Price (₹)"
              value={newPartCost}
              onChange={(e) => setNewPartCost(e.target.value)}
              className="w-24 px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button
              onClick={handleAddMaterial}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Part</span>
            </button>
          </div>
        </div>

        {/* Service Proof Card if Completed */}
        {job.serviceProof && (
          <div className="border-t border-slate-100 pt-6 space-y-3">
            <h3 className="text-sm font-black text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Completed Service Proof Record</span>
            </h3>

            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3 text-xs">
              <p className="text-emerald-950 font-medium">
                <strong>Technician Findings:</strong> "{job.serviceProof.technicianNotes}"
              </p>
              <span className="text-[11px] text-emerald-700 block">
                Submitted at: {job.serviceProof.completedAt}
              </span>

              {job.serviceProof.photos && job.serviceProof.photos.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold uppercase text-emerald-800 block mb-2">
                    Workmanship Photos
                  </span>
                  <div className="flex gap-2">
                    {job.serviceProof.photos.map((p, idx) => (
                      <img
                        key={idx}
                        src={p}
                        alt="Service proof"
                        className="w-20 h-20 rounded-xl object-cover border border-emerald-300 shadow-sm"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: Confirm State Transition */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-xl animate-in zoom-in-95">
            <h3 className="text-lg font-black text-slate-900">{showConfirmModal.title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {showConfirmModal.description}
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowConfirmModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={() => handleApplyTransition(showConfirmModal.targetStatus)}
                className={`px-4 py-2 rounded-xl text-xs font-bold text-white ${
                  showConfirmModal.targetStatus === "REJECTED"
                    ? "bg-rose-600 hover:bg-rose-700"
                    : "bg-brand-600 hover:bg-brand-700"
                }`}
              >
                Confirm Action
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Service Proof Completion Modal */}
      {showProofModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl animate-in zoom-in-95">
            <div>
              <h3 className="text-lg font-black text-slate-900">Upload Service Proof & Complete</h3>
              <p className="text-xs text-slate-500">
                Attach completion photo and add technical remarks before marking this service resolved.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Technician Resolution Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="E.g. Cleaned evaporator cooling coil, checked gas pressure at 120 PSI, replaced 45uF capacitor. Cooling restored."
                  value={proofNotes}
                  onChange={(e) => setProofNotes(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Completion Proof Photos
                </label>
                <div className="flex items-center gap-3">
                  {proofPhotos.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt="Proof"
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200"
                    />
                  ))}
                  <button
                    onClick={() => {
                      setProofPhotos((prev) => [
                        ...prev,
                        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80",
                      ]);
                    }}
                    className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-300 hover:border-brand-500 flex flex-col items-center justify-center text-[10px] text-slate-400 font-bold"
                  >
                    <Upload className="w-4 h-4 mb-0.5" />
                    <span>+ Photo</span>
                  </button>
                </div>
              </div>

              {materials.length > 0 && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                  <span className="font-bold text-slate-700">Spare Parts Included ({materials.length})</span>
                  <span className="font-black text-brand-600">+₹{totalMaterialsCost}</span>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowProofModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Back
              </button>
              <button
                onClick={handleCompleteJobWithProof}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark Completed & Submit Proof</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Contact Customer */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-xl animate-in zoom-in-95">
            <h3 className="text-lg font-black text-slate-900">Contact {job.customerName}</h3>
            <p className="text-xs text-slate-600">
              Customer Phone: <strong>{job.customerPhone}</strong>
            </p>

            <div className="space-y-2 pt-2">
              <a
                href={`tel:${job.customerPhone}`}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>Call {job.customerName} Directly</span>
              </a>

              <button
                onClick={() => {
                  alert(`Dispatched automated SMS to ${job.customerPhone}: "Hi ${job.customerName}, I am Rahul your CoopServe technician. On my way! ETA ~15 mins."`);
                  setShowContactModal(false);
                }}
                className="w-full py-2.5 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-800 font-bold text-xs flex items-center justify-center gap-2 border border-brand-200"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Send "On The Way" WhatsApp / SMS</span>
              </button>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowContactModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Reschedule */}
      {showRescheduleModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-xl animate-in zoom-in-95">
            <h3 className="text-lg font-black text-slate-900">Reschedule Appointment</h3>
            <p className="text-xs text-slate-600">
              Select a new date & time slot for {job.customerName}.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">New Date</label>
                <select
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none"
                >
                  <option value="Tomorrow">Tomorrow</option>
                  <option value="Thu, 10 Sep">Thu, 10 Sep</option>
                  <option value="Fri, 11 Sep">Fri, 11 Sep</option>
                  <option value="Sat, 12 Sep">Sat, 12 Sep</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">New Time Slot</label>
                <select
                  value={rescheduleSlot}
                  onChange={(e) => setRescheduleSlot(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none"
                >
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="11:30 AM">11:30 AM</option>
                  <option value="02:30 PM">02:30 PM</option>
                  <option value="04:30 PM">04:30 PM</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowRescheduleModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReschedule}
                className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs"
              >
                Confirm Reschedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
