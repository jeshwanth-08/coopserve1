"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Wrench,
  Calendar,
  Clock,
  CheckCircle2,
  Star,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Phone,
  MessageSquare,
  AlertTriangle,
  Play,
  Pause,
  Upload,
  User,
  DollarSign,
  TrendingUp,
  Award,
  FileCheck2,
  HelpCircle,
  Briefcase,
  Check,
  ChevronRight,
  ExternalLink,
  Plus,
  Compass,
  Zap,
  Info,
  Sliders,
  RotateCcw,
  Car,
  Hammer,
  ClipboardList,
  XCircle,
  FileCheck,
} from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import UrgencyBadge from "@/components/UrgencyBadge";
import {
  ProviderJob,
  INITIAL_PROVIDER_JOBS,
  INITIAL_EARNINGS,
  INITIAL_PERFORMANCE,
  INITIAL_AVAILABILITY,
  INITIAL_SERVICES,
  INITIAL_DOCUMENTS,
  INITIAL_REVIEWS,
  getProviderJobs,
  saveProviderJobs,
  JobStatus,
  canTransitionStatus,
} from "@/lib/providerData";
import { broadcastStatusUpdate, subscribeToStatusUpdates } from "@/lib/realtimeSync";

function ProviderDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams ? searchParams.get("tab") || "overview" : "overview";

  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [jobs, setJobs] = useState<ProviderJob[]>(INITIAL_PROVIDER_JOBS);
  const [earnings, setEarnings] = useState(INITIAL_EARNINGS);
  const [performance, setPerformance] = useState(INITIAL_PERFORMANCE);
  const [availability, setAvailability] = useState(INITIAL_AVAILABILITY);
  const [services, setServices] = useState(INITIAL_SERVICES);
  const [documents, setDocuments] = useState(INITIAL_DOCUMENTS);
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);

  // Custom service creation state
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [newServiceName, setNewServiceName] = useState("");
  const [newServicePrice, setNewServicePrice] = useState("299");
  const [newServiceDuration, setNewServiceDuration] = useState("45 mins");

  // Dynamic user & profile state
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentProfile, setCurrentProfile] = useState<any>(null);

  // Profile editable fields
  const [profileName, setProfileName] = useState("");
  const [profileDesignation, setProfileDesignation] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileArea, setProfileArea] = useState("");
  const [profileExp, setProfileExp] = useState("8 Years");
  const [profileBio, setProfileBio] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);

  // Load authenticated user and profile
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setCurrentUser(data.user);
            if (data.user.providerProfile) {
              setCurrentProfile(data.user.providerProfile);
            }
          }
        }
      } catch (e) {
        console.error("Failed to load user:", e);
      }
    }
    loadUser();
  }, []);

  // Real Member Requests from Database
  const [assignedRequests, setAssignedRequests] = useState<any[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [requestActionLoadingId, setRequestActionLoadingId] = useState<string | null>(null);
  const [resolveModalRequest, setResolveModalRequest] = useState<any | null>(null);
  const [completionNotes, setCompletionNotes] = useState("");
  const [declineModalRequest, setDeclineModalRequest] = useState<any | null>(null);
  const [declineReason, setDeclineReason] = useState("");

  const fetchAssignedRequests = async (showLoading = false) => {
    try {
      if (showLoading) setRequestsLoading(true);
      const res = await fetch("/api/requests");
      if (res.ok) {
        const data = await res.json();
        setAssignedRequests(data.requests || []);
      }
    } catch (err) {
      console.error("Failed to load assigned requests:", err);
    } finally {
      if (showLoading) setRequestsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignedRequests(true);

    // 1. Instant cross-tab & in-tab real-time listener
    const unsubscribe = subscribeToStatusUpdates((event) => {
      if (event?.requestId && event?.status) {
        // Immediate local state update from event
        setAssignedRequests((prev) =>
          prev.map((r) =>
            r.id === event.requestId
              ? { ...r, status: event.status, completionNotes: event.note || r.completionNotes }
              : r
          )
        );
      }
      fetchAssignedRequests(false);
    });

    // 2. High-frequency 1.5s background polling for instant sync
    const pollInterval = setInterval(() => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        fetchAssignedRequests(false);
      }
    }, 1500);

    return () => {
      unsubscribe();
      clearInterval(pollInterval);
    };
  }, [currentUser]);

  const handleRequestRespond = async (requestId: string, action: "ACCEPT" | "DECLINE", reason?: string) => {
    const nextStatus = action === "ACCEPT" ? "ACCEPTED" : "DECLINED";

    // 1. Instant optimistic UI update (0ms latency!)
    setAssignedRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: nextStatus } : r))
    );

    // 2. Broadcast update across tabs immediately
    broadcastStatusUpdate({
      requestId,
      status: nextStatus,
      timestamp: new Date().toISOString(),
      providerName: currentUser?.name || "Marcus Thorne",
    });

    try {
      setRequestActionLoadingId(requestId);
      const res = await fetch(`/api/requests/${requestId}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, reason }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || `Failed to ${action.toLowerCase()} request`);
        // Re-fetch on error to revert optimistic state
        await fetchAssignedRequests(false);
        return;
      }

      await fetchAssignedRequests(false);
    } catch (err) {
      alert("Network error processing response");
      await fetchAssignedRequests(false);
    } finally {
      setRequestActionLoadingId(null);
      setDeclineModalRequest(null);
      setDeclineReason("");
    }
  };

  const handleRequestUpdateProgress = async (requestId: string, nextStatus: string, notes?: string) => {
    // 1. Instant optimistic UI update (0ms latency!)
    setAssignedRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? { ...r, status: nextStatus, completionNotes: notes || r.completionNotes }
          : r
      )
    );

    // 2. Broadcast update across tabs immediately
    broadcastStatusUpdate({
      requestId,
      status: nextStatus,
      timestamp: new Date().toISOString(),
      note: notes,
      providerName: currentUser?.name || "Marcus Thorne",
    });

    try {
      setRequestActionLoadingId(requestId);
      const res = await fetch(`/api/requests/${requestId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nextStatus,
          completionNotes: notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || `Failed to update status to ${nextStatus}`);
        await fetchAssignedRequests(false);
        return;
      }

      await fetchAssignedRequests(false);
    } catch (err) {
      alert("Network error updating status");
      await fetchAssignedRequests(false);
    } finally {
      setRequestActionLoadingId(null);
      setResolveModalRequest(null);
      setCompletionNotes("");
    }
  };


  // Sync tab with URL if param changes
  useEffect(() => {
    if (searchParams?.get("tab")) {
      setActiveTab(searchParams.get("tab") as string);
    }
  }, [searchParams]);

  // Load persisted jobs
  useEffect(() => {
    const loaded = getProviderJobs();
    if (loaded && loaded.length > 0) {
      setJobs(loaded);
    }
  }, []);

  // Time-aware greeting
  const [greeting, setGreeting] = useState("Good morning");
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  // Parse skills and categories
  const parsedSkills: string[] = React.useMemo(() => {
    if (!currentProfile?.skills) return [];
    try {
      return Array.isArray(currentProfile.skills)
        ? currentProfile.skills
        : JSON.parse(currentProfile.skills);
    } catch {
      return [currentProfile.skills];
    }
  }, [currentProfile]);

  const parsedCategories: string[] = React.useMemo(() => {
    if (!currentProfile?.serviceCategories) return [];
    try {
      return Array.isArray(currentProfile.serviceCategories)
        ? currentProfile.serviceCategories
        : JSON.parse(currentProfile.serviceCategories);
    } catch {
      return [currentProfile.serviceCategories];
    }
  }, [currentProfile]);

  const providerName = currentUser?.name || "Service Specialist";
  const firstName = providerName.split(" ")[0] || "Specialist";

  // Dynamic trade designation
  const designation = React.useMemo(() => {
    if (parsedSkills.length > 0) return parsedSkills[0];
    if (parsedCategories.length > 0) return `${parsedCategories[0]} Specialist`;
    const lower = (providerName + " " + parsedCategories.join(" ")).toLowerCase();
    if (lower.includes("garden") || lower.includes("plant") || lower.includes("lawn")) return "Master Horticulturist & Garden Specialist";
    if (lower.includes("cook") || lower.includes("chef")) return "Executive Home Chef";
    if (lower.includes("sunita") || lower.includes("beauty")) return "Beauty & Salon Specialist";
    if (lower.includes("marcus") || lower.includes("electric")) return "Master Electrician";
    if (lower.includes("david") || lower.includes("plumb")) return "Journeyman Plumber";
    return "Verified Service Specialist";
  }, [parsedSkills, parsedCategories, providerName]);

  const serviceAreaDisplay =
    currentProfile?.serviceArea || currentUser?.locality || "Greenwood Heights & Local Society";
  const ratingDisplay = currentProfile?.avgRating
    ? `★ ${Number(currentProfile.avgRating).toFixed(1)} Rating`
    : "★ 4.9 Rating";
  const jobsCountDisplay = currentProfile?.totalReviews
    ? `(${currentProfile.totalReviews}+ Jobs)`
    : "(35+ Jobs)";

  // Dynamic avatar selection based on provider identity
  const avatarUrl = React.useMemo(() => {
    const lower = (providerName + " " + parsedCategories.join(" ")).toLowerCase();
    if (lower.includes("garden") || lower.includes("plant") || lower.includes("lawn")) {
      return "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=200&q=80";
    }
    if (lower.includes("cook") || lower.includes("chef")) {
      return "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=200&q=80";
    }
    if (lower.includes("sunita") || lower.includes("salon") || lower.includes("beauty")) {
      return "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80";
    }
    if (lower.includes("david") || lower.includes("plumb")) {
      return "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80";
    }
    if (lower.includes("marcus") || lower.includes("electric")) {
      return "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80";
    }
    return "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=200&q=80";
  }, [providerName, parsedCategories]);

  // Sync profile fields when user/profile loads
  useEffect(() => {
    if (currentUser) {
      setProfileName(currentUser.name || "");
      setProfilePhone(currentUser.phone || "+1 555-0201");
      setProfileArea(currentProfile?.serviceArea || currentUser.locality || "Greenwood Heights");
      setProfileDesignation(designation);

      const lower = (currentUser.name + " " + parsedCategories.join(" ")).toLowerCase();
      if (lower.includes("garden") || lower.includes("plant") || lower.includes("lawn")) {
        setProfileExp("8 Years");
        setProfileBio(
          "Certified horticulturist and landscape specialist in lawn mowing, hedge trimming, organic soil nourishment, and balcony potted plant care."
        );
      } else if (lower.includes("cook") || lower.includes("chef")) {
        setProfileExp("7 Years");
        setProfileBio(
          "Professional home chef specializing in authentic regional North and South Indian cuisines, dietary customization, and high culinary hygiene."
        );
      } else if (lower.includes("sunita") || lower.includes("beauty")) {
        setProfileExp("7 Years");
        setProfileBio(
          "Certified cosmetologist and esthetician specializing in bridal makeover, HD party makeup, scalp therapies, and organic facial treatments."
        );
      } else if (lower.includes("david") || lower.includes("plumb")) {
        setProfileExp("9 Years");
        setProfileBio(
          "Licensed Journeyman Plumber specializing in residential leak diagnostics, hot water systems, high-pressure line snaking, and fixture replacements."
        );
      } else if (lower.includes("marcus") || lower.includes("electric")) {
        setProfileExp("10 Years");
        setProfileBio(
          "Licensed Master Electrician specializing in residential circuit rewiring, main distribution panels, surge suppression, and solar hookups."
        );
      } else {
        setProfileBio("Certified cooperative maintenance specialist dedicated to high-quality craftsmanship.");
      }
    }
  }, [currentUser, currentProfile, designation, parsedCategories]);

  // Adapt demo jobs according to logged in provider's profession
  useEffect(() => {
    if (!currentUser) return;
    const lower = (currentUser.name + " " + (parsedCategories[0] || "")).toLowerCase();
    if (lower.includes("sunita") || lower.includes("salon") || lower.includes("beauty")) {
      setJobs([
        {
          id: "JOB-501",
          customerName: "Alice Henderson",
          customerPhone: "+1 555-0301",
          serviceName: "Bridal Glow Facial & Spa Care",
          category: "Women's Salon & Spa",
          address: "Apartment 4B, Greenwood Heights",
          locality: "Greenwood Heights",
          city: "Greenwood Heights",
          date: "Today",
          timeSlot: "11:00 AM",
          issueDescription: "Pre-event premium organic glow facial treatment and scalp therapy.",
          uploadedPhotos: [],
          price: 1299,
          status: "ON_THE_WAY",
          paymentStatus: "PENDING",
          warranty: "100% Satisfaction Guarantee",
          history: [
            { status: "ASSIGNED", timestamp: "Today, 09:30 AM", note: "Customer preference booking" },
            { status: "ACCEPTED", timestamp: "Today, 09:45 AM", note: "Accepted by Sunita Sharma" },
            { status: "ON_THE_WAY", timestamp: "Today, 10:20 AM", note: "Dispatched to client residence" },
          ],
        },
        {
          id: "JOB-502",
          customerName: "Elena Rostova",
          customerPhone: "+1 555-0305",
          serviceName: "Hair Styling & Mehendi Art Session",
          category: "Beauty",
          address: "Villa 12, Riverside Society",
          locality: "Riverside Society",
          city: "Riverside Society",
          date: "Today",
          timeSlot: "02:30 PM",
          issueDescription: "Full hand traditional mehendi and blowout hair styling.",
          uploadedPhotos: [],
          price: 899,
          status: "ACCEPTED",
          paymentStatus: "PENDING",
          warranty: "CoopServe Clean Touch Guarantee",
          history: [
            { status: "ASSIGNED", timestamp: "Today, 10:15 AM", note: "Scheduled session" },
            { status: "ACCEPTED", timestamp: "Today, 10:30 AM", note: "Accepted by Sunita Sharma" },
          ],
        },
      ]);
      setServices([
        { id: "srv-b1", name: "Bridal & Party Makeup", category: "Women's Salon & Spa", baseLaborRate: 999, duration: "90 min", active: true },
        { id: "srv-b2", name: "Organic Glow Facial Treatment", category: "Women's Salon & Spa", baseLaborRate: 699, duration: "60 min", active: true },
        { id: "srv-b3", name: "Hair Spa & Scalp Therapy", category: "Beauty", baseLaborRate: 599, duration: "45 min", active: true },
        { id: "srv-b4", name: "Traditional Mehendi Art", category: "Beauty", baseLaborRate: 499, duration: "60 min", active: true },
      ]);
    } else if (lower.includes("david") || lower.includes("plumb")) {
      setJobs([
        {
          id: "JOB-601",
          customerName: "Alice Henderson",
          customerPhone: "+1 555-0301",
          serviceName: "Emergency Pipe Leak & Valve Repair",
          category: "Plumber",
          address: "Apartment 4B, Greenwood Heights",
          locality: "Greenwood Heights",
          city: "Greenwood Heights",
          date: "Today",
          timeSlot: "10:30 AM",
          issueDescription: "High pressure kitchen pipe joint dripping heavily under the sink.",
          uploadedPhotos: [],
          price: 450,
          status: "ON_THE_WAY",
          paymentStatus: "PENDING",
          warranty: "30-Day CoopServe Protection Guarantee",
          history: [
            { status: "ASSIGNED", timestamp: "Today, 08:30 AM", note: "Auto-dispatched emergency" },
            { status: "ACCEPTED", timestamp: "Today, 08:45 AM", note: "Accepted by David Chen" },
            { status: "ON_THE_WAY", timestamp: "Today, 09:50 AM", note: "On the way with plumbing toolkit" },
          ],
        },
        {
          id: "JOB-602",
          customerName: "Elena Rostova",
          customerPhone: "+1 555-0305",
          serviceName: "Bathroom Drain Snaking & De-clog",
          category: "Plumber",
          address: "Villa 12, Riverside Society",
          locality: "Riverside Society",
          city: "Riverside Society",
          date: "Today",
          timeSlot: "02:00 PM",
          issueDescription: "Slow drainage in master bath shower drain.",
          uploadedPhotos: [],
          price: 380,
          status: "ACCEPTED",
          paymentStatus: "PENDING",
          warranty: "30-Day CoopServe Protection Guarantee",
          history: [
            { status: "ASSIGNED", timestamp: "Today, 11:00 AM", note: "Regular dispatch" },
            { status: "ACCEPTED", timestamp: "Today, 11:15 AM", note: "Accepted by David Chen" },
          ],
        },
      ]);
      setServices([
        { id: "srv-p1", name: "Emergency Pipe Leak Repair", category: "Plumber", baseLaborRate: 399, duration: "45 min", active: true },
        { id: "srv-p2", name: "High-Pressure Drain Snaking", category: "Plumber", baseLaborRate: 349, duration: "45 min", active: true },
        { id: "srv-p3", name: "Water Heater Installation", category: "Plumber", baseLaborRate: 699, duration: "60 min", active: true },
        { id: "srv-p4", name: "Bathroom Fixture Replacement", category: "Plumber", baseLaborRate: 299, duration: "30 min", active: true },
      ]);
    } else if (lower.includes("marcus") || lower.includes("electric")) {
      setJobs([
        {
          id: "JOB-701",
          customerName: "Alice Henderson",
          customerPhone: "+1 555-0301",
          serviceName: "Main Breaker Tripping & Rewiring",
          category: "Electrician",
          address: "Apartment 4B, Greenwood Heights",
          locality: "Greenwood Heights",
          city: "Greenwood Heights",
          date: "Today",
          timeSlot: "10:00 AM",
          issueDescription: "Circuit breaker trips immediately when microwave and AC are powered together.",
          uploadedPhotos: [],
          price: 520,
          status: "ON_THE_WAY",
          paymentStatus: "PENDING",
          warranty: "60-Day Electrical Safety Warranty",
          history: [
            { status: "ASSIGNED", timestamp: "Today, 08:15 AM", note: "Auto-assigned specialist" },
            { status: "ACCEPTED", timestamp: "Today, 08:30 AM", note: "Accepted by Marcus Thorne" },
            { status: "ON_THE_WAY", timestamp: "Today, 09:45 AM", note: "En route with multimeters and safety gear" },
          ],
        },
        {
          id: "JOB-702",
          customerName: "Elena Rostova",
          customerPhone: "+1 555-0305",
          serviceName: "Modular Smart Switches Installation",
          category: "Electrician",
          address: "Villa 12, Riverside Society",
          locality: "Riverside Society",
          city: "Riverside Society",
          date: "Today",
          timeSlot: "03:30 PM",
          issueDescription: "Install 4 WiFi smart switches in living room and balcony.",
          uploadedPhotos: [],
          price: 490,
          status: "ACCEPTED",
          paymentStatus: "PENDING",
          warranty: "60-Day Electrical Safety Warranty",
          history: [
            { status: "ASSIGNED", timestamp: "Today, 10:00 AM", note: "Scheduled install" },
            { status: "ACCEPTED", timestamp: "Today, 10:20 AM", note: "Accepted by Marcus Thorne" },
          ],
        },
      ]);
      setServices([
        { id: "srv-e1", name: "Main Circuit Breaker & Panel Check", category: "Electrician", baseLaborRate: 449, duration: "60 min", active: true },
        { id: "srv-e2", name: "Modular Switch & Socket Rewiring", category: "Electrician", baseLaborRate: 349, duration: "45 min", active: true },
        { id: "srv-e3", name: "Ceiling Fan & Chandelier Hookup", category: "Electrician", baseLaborRate: 299, duration: "30 min", active: true },
        { id: "srv-e4", name: "EV Charger & Heavy Load Connection", category: "Electrician", baseLaborRate: 899, duration: "90 min", active: true },
      ]);
    } else if (lower.includes("garden") || lower.includes("plant") || lower.includes("lawn")) {
      setJobs([
        {
          id: "JOB-801",
          customerName: "Pooja Hegde",
          customerPhone: "+91 98765 44321",
          serviceName: "Balcony Potted Plant Pruning & Organic Feeding",
          category: "Gardener",
          address: "Flat 402, Block B, Greenwood Heights",
          locality: "Greenwood Heights",
          city: "Bengaluru",
          date: "Today",
          timeSlot: "10:30 AM",
          issueDescription: "Balcony garden topsoil aeration, trimming yellow leaves, and organic neem pest spray.",
          uploadedPhotos: [],
          price: 299,
          status: "ON_THE_WAY",
          paymentStatus: "PENDING",
          warranty: "30-Day Plant Vitality Guarantee",
          history: [
            { status: "ASSIGNED", timestamp: "Today, 08:30 AM", note: "Customer booking" },
            { status: "ACCEPTED", timestamp: "Today, 08:45 AM", note: "Accepted by specialist" },
            { status: "ON_THE_WAY", timestamp: "Today, 09:40 AM", note: "Dispatched with tools and manure" },
          ],
        },
        {
          id: "JOB-802",
          customerName: "Vikram Malhotra",
          customerPhone: "+91 98111 22334",
          serviceName: "Lawn Mowing & Hedge Trimming Session",
          category: "Gardener",
          address: "Villa 18, Palm Meadows",
          locality: "Whitefield",
          city: "Bengaluru",
          date: "Today",
          timeSlot: "02:30 PM",
          issueDescription: "Front lawn grass mowing and neat hedge boundary alignment.",
          uploadedPhotos: [],
          price: 499,
          status: "ACCEPTED",
          paymentStatus: "PENDING",
          warranty: "Clean Bagging & Edging Guarantee",
          history: [
            { status: "ASSIGNED", timestamp: "Today, 10:15 AM", note: "Scheduled morning" },
            { status: "ACCEPTED", timestamp: "Today, 10:30 AM", note: "Accepted by specialist" },
          ],
        },
      ]);
      setServices([
        { id: "srv-g1", name: "Lawn Mowing & Turf Trimming", category: "Gardener", baseLaborRate: 299, duration: "45 min", active: true },
        { id: "srv-g2", name: "Organic Soil Aeration & Neem Pest Spray", category: "Gardener", baseLaborRate: 349, duration: "45 min", active: true },
        { id: "srv-g3", name: "Balcony Garden Makeover & Potting", category: "Gardener", baseLaborRate: 499, duration: "60 min", active: true },
        { id: "srv-g4", name: "Hedge Shaping & Shrub Trimming", category: "Gardener", baseLaborRate: 399, duration: "45 min", active: true },
      ]);
    } else if (lower.includes("cook") || lower.includes("chef")) {
      setJobs([
        {
          id: "JOB-901",
          customerName: "Arun Verma",
          customerPhone: "+91 98222 33445",
          serviceName: "Fresh Daily Dinner Cooking (3 Dishes)",
          category: "Cook",
          address: "Tower 2, Sobha Morzaria",
          locality: "JP Nagar",
          city: "Bengaluru",
          date: "Today",
          timeSlot: "06:30 PM",
          issueDescription: "Chapati, Paneer Butter Masala, and Dal Tadka for family of 4.",
          uploadedPhotos: [],
          price: 349,
          status: "ACCEPTED",
          paymentStatus: "PENDING",
          warranty: "100% Hygiene Guarantee",
          history: [
            { status: "ASSIGNED", timestamp: "Today, 11:30 AM", note: "Evening dinner request" },
            { status: "ACCEPTED", timestamp: "Today, 11:45 AM", note: "Accepted by chef" },
          ],
        },
      ]);
      setServices([
        { id: "srv-c1", name: "Daily Meal Preparation (Lunch/Dinner)", category: "Cook", baseLaborRate: 349, duration: "60 min", active: true },
        { id: "srv-c2", name: "Healthy Low-Oil Diet Meal Prep", category: "Cook", baseLaborRate: 399, duration: "60 min", active: true },
        { id: "srv-c3", name: "Weekend Party Feast Cooking", category: "Cook", baseLaborRate: 699, duration: "90 min", active: true },
      ]);
    }
  }, [currentUser, parsedCategories]);

  // Filters for today's jobs
  const [todayFilter, setTodayFilter] = useState<"ALL" | "ACTIVE" | "COMPLETED">("ALL");

  const todayJobs = jobs.filter((j) => j.date === "Today");
  const upcomingJobs = jobs.filter((j) => j.date !== "Today");

  const filteredTodayJobs = todayJobs.filter((j) => {
    if (todayFilter === "ACTIVE") return j.status !== "COMPLETED" && j.status !== "REJECTED";
    if (todayFilter === "COMPLETED") return j.status === "COMPLETED";
    return true;
  });

  // Toggle on-duty state
  const handleToggleDuty = () => {
    setAvailability((prev) => ({ ...prev, isOnDuty: !prev.isOnDuty }));
  };

  // Quick state update helper
  const handleJobQuickProgress = (jobId: string, nextStatus: JobStatus) => {
    const updated = jobs.map((job) => {
      if (job.id === jobId) {
        if (!canTransitionStatus(job.status, nextStatus)) {
          alert(`Invalid transition: Cannot move directly from ${job.status} to ${nextStatus}`);
          return job;
        }
        const newHistory = [
          ...job.history,
          { status: nextStatus, timestamp: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` },
        ];
        return { ...job, status: nextStatus, history: newHistory };
      }
      return job;
    });
    setJobs(updated);
    saveProviderJobs(updated);

    // Broadcast live parallel update across tabs
    broadcastStatusUpdate({
      requestId: jobId,
      status: nextStatus,
      timestamp: new Date().toISOString(),
    });

    // Also notify backend if this corresponds to a service request
    fetch(`/api/requests/${jobId}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nextStatus }),
    }).catch(() => {});
  };

  // Reply state for reviews
  const [replyText, setReplyText] = useState<{ [id: string]: string }>({});
  const handleSendReply = (revId: string) => {
    const text = replyText[revId];
    if (!text) return;
    setReviews((prev) =>
      prev.map((r) => (r.id === revId ? { ...r, providerReply: text } : r))
    );
    setReplyText((prev) => ({ ...prev, [revId]: "" }));
  };

  const pendingRequestsCount = assignedRequests.filter((r) => r.status === "ASSIGNED").length;

  const NAV_ITEMS = [
    { id: "overview", label: "Overview", icon: Wrench },
    {
      id: "requests",
      label: "Member Requests",
      badge: pendingRequestsCount > 0 ? `${pendingRequestsCount} new` : assignedRequests.length > 0 ? assignedRequests.length : undefined,
      icon: ClipboardList,
    },
    { id: "today", label: "Today's jobs", badge: todayJobs.length, icon: Calendar },
    { id: "upcoming", label: "Upcoming jobs", badge: upcomingJobs.length, icon: Clock },
    { id: "earnings", label: "Earnings", icon: DollarSign },
    { id: "performance", label: "Performance", icon: TrendingUp },
    { id: "reviews", label: "Reviews", icon: Star },
    { id: "availability", label: "Availability", icon: Sliders },
    { id: "services", label: "Services", icon: Briefcase },
    { id: "profile", label: "Profile", icon: User },
    { id: "documents", label: "Documents", icon: FileCheck2 },
    { id: "support", label: "Support", icon: HelpCircle },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header & Greeting Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={avatarUrl}
              alt={providerName}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-brand-500 shadow-md"
            />
            <span
              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                availability.isOnDuty ? "bg-emerald-500" : "bg-slate-400"
              }`}
            />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {greeting}, {firstName} 👋
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800 border border-teal-200">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                {designation}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
              <span>{serviceAreaDisplay}</span>
              <span>•</span>
              <span className="text-emerald-600 font-semibold">{ratingDisplay} {jobsCountDisplay}</span>
            </p>
          </div>
        </div>

        {/* Action Controls & Duty Switch */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleToggleDuty}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm ${
              availability.isOnDuty
                ? "bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100"
                : "bg-slate-100 text-slate-600 border border-slate-300 hover:bg-slate-200"
            }`}
          >
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                availability.isOnDuty ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
              }`}
            />
            <span>{availability.isOnDuty ? "Status: ON DUTY" : "Status: OFF DUTY"}</span>
          </button>

          <Link
            href="/provider/jobs/JOB-401"
            className="px-4 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Active Job (JOB-401)</span>
          </Link>
        </div>
      </div>

      {/* 4 Required Primary KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Today's jobs */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Today's jobs
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{todayJobs.length}</span>
            <span className="text-xs font-bold text-emerald-600">2 in progress</span>
          </div>
          <p className="text-[11px] text-slate-500">4 appointments scheduled for today</p>
        </div>

        {/* Metric 2: This month's earnings */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              This month's earnings
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">₹48,250</span>
            <span className="text-xs font-bold text-emerald-600">+14% vs Aug</span>
          </div>
          <p className="text-[11px] text-slate-500">September earnings to date</p>
        </div>

        {/* Metric 3: Average rating */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Average rating
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">4.9 ★</span>
            <span className="text-xs font-bold text-amber-600">Top 1%</span>
          </div>
          <p className="text-[11px] text-slate-500">Based on 420 customer ratings</p>
        </div>

        {/* Metric 4: Completion rate */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Completion rate
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">98%</span>
            <span className="text-xs font-bold text-emerald-600">Excellent</span>
          </div>
          <p className="text-[11px] text-slate-500">1.2% cancellation rate</p>
        </div>
      </div>

      {/* 11 Navigation Tabs Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-1.5 shadow-sm overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1 min-w-max">
          {NAV_ITEMS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  router.push(`/provider?tab=${tab.id}`);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-teal-400" : "text-slate-400"}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                      isActive ? "bg-teal-500 text-slate-950" : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB CONTENT AREA */}

      {/* 1. OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Active Member Requests Section */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold border border-blue-200 mb-1.5">
                  <ClipboardList className="w-3.5 h-3.5 text-blue-600" />
                  <span>Live Member Requests • Real-Time Database Sync</span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  Assigned Member Requests ({assignedRequests.length})
                </h2>
                <p className="text-xs text-slate-500">
                  Accept incoming requests from cooperative members, update live arrival and work progress, and mark tasks resolved.
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-center">
                <button
                  onClick={() => fetchAssignedRequests(true)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold transition-all flex items-center gap-1.5"
                  title="Refresh member requests from database"
                >
                  <RotateCcw className={`w-3.5 h-3.5 ${requestsLoading ? "animate-spin text-blue-600" : "text-slate-500"}`} />
                  <span>Refresh</span>
                </button>
                <Link
                  href="/provider/requests"
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center gap-1 shadow-sm"
                >
                  <span>All Requests</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {requestsLoading ? (
              <div className="py-8 text-center text-xs text-slate-400">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                Loading member requests from database...
              </div>
            ) : assignedRequests.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-2">
                <p className="text-xs font-bold text-slate-700">No assigned requests currently pending</p>
                <p className="text-[11px] text-slate-500 max-w-md mx-auto">
                  When members book your trade services or central dispatch assigns a request to you, it will appear here immediately with live action controls.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {assignedRequests.map((req) => {
                  const isLoading = requestActionLoadingId === req.id;
                  return (
                    <div
                      key={req.id}
                      className="p-5 sm:p-6 rounded-2xl border border-slate-200 bg-white hover:border-blue-300 transition-all shadow-sm space-y-4"
                    >
                      {/* Request Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-black text-slate-900">{req.category}</span>
                          <StatusBadge status={req.status} size="sm" />
                          <UrgencyBadge isEmergency={req.isEmergency} size="sm" />
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                            #{req.id.slice(-6)}
                          </span>
                        </div>

                        <div className="text-xs text-slate-400 font-medium">
                          Requested on {new Date(req.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      {/* Request Details */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        <div className="md:col-span-2 space-y-2">
                          <p className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-800 leading-relaxed font-medium">
                            "{req.description}"
                          </p>
                          <div className="flex items-center gap-2 text-slate-500">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{req.address} ({req.locality})</span>
                          </div>
                        </div>

                        <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 space-y-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                            Member Customer
                          </span>
                          <p className="font-bold text-slate-900 flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            {req.member?.name || "Cooperative Member"}
                          </p>
                          {req.member?.phone && (
                            <a
                              href={`tel:${req.member.phone}`}
                              className="text-blue-600 hover:underline flex items-center gap-1.5 font-medium"
                            >
                              <Phone className="w-3.5 h-3.5 text-slate-400" />
                              {req.member.phone}
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Completion Notes if resolved */}
                      {req.completionNotes && (
                        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900">
                          <strong className="block font-bold mb-0.5">Completion Notes:</strong>
                          {req.completionNotes}
                        </div>
                      )}

                      {/* Interactive Controls */}
                      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                        <Link
                          href={`/provider/requests/${req.id}`}
                          className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                        >
                          <span>Open Request Action Workspace</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>

                        <div className="flex flex-wrap items-center gap-2">
                          {/* 1. ASSIGNED or PENDING: Accept or Decline */}
                          {(req.status === "ASSIGNED" || req.status === "PENDING") && (
                            <>
                              <button
                                disabled={isLoading}
                                onClick={() => setDeclineModalRequest(req)}
                                className="px-3.5 py-1.5 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold transition-all disabled:opacity-50"
                              >
                                Decline
                              </button>
                              <button
                                disabled={isLoading}
                                onClick={() => handleRequestRespond(req.id, "ACCEPT")}
                                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>{isLoading ? "Processing..." : "Accept Request"}</span>
                              </button>
                            </>
                          )}

                          {/* 2. ACCEPTED: Start Travel */}
                          {req.status === "ACCEPTED" && (
                            <button
                              disabled={isLoading}
                              onClick={() => handleRequestUpdateProgress(req.id, "ON_THE_WAY")}
                              className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                            >
                              <Car className="w-3.5 h-3.5" />
                              <span>{isLoading ? "Updating..." : "Update Progress: On The Way"}</span>
                            </button>
                          )}

                          {/* 3. ON_THE_WAY: Start Work */}
                          {req.status === "ON_THE_WAY" && (
                            <button
                              disabled={isLoading}
                              onClick={() => handleRequestUpdateProgress(req.id, "IN_PROGRESS")}
                              className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                            >
                              <Hammer className="w-3.5 h-3.5" />
                              <span>{isLoading ? "Updating..." : "Update Progress: Start Work (In Progress)"}</span>
                            </button>
                          )}

                          {/* 4. IN_PROGRESS: Mark Resolved */}
                          {req.status === "IN_PROGRESS" && (
                            <button
                              disabled={isLoading}
                              onClick={() => setResolveModalRequest(req)}
                              className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Mark Resolved</span>
                            </button>
                          )}

                          {/* 5. RESOLVED */}
                          {req.status === "RESOLVED" && (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              Service Resolved & Completed
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          {/* Today's Schedule & Active Dispatch */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900">Today's Schedule</h2>
                <p className="text-xs text-slate-500">
                  You have {todayJobs.length} appointments today. Active dispatch is live.
                </p>
              </div>
              <button
                onClick={() => setActiveTab("today")}
                className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 self-start sm:self-center"
              >
                <span>View all today's jobs</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {todayJobs.slice(0, 4).map((job) => (
                <div
                  key={job.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    job.status === "ON_THE_WAY" || job.status === "SERVICE_STARTED"
                      ? "border-brand-500 bg-brand-50/20 ring-2 ring-brand-500/20"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {job.timeSlot}
                    </span>
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        job.status === "COMPLETED"
                          ? "bg-emerald-100 text-emerald-800"
                          : job.status === "ON_THE_WAY"
                          ? "bg-amber-100 text-amber-900 animate-pulse"
                          : job.status === "SERVICE_STARTED"
                          ? "bg-blue-100 text-blue-900"
                          : "bg-slate-100 text-slate-800"
                      }`}
                    >
                      {job.status.replace(/_/g, " ")}
                    </span>
                  </div>

                  <h3 className="font-black text-slate-900 text-sm sm:text-base">{job.serviceName}</h3>
                  <p className="text-xs text-slate-600 flex items-center gap-1.5 mt-1">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold">{job.customerName}</span>
                    <span>•</span>
                    <span className="text-brand-700 font-bold">₹{job.price}</span>
                  </p>

                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{job.address}</span>
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <a
                      href={`tel:${job.customerPhone}`}
                      className="text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1"
                    >
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      <span>Call</span>
                    </a>

                    <Link
                      href={`/provider/jobs/${job.id}`}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1"
                    >
                      <span>Manage Job</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2-Column: Earnings Summary Preview & Performance Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Earnings Summary Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900">Earnings Summary</h3>
                  <p className="text-xs text-slate-500">₹48,250 September earnings</p>
                </div>
                <button
                  onClick={() => setActiveTab("earnings")}
                  className="text-xs font-bold text-brand-600 hover:text-brand-700"
                >
                  Full details →
                </button>
              </div>

              {/* Weekly Mini Bar Chart */}
              <div className="space-y-2">
                <div className="flex items-end justify-between gap-2 h-32 pt-6 border-b border-slate-100 pb-2">
                  {earnings.chartData.map((bar, i) => {
                    const heightPercent = Math.round((bar.amount / 4000) * 100);
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                        <span className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          ₹{bar.amount}
                        </span>
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className={`w-full rounded-t-lg transition-all ${
                            i === 6 ? "bg-teal-500 shadow-md shadow-teal-500/30" : "bg-slate-200 group-hover:bg-slate-300"
                          }`}
                        />
                        <span className="text-[10px] font-bold text-slate-500">{bar.day}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs pt-2">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Pending Payout</span>
                  <span className="text-base font-black text-slate-900">₹{earnings.pendingPayouts}</span>
                  <span className="text-[10px] text-amber-600 font-semibold block">Auto-transfer on Friday</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Completed Payouts</span>
                  <span className="text-base font-black text-slate-900">₹{earnings.completedPayouts}</span>
                  <span className="text-[10px] text-emerald-600 font-semibold block">Transferred to HDFC</span>
                </div>
              </div>
            </div>

            {/* Performance Insights Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900">Performance Insights</h3>
                  <p className="text-xs text-slate-500">Quality score: 99.4/100 (Elite Pro)</p>
                </div>
                <button
                  onClick={() => setActiveTab("performance")}
                  className="text-xs font-bold text-brand-600 hover:text-brand-700"
                >
                  Analytics →
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">Customer Satisfaction (CSAT)</span>
                  <span className="font-bold text-slate-900">4.9 / 5.0 ★</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-amber-400 h-2 rounded-full" style={{ width: "98%" }} />
                </div>

                <div className="flex items-center justify-between text-xs pt-2">
                  <span className="text-slate-600">On-Time Arrival Rate</span>
                  <span className="font-bold text-slate-900">97.6%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: "97.6%" }} />
                </div>

                <div className="flex items-center justify-between text-xs pt-2">
                  <span className="text-slate-600">Repeat Customer Rate</span>
                  <span className="font-bold text-slate-900">{performance.repeatCustomerRate}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: "44%" }} />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 flex items-center gap-3 text-xs">
                <Award className="w-5 h-5 text-teal-600 shrink-0" />
                <div>
                  <p className="font-bold">{firstName} qualifies for ₹3,000 monthly high-performer bonus!</p>
                  <p className="text-[11px] text-teal-700">Maintain &gt;96% completion until Sep 30.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Reviews Preview */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-black text-slate-900">Recent Customer Reviews</h3>
                <p className="text-xs text-slate-500">Latest feedback from verified completed services</p>
              </div>
              <button
                onClick={() => setActiveTab("reviews")}
                className="text-xs font-bold text-brand-600 hover:text-brand-700"
              >
                View all reviews →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.slice(0, 2).map((rev) => (
                <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{rev.customerName}</span>
                    <span className="text-amber-500 font-black">{"★".repeat(rev.rating)}</span>
                  </div>
                  <p className="text-slate-600 italic">"{rev.comment}"</p>
                  <span className="text-[10px] text-slate-400 block">{rev.service} • {rev.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 1.5 MEMBER REQUESTS TAB */}
      {activeTab === "requests" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold border border-blue-200 mb-1.5">
                  <ClipboardList className="w-3.5 h-3.5 text-blue-600" />
                  <span>Central Dispatch • Assigned Member Calls</span>
                </div>
                <h2 className="text-xl font-black text-slate-900">
                  Member Service Requests ({assignedRequests.length})
                </h2>
                <p className="text-xs text-slate-500">
                  All service requests placed by cooperative members and assigned to you. Update progress in real time.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetchAssignedRequests(true)}
                  className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <RotateCcw className={`w-3.5 h-3.5 ${requestsLoading ? "animate-spin text-blue-600" : "text-slate-500"}`} />
                  <span>Refresh DB</span>
                </button>
                <Link
                  href="/provider/requests"
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <span>Workspace View</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {requestsLoading ? (
              <div className="py-12 text-center text-xs text-slate-400">
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                Loading your assigned requests from cooperative database...
              </div>
            ) : assignedRequests.length === 0 ? (
              <div className="py-12 text-center border border-slate-100 rounded-3xl bg-slate-50 space-y-2">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                  <ClipboardList className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">No member requests assigned</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  When members book your trade or dispatch routes jobs to your area, they will appear here with one-click status controls.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {assignedRequests.map((req) => {
                  const isLoading = requestActionLoadingId === req.id;
                  return (
                    <div
                      key={req.id}
                      className="p-5 sm:p-6 rounded-2xl border border-slate-200 bg-white hover:border-blue-300 transition-all shadow-sm space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-black text-slate-900">{req.category}</span>
                          <StatusBadge status={req.status} size="sm" />
                          <UrgencyBadge isEmergency={req.isEmergency} size="sm" />
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                            #{req.id.slice(-6)}
                          </span>
                        </div>

                        <div className="text-xs text-slate-400 font-medium">
                          Booked on {new Date(req.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        <div className="md:col-span-2 space-y-2">
                          <p className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-800 leading-relaxed font-medium">
                            "{req.description}"
                          </p>
                          <div className="flex items-center gap-2 text-slate-500">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{req.address} ({req.locality})</span>
                          </div>
                        </div>

                        <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 space-y-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                            Customer Member
                          </span>
                          <p className="font-bold text-slate-900 flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            {req.member?.name || "Cooperative Member"}
                          </p>
                          {req.member?.phone && (
                            <a
                              href={`tel:${req.member.phone}`}
                              className="text-blue-600 hover:underline flex items-center gap-1.5 font-medium"
                            >
                              <Phone className="w-3.5 h-3.5 text-slate-400" />
                              {req.member.phone}
                            </a>
                          )}
                        </div>
                      </div>

                      {req.completionNotes && (
                        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900">
                          <strong className="block font-bold mb-0.5">Completion Notes:</strong>
                          {req.completionNotes}
                        </div>
                      )}

                      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                        <Link
                          href={`/provider/requests/${req.id}`}
                          className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                        >
                          <span>Open Request Workspace</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>

                        <div className="flex flex-wrap items-center gap-2">
                          {(req.status === "ASSIGNED" || req.status === "PENDING") && (
                            <>
                              <button
                                disabled={isLoading}
                                onClick={() => setDeclineModalRequest(req)}
                                className="px-3.5 py-1.5 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold transition-all disabled:opacity-50"
                              >
                                Decline
                              </button>
                              <button
                                disabled={isLoading}
                                onClick={() => handleRequestRespond(req.id, "ACCEPT")}
                                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>{isLoading ? "Processing..." : "Accept Request"}</span>
                              </button>
                            </>
                          )}

                          {req.status === "ACCEPTED" && (
                            <button
                              disabled={isLoading}
                              onClick={() => handleRequestUpdateProgress(req.id, "ON_THE_WAY")}
                              className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                            >
                              <Car className="w-3.5 h-3.5" />
                              <span>{isLoading ? "Updating..." : "Update Progress: On The Way"}</span>
                            </button>
                          )}

                          {req.status === "ON_THE_WAY" && (
                            <button
                              disabled={isLoading}
                              onClick={() => handleRequestUpdateProgress(req.id, "IN_PROGRESS")}
                              className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                            >
                              <Hammer className="w-3.5 h-3.5" />
                              <span>{isLoading ? "Updating..." : "Update Progress: Start Work (In Progress)"}</span>
                            </button>
                          )}

                          {req.status === "IN_PROGRESS" && (
                            <button
                              disabled={isLoading}
                              onClick={() => setResolveModalRequest(req)}
                              className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Mark Resolved</span>
                            </button>
                          )}

                          {req.status === "RESOLVED" && (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              Service Resolved & Completed
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. TODAY'S JOBS TAB */}
      {activeTab === "today" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">Today's Jobs ({todayJobs.length})</h2>
                <p className="text-xs text-slate-500">
                  Manage active services, progress job status, and capture service proof.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
                <button
                  onClick={() => setActiveTab("requests")}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200 transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <ClipboardList className="w-3.5 h-3.5 text-blue-600" />
                  <span>Live Member Requests ({assignedRequests.length})</span>
                </button>

                <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
                  {(["ALL", "ACTIVE", "COMPLETED"] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setTodayFilter(filter)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        todayFilter === filter
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {filter === "ALL" ? "All (4)" : filter === "ACTIVE" ? "Active (3)" : "Completed (1)"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {filteredTodayJobs.map((job) => (
                <div
                  key={job.id}
                  className="p-5 sm:p-6 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-black text-xs">
                        {job.id}
                      </div>
                      <div>
                        <h3 className="text-base font-black text-slate-900">{job.serviceName}</h3>
                        <p className="text-xs text-slate-500">{job.timeSlot} • {job.locality}, {job.city}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                          job.status === "COMPLETED"
                            ? "bg-emerald-100 text-emerald-800"
                            : job.status === "ON_THE_WAY"
                            ? "bg-amber-100 text-amber-900 animate-pulse"
                            : job.status === "SERVICE_STARTED"
                            ? "bg-blue-100 text-blue-900"
                            : job.status === "ACCEPTED"
                            ? "bg-teal-100 text-teal-900"
                            : "bg-slate-100 text-slate-800"
                        }`}
                      >
                        {job.status.replace(/_/g, " ")}
                      </span>
                      <span className="text-base font-black text-slate-900">₹{job.price}</span>
                    </div>
                  </div>

                  {/* Customer, Address & Issue */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Customer</span>
                      <p className="font-bold text-slate-900">{job.customerName}</p>
                      <a href={`tel:${job.customerPhone}`} className="text-brand-600 hover:underline flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        <span>{job.customerPhone}</span>
                      </a>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Location</span>
                      <p className="text-slate-700 truncate">{job.address}</p>
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(job.address)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-brand-600 hover:underline flex items-center gap-1"
                      >
                        <Compass className="w-3 h-3" />
                        <span>Open GPS Directions ↗</span>
                      </a>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Customer Note</span>
                      <p className="text-slate-700 italic truncate">"{job.issueDescription}"</p>
                      <span className="text-[10px] text-emerald-600 font-semibold">{job.warranty}</span>
                    </div>
                  </div>

                  {/* Status Progression Shortcuts */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex flex-wrap items-center gap-2">
                      {job.status === "ASSIGNED" && (
                        <button
                          onClick={() => handleJobQuickProgress(job.id, "ACCEPTED")}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Accept Job</span>
                        </button>
                      )}

                      {job.status === "ACCEPTED" && (
                        <button
                          onClick={() => handleJobQuickProgress(job.id, "ON_THE_WAY")}
                          className="px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm flex items-center gap-1"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          <span>Mark On The Way</span>
                        </button>
                      )}

                      {job.status === "ON_THE_WAY" && (
                        <button
                          onClick={() => handleJobQuickProgress(job.id, "ARRIVED")}
                          className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm flex items-center gap-1"
                        >
                          <MapPin className="w-3.5 h-3.5" />
                          <span>Mark Arrived</span>
                        </button>
                      )}

                      {job.status === "ARRIVED" && (
                        <button
                          onClick={() => handleJobQuickProgress(job.id, "SERVICE_STARTED")}
                          className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center gap-1"
                        >
                          <Play className="w-3.5 h-3.5" />
                          <span>Start Service</span>
                        </button>
                      )}

                      {job.status === "SERVICE_STARTED" && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleJobQuickProgress(job.id, "PAUSED")}
                            className="px-3.5 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs flex items-center gap-1"
                          >
                            <Pause className="w-3.5 h-3.5" />
                            <span>Pause</span>
                          </button>
                          <Link
                            href={`/provider/jobs/${job.id}`}
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Complete & Upload Proof</span>
                          </Link>
                        </div>
                      )}

                      {job.status === "PAUSED" && (
                        <button
                          onClick={() => handleJobQuickProgress(job.id, "SERVICE_STARTED")}
                          className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center gap-1"
                        >
                          <Play className="w-3.5 h-3.5" />
                          <span>Resume Service</span>
                        </button>
                      )}
                    </div>

                    <Link
                      href={`/provider/jobs/${job.id}`}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1"
                    >
                      <span>Full Job Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. UPCOMING JOBS TAB */}
      {activeTab === "upcoming" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">Upcoming Schedule ({upcomingJobs.length})</h2>
                <p className="text-xs text-slate-500">
                  Future pre-booked appointments for tomorrow and the upcoming week.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {upcomingJobs.map((job) => (
                <div
                  key={job.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase bg-brand-100 text-brand-800 px-2 py-0.5 rounded-full">
                        {job.date} • {job.timeSlot}
                      </span>
                      <span className="text-xs font-bold text-slate-900">{job.id}</span>
                    </div>
                    <h3 className="text-base font-black text-slate-900">{job.serviceName}</h3>
                    <p className="text-xs text-slate-600 flex items-center gap-2">
                      <span className="font-semibold">{job.customerName}</span>
                      <span>•</span>
                      <span>{job.address}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-base font-black text-slate-900">₹{job.price}</span>
                    <Link
                      href={`/provider/jobs/${job.id}`}
                      className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-800 hover:bg-slate-100 font-bold text-xs"
                    >
                      View Job
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. EARNINGS TAB */}
      {activeTab === "earnings" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">Earnings Dashboard</h2>
                <p className="text-xs text-slate-500">
                  Track completed payouts, upcoming disbursements, and transaction history.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert("Payout requested! Transfer of ₹3,840 initiated to HDFC A/C ****4092.")}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20"
                >
                  Withdraw Pending Payout (₹{earnings.pendingPayouts})
                </button>
              </div>
            </div>

            {/* 5 Earning KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Today's earnings</span>
                <p className="text-xl font-black text-slate-900">₹{earnings.today}</p>
                <span className="text-[10px] text-emerald-600 font-semibold">+₹499 from last job</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">This week</span>
                <p className="text-xl font-black text-slate-900">₹{earnings.thisWeek}</p>
                <span className="text-[10px] text-slate-500">18 completed services</span>
              </div>
              <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 space-y-1">
                <span className="text-[10px] font-bold uppercase text-teal-800">This month</span>
                <p className="text-xl font-black text-teal-950">₹{earnings.thisMonth}</p>
                <span className="text-[10px] text-teal-700 font-semibold">{earnings.monthName}</span>
              </div>
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
                <span className="text-[10px] font-bold uppercase text-amber-800">Pending payouts</span>
                <p className="text-xl font-black text-amber-950">₹{earnings.pendingPayouts}</p>
                <span className="text-[10px] text-amber-700">Scheduled: Friday</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Completed payouts</span>
                <p className="text-xl font-black text-slate-900">₹{earnings.completedPayouts}</p>
                <span className="text-[10px] text-emerald-600">Settled to bank</span>
              </div>
            </div>

            {/* Beautiful Weekly Earnings Chart */}
            <div className="border border-slate-200 p-6 rounded-3xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-900">Weekly Earnings Trend</h3>
                  <p className="text-xs text-slate-500">Daily gross payout earnings</p>
                </div>
                <span className="text-xs font-black text-teal-600">Avg ₹2,800/day</span>
              </div>

              <div className="flex items-end justify-between gap-3 h-48 pt-8 border-b border-slate-100 pb-3">
                {earnings.chartData.map((bar, i) => {
                  const heightPercent = Math.round((bar.amount / 4000) * 100);
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                      <span className="text-xs font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity">
                        ₹{bar.amount}
                      </span>
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-xl transition-all duration-300 ${
                          i === 6
                            ? "bg-gradient-to-t from-teal-600 to-teal-400 shadow-lg shadow-teal-500/25"
                            : "bg-gradient-to-t from-slate-300 to-slate-200 group-hover:from-slate-400 group-hover:to-slate-300"
                        }`}
                      />
                      <span className="text-xs font-bold text-slate-600">{bar.day}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Transactions List */}
            <div className="space-y-3">
              <h3 className="text-sm font-black text-slate-900">Recent Service Transactions</h3>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
                {earnings.transactions.map((tx) => (
                  <div key={tx.id} className="p-4 flex items-center justify-between text-xs hover:bg-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{tx.serviceName}</p>
                        <p className="text-slate-400">{tx.date} • {tx.id}</p>
                      </div>
                    </div>
                    <span className="font-black text-emerald-600 text-sm sm:text-base">
                      +₹{tx.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. PERFORMANCE TAB */}
      {activeTab === "performance" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-black text-slate-900">Professional Performance & Quality</h2>
              <p className="text-xs text-slate-500">
                Detailed metrics, customer ratings breakdown, and fulfillment benchmarks.
              </p>
            </div>

            {/* 6 Key Performance Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-1">
                <span className="text-[10px] font-bold uppercase text-amber-800">Average Rating</span>
                <p className="text-2xl font-black text-amber-950">4.9 ★</p>
                <p className="text-xs text-amber-700">{performance.totalReviews} total customer reviews</p>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-1">
                <span className="text-[10px] font-bold uppercase text-emerald-800">Completion Rate</span>
                <p className="text-2xl font-black text-emerald-950">{performance.completionRate}%</p>
                <p className="text-xs text-emerald-700">Far exceeds 90% platform benchmark</p>
              </div>

              <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-200 space-y-1">
                <span className="text-[10px] font-bold uppercase text-rose-800">Cancellation Rate</span>
                <p className="text-2xl font-black text-rose-950">{performance.cancellationRate}%</p>
                <p className="text-xs text-rose-700">Extremely reliable pro record</p>
              </div>

              <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-200 space-y-1">
                <span className="text-[10px] font-bold uppercase text-blue-800">Jobs Completed</span>
                <p className="text-2xl font-black text-blue-950">{performance.jobsCompleted}</p>
                <p className="text-xs text-blue-700">Total career services fulfilled</p>
              </div>

              <div className="p-5 rounded-2xl bg-purple-50/50 border border-purple-200 space-y-1">
                <span className="text-[10px] font-bold uppercase text-purple-800">Repeat Customers</span>
                <p className="text-2xl font-black text-purple-950">{performance.repeatCustomerRate}%</p>
                <p className="text-xs text-purple-700">High customer retention index</p>
              </div>

              <div className="p-5 rounded-2xl bg-teal-50/50 border border-teal-200 space-y-1">
                <span className="text-[10px] font-bold uppercase text-teal-800">Response Time</span>
                <p className="text-2xl font-black text-teal-950">{performance.avgResponseTimeMinutes} mins</p>
                <p className="text-xs text-teal-700">Fast average dispatch acceptance</p>
              </div>
            </div>

            {/* Star Distribution Visualizer */}
            <div className="border border-slate-200 p-6 rounded-3xl space-y-3">
              <h3 className="text-sm font-black text-slate-900">Rating Distribution</h3>
              <div className="space-y-2">
                {performance.ratingBreakdown.map((row) => (
                  <div key={row.stars} className="flex items-center gap-3 text-xs">
                    <span className="w-12 font-bold text-slate-700">{row.stars} Stars</span>
                    <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-amber-400 h-2.5 rounded-full"
                        style={{ width: `${row.percentage}%` }}
                      />
                    </div>
                    <span className="w-12 text-right font-semibold text-slate-500">{row.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. REVIEWS TAB */}
      {activeTab === "reviews" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-black text-slate-900">Customer Reviews ({reviews.length})</h2>
              <p className="text-xs text-slate-500">
                Verified reviews from completed jobs. You can reply to each review directly.
              </p>
            </div>

            <div className="space-y-4">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-5 rounded-2xl border border-slate-200 bg-white space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 text-sm">{rev.customerName}</span>
                      <p className="text-[11px] text-slate-400">{rev.service} • {rev.date}</p>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500 font-black">
                      <span>{"★".repeat(rev.rating)}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">"{rev.comment}"</p>

                  {rev.providerReply && (
                    <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs space-y-1">
                      <span className="font-bold text-teal-900 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-teal-600" />
                        <span>{firstName}'s Reply</span>
                      </span>
                      <p className="text-teal-800">{rev.providerReply}</p>
                    </div>
                  )}

                  {!rev.providerReply && (
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                      <input
                        type="text"
                        placeholder="Write a professional reply..."
                        value={replyText[rev.id] || ""}
                        onChange={(e) => setReplyText({ ...replyText, [rev.id]: e.target.value })}
                        className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500 outline-none"
                      />
                      <button
                        onClick={() => handleSendReply(rev.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800"
                      >
                        Reply
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 7. AVAILABILITY TAB */}
      {activeTab === "availability" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-black text-slate-900">Manage Availability & Service Zones</h2>
              <p className="text-xs text-slate-500">
                Configure your active working days, daily shifts, rest breaks, days off, and dispatch radiuses.
              </p>
            </div>

            {/* Working Days Toggles */}
            <div className="space-y-3">
              <h3 className="text-sm font-black text-slate-900">Working Days</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                {availability.workingDays.map((wd, i) => (
                  <button
                    key={wd.day}
                    onClick={() => {
                      const updated = [...availability.workingDays];
                      updated[i].active = !updated[i].active;
                      setAvailability({ ...availability, workingDays: updated });
                    }}
                    className={`p-3 rounded-2xl border text-center font-bold text-xs transition-all ${
                      wd.active
                        ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                        : "bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <span>{wd.day.slice(0, 3)}</span>
                    <span className="block text-[10px] font-normal mt-0.5">
                      {wd.active ? "Active" : "Off"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Working Hours & Break Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-brand-600" />
                  <span>Working Hours Shift</span>
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={availability.workingHours.start}
                    onChange={(e) =>
                      setAvailability({
                        ...availability,
                        workingHours: { ...availability.workingHours, start: e.target.value },
                      })
                    }
                    className="w-full bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold"
                  />
                  <span className="text-xs text-slate-400">to</span>
                  <input
                    type="text"
                    value={availability.workingHours.end}
                    onChange={(e) =>
                      setAvailability({
                        ...availability,
                        workingHours: { ...availability.workingHours, end: e.target.value },
                      })
                    }
                    className="w-full bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <RotateCcw className="w-4 h-4 text-amber-600" />
                  <span>Afternoon Break Time</span>
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={availability.breakTime.start}
                    onChange={(e) =>
                      setAvailability({
                        ...availability,
                        breakTime: { ...availability.breakTime, start: e.target.value },
                      })
                    }
                    className="w-full bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold"
                  />
                  <span className="text-xs text-slate-400">to</span>
                  <input
                    type="text"
                    value={availability.breakTime.end}
                    onChange={(e) =>
                      setAvailability({
                        ...availability,
                        breakTime: { ...availability.breakTime, end: e.target.value },
                      })
                    }
                    className="w-full bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* Service Areas */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-black text-slate-900">Service Coverage Areas</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {availability.serviceAreas.map((area, idx) => (
                  <div
                    key={area.name}
                    className="p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-slate-900">{area.name}</p>
                      <p className="text-slate-500">{area.radiusKm} km dispatch radius</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={area.active}
                      onChange={() => {
                        const updated = [...availability.serviceAreas];
                        updated[idx].active = !updated[idx].active;
                        setAvailability({ ...availability, serviceAreas: updated });
                      }}
                      className="w-4 h-4 rounded text-brand-600"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => alert("Availability preferences saved successfully!")}
                className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800"
              >
                Save Availability Preferences
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. SERVICES TAB */}
      {activeTab === "services" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">Offered Services & Trade Catalog</h2>
                <p className="text-xs text-slate-500">
                  Manage your active services, customize your base labor prices, and add new trade skills.
                </p>
              </div>
              <button
                onClick={() => setIsAddServiceOpen(!isAddServiceOpen)}
                className="px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isAddServiceOpen ? "Close Form" : "Add Custom Service"}</span>
              </button>
            </div>

            {/* Custom Service Creation Form */}
            {isAddServiceOpen && (
              <div className="p-4 rounded-2xl bg-brand-50/50 border border-brand-200 space-y-3 animate-in fade-in">
                <h3 className="text-xs font-bold uppercase tracking-wider text-brand-900">
                  Add New Custom Service to Your Profile
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[10px] font-bold uppercase text-slate-500">Service Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Balcony Garden Revamp, Organic Soil Conditioning"
                      value={newServiceName}
                      onChange={(e) => setNewServiceName(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none font-semibold text-slate-800"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-slate-500">Base Labor (₹)</label>
                    <input
                      type="number"
                      placeholder="299"
                      value={newServicePrice}
                      onChange={(e) => setNewServicePrice(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none font-bold text-slate-800"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-500">
                    Category: <strong className="text-brand-700">{parsedCategories[0] || "Specialist"}</strong>
                  </span>
                  <button
                    disabled={!newServiceName.trim()}
                    onClick={() => {
                      if (!newServiceName.trim()) return;
                      const newSrv = {
                        id: `srv-custom-${Date.now()}`,
                        name: newServiceName.trim(),
                        category: parsedCategories[0] || "Custom Trade",
                        baseLaborRate: parseInt(newServicePrice) || 299,
                        duration: newServiceDuration || "45 mins",
                        active: true,
                      };
                      setServices([newSrv, ...services]);
                      setNewServiceName("");
                      setIsAddServiceOpen(false);
                    }}
                    className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-xs font-bold shadow-sm"
                  >
                    Save Service
                  </button>
                </div>
              </div>
            )}

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
              {services.map((srv, idx) => (
                <div key={srv.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-brand-700 uppercase bg-brand-50 px-2 py-0.5 rounded-full">
                      {srv.category}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm mt-1">{srv.name}</h3>
                    <p className="text-slate-400">{srv.duration} standard inspection</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Base Labor:</span>
                      <div className="flex items-center gap-1">
                        <span className="text-slate-500 font-bold">₹</span>
                        <input
                          type="number"
                          value={srv.baseLaborRate}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            const updated = [...services];
                            updated[idx].baseLaborRate = val;
                            setServices(updated);
                          }}
                          className="w-20 px-2 py-1 border border-slate-200 rounded-lg text-xs font-black text-slate-900 focus:ring-1 focus:ring-brand-500 outline-none text-right"
                        />
                      </div>
                    </div>

                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={srv.active}
                        onChange={() => {
                          const updated = [...services];
                          updated[idx].active = !updated[idx].active;
                          setServices(updated);
                        }}
                        className="w-4 h-4 rounded text-brand-600 cursor-pointer"
                      />
                      <span className="text-[10px] font-semibold text-slate-500">
                        {srv.active ? "Active" : "Paused"}
                      </span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 9. PROFILE TAB */}
      {activeTab === "profile" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900">Professional Profile</h2>
                <p className="text-xs text-slate-500">
                  Public specialist credentials, trade designation, and service area.
                </p>
              </div>
              {profileSaveSuccess && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full animate-in fade-in">
                  ✓ Profile Saved!
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Full Name</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Designation / Primary Trade</label>
                <input
                  type="text"
                  value={profileDesignation}
                  onChange={(e) => setProfileDesignation(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Phone Number</label>
                <input
                  type="text"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Years of Experience</label>
                <input
                  type="text"
                  value={profileExp}
                  onChange={(e) => setProfileExp(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-900"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="font-bold text-slate-700">Bio & Specialty Description</label>
                <textarea
                  rows={3}
                  value={profileBio}
                  onChange={(e) => setProfileBio(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-900"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                disabled={isSavingProfile}
                onClick={async () => {
                  try {
                    setIsSavingProfile(true);
                    await fetch("/api/providers/profile", {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        skills: [profileDesignation],
                        serviceArea: profileArea,
                      }),
                    });
                    setProfileSaveSuccess(true);
                    setTimeout(() => setProfileSaveSuccess(false), 3000);
                  } catch (e) {
                    console.error("Failed to save profile:", e);
                  } finally {
                    setIsSavingProfile(false);
                  }
                }}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs shadow-sm transition-all"
              >
                {isSavingProfile ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 10. DOCUMENTS TAB */}
      {activeTab === "documents" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-black text-slate-900">Verification Documents & Licenses</h2>
              <p className="text-xs text-slate-500">
                Official certificates, government ID, and crime branch background checks.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {documents.map((doc) => (
                <div key={doc.id} className="p-5 rounded-2xl border border-slate-200 bg-white space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {doc.status}
                    </span>
                    <span className="text-[11px] text-slate-400">{doc.verifiedDate}</span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm">{doc.title}</h3>
                  <p className="text-xs text-slate-500">{doc.issuedBy}</p>
                  <p className="text-[11px] font-mono text-slate-600">{doc.documentNumber}</p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <a
                      href={doc.previewUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>View File</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 11. SUPPORT TAB */}
      {activeTab === "support" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-black text-slate-900">Provider Help & Emergency Support</h2>
              <p className="text-xs text-slate-500">
                Direct coordinator hotline, customer dispute resolution, and emergency SOS assistance.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-teal-50 border border-teal-200 space-y-2">
                <Phone className="w-6 h-6 text-teal-700" />
                <h3 className="font-bold text-slate-900 text-sm">24/7 Pro Dispatch Desk</h3>
                <p className="text-xs text-slate-600">Immediate routing, delay alerts, and navigation assistance.</p>
                <a href="tel:18004192667" className="inline-block text-xs font-black text-teal-800 underline">
                  1800-419-COOP
                </a>
              </div>

              <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                <MessageSquare className="w-6 h-6 text-amber-700" />
                <h3 className="font-bold text-slate-900 text-sm">Payment & Parts Dispute</h3>
                <p className="text-xs text-slate-600">Resolve extra material approvals or cash payment mismatches.</p>
                <button
                  onClick={() => alert("Opening dispute ticket...")}
                  className="text-xs font-black text-amber-900 underline"
                >
                  Raise Ticket ↗
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 space-y-2">
                <AlertTriangle className="w-6 h-6 text-rose-700" />
                <h3 className="font-bold text-slate-900 text-sm">Emergency Field SOS</h3>
                <p className="text-xs text-slate-600">Customer safety issue, electrical hazard, or medical emergency.</p>
                <button
                  onClick={() => alert("SOS Alert dispatched to central security & emergency coordinator!")}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
                >
                  Trigger SOS
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mark Resolved Modal */}
      {resolveModalRequest && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Mark Request Resolved</h3>
                  <p className="text-xs text-slate-500">{resolveModalRequest.category} • #{resolveModalRequest.id.slice(-6)}</p>
                </div>
              </div>
              <button
                onClick={() => setResolveModalRequest(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Completion Notes & Resolution Summary <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={completionNotes}
                onChange={(e) => setCompletionNotes(e.target.value)}
                placeholder="Explain the work performed, replaced parts, testing done, or maintenance tips provided to customer..."
                rows={4}
                className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setResolveModalRequest(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                disabled={!completionNotes.trim() || requestActionLoadingId === resolveModalRequest.id}
                onClick={() =>
                  handleRequestUpdateProgress(resolveModalRequest.id, "RESOLVED", completionNotes)
                }
                className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 transition-all shadow-md shadow-emerald-500/20"
              >
                {requestActionLoadingId === resolveModalRequest.id ? "Saving..." : "Confirm Resolution"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Decline Modal */}
      {declineModalRequest && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Decline Assigned Request</h3>
              <button
                onClick={() => setDeclineModalRequest(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Declining will return this request to the coordinator queue so another verified specialist can be dispatched.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Reason for declining (Optional)
              </label>
              <textarea
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                placeholder="E.g., Out of range, overlapping emergency call, required tools unavailable..."
                rows={3}
                className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-500 outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setDeclineModalRequest(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  handleRequestRespond(declineModalRequest.id, "DECLINE", declineReason)
                }
                className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-all"
              >
                Confirm Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProviderDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ProviderDashboardContent />
    </Suspense>
  );
}
