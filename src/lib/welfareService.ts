// Worker Welfare, Social Security & Insurance Engine (SIH 2026)
// Provides 360-degree worker protection: Welfare Fund (2%), PF Tracking, 4 Insurance Policies,
// Health Records, Child Scholarships, Leaves, Pension, and SIH AI Risk Guardian.

export interface InsurancePolicyItem {
  id: string;
  type: "PERSONAL_ACCIDENT" | "LIFE_INSURANCE" | "HEALTH_INSURANCE" | "THIRD_PARTY_LIABILITY";
  title: string;
  policyNumber: string;
  coverageAmount: number;
  validUntil: string;
  status: "ACTIVE" | "EXPIRED";
  description: string;
  cashlessHospitals?: number;
  nominee?: string;
  iconName: string;
  colorTheme: string;
}

export interface InsuranceClaim {
  id: string;
  providerId: string;
  providerName: string;
  trade: string;
  insuranceType: "PERSONAL_ACCIDENT" | "LIFE_INSURANCE" | "HEALTH_INSURANCE" | "THIRD_PARTY_LIABILITY";
  incidentDate: string;
  description: string;
  amountClaimed: number;
  amountApproved?: number;
  status: "SUBMITTED" | "UNDER_REVIEW" | "APPROVED" | "DISBURSED" | "REJECTED";
  remarks?: string;
  submittedAt: string;
  photoEvidence?: string;
  transactionRef?: string;
  customerAffected?: string;
}

export interface WelfareAssistanceRequest {
  id: string;
  workerId: string;
  workerName: string;
  category: "MEDICAL_EMERGENCY" | "CHILD_SCHOLARSHIP" | "TOOL_EQUIPMENT_REPAIR" | "CRITICAL_LIVELIHOOD";
  amountRequested: number;
  amountApproved?: number;
  reason: string;
  beneficiaryDetails: string;
  status: "PENDING" | "APPROVED" | "DISBURSED" | "REJECTED";
  submittedAt: string;
  adminNotes?: string;
  payoutRef?: string;
}

export interface SkillTrainingProgram {
  id: string;
  title: string;
  category: string;
  duration: string;
  certification: string;
  wageBoost: string;
  enrolledStatus: "AVAILABLE" | "ENROLLED" | "COMPLETED";
  completionDate?: string;
  certificateNumber?: string;
  rating: number;
  isAiRecommended?: boolean;
}

export interface HealthCheckupRecord {
  id: string;
  campDate: string;
  location: string;
  doctorName: string;
  bloodPressure: string;
  bloodGlucose: string;
  vision: string;
  fitnessStatus: "FIT_FOR_DUTY" | "CONDITIONAL" | "ACTION_REQUIRED";
  recommendations: string;
}

export interface WorkerLeaveRecord {
  id: string;
  type: "SICK_LEAVE" | "CASUAL_LEAVE" | "FESTIVAL_LEAVE";
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: "APPROVED" | "PENDING";
  peerReplacement: string;
}

export interface AiWorkerRiskAlert {
  id: string;
  type: "LOW_INCOME" | "FREQUENT_INJURY" | "SKILL_SHORTAGE";
  severity: "INFO" | "WARNING" | "CRITICAL";
  title: string;
  description: string;
  aiRecommendation: string;
  actionLabel: string;
  actionType: "APPLY_STIPEND" | "START_SAFETY_TRAINING" | "ENROLL_SKILL";
}

export interface WelfareAccount {
  workerId: string;
  workerName: string;
  trade: string;
  monthlyEarnings: number;
  totalAnnualEarnings: number;
  welfareFundContributionRate: number; // 2%
  welfareFundBalance: number;
  totalContributionsToDate: number;
  emergencyGrantsDisbursed: number;
  pfContributionMonthly: number; // 12% matching
  pfAccumulatedCorpus: number;
  uanPfNumber: string;
  eShramStatus: "UNVERIFIED" | "VERIFIED" | "PENDING";
  eShramUan: string;
  eShramCardHolderName: string;
  eShramOccupation: string;
  verifiedAt?: string;
  pensionStatus: {
    scheme: string;
    monthlyContribution: number;
    guaranteedMonthlyPension: number;
    vestedYears: number;
    totalYearsRequired: number;
  };
  leaveBalance: {
    totalAnnual: number;
    used: number;
    remaining: number;
  };
  policies: InsurancePolicyItem[];
  claims: InsuranceClaim[];
  assistanceRequests: WelfareAssistanceRequest[];
  trainings: SkillTrainingProgram[];
  healthRecords: HealthCheckupRecord[];
  leaves: WorkerLeaveRecord[];
  aiRiskAlerts: AiWorkerRiskAlert[];
}

const STORAGE_KEY_WELFARE = "coopserve_welfare_account_v2";
const STORAGE_KEY_CLAIMS = "coopserve_insurance_claims_v2";
const STORAGE_KEY_REQUESTS = "coopserve_welfare_requests_v2";

export const DEFAULT_INSURANCE_POLICIES: InsurancePolicyItem[] = [
  {
    id: "POL-ACC-01",
    type: "PERSONAL_ACCIDENT",
    title: "Personal Accident & On-Duty Injury Insurance",
    policyNumber: "PMSBY-COOP-2026-PA-88910",
    coverageAmount: 500000,
    validUntil: "31 March 2027",
    status: "ACTIVE",
    description: "Covers bodily injuries, slips, falls from ladders, and tool burns sustained while servicing client sites. Hospitalization expenses 100% reimbursed.",
    iconName: "ShieldAlert",
    colorTheme: "rose",
  },
  {
    id: "POL-LIFE-02",
    type: "LIFE_INSURANCE",
    title: "Group Term Life Insurance",
    policyNumber: "PMJJBY-COOP-2026-LI-77402",
    coverageAmount: 1000000,
    validUntil: "31 March 2027",
    status: "ACTIVE",
    description: "Nominee receives immediate ₹10,00,000 direct payout in the unfortunate event of death, ensuring long-term family financial resilience.",
    nominee: "Anita Thorne (Spouse) - 98765-43210",
    iconName: "HeartHandshake",
    colorTheme: "purple",
  },
  {
    id: "POL-HLTH-03",
    type: "HEALTH_INSURANCE",
    title: "Cashless Hospitalization Health Cover",
    policyNumber: "AYUSHMAN-COOP-2026-HI-33109",
    coverageAmount: 300000,
    validUntil: "31 March 2027",
    status: "ACTIVE",
    description: "Family floater inpatient surgery & hospitalization across 1,420+ cashless cooperative partner hospitals with ₹0 out-of-pocket expenses.",
    cashlessHospitals: 1420,
    iconName: "Activity",
    colorTheme: "emerald",
  },
  {
    id: "POL-TPL-04",
    type: "THIRD_PARTY_LIABILITY",
    title: "Customer Property & Third-Party Liability",
    policyNumber: "COOP-TPL-2026-PROP-11024",
    coverageAmount: 100000,
    validUntil: "31 March 2027",
    status: "ACTIVE",
    description: "Compensates customer directly if accidental property damage occurs (e.g. broken pipe or damaged appliance). Worker's personal wage is never docked.",
    iconName: "Building2",
    colorTheme: "amber",
  },
];

export const INITIAL_CLAIMS: InsuranceClaim[] = [
  {
    id: "CLM-88219",
    providerId: "pro-1",
    providerName: "Marcus Thorne",
    trade: "Master Electrician",
    insuranceType: "PERSONAL_ACCIDENT",
    incidentDate: "28 Aug 2026",
    description: "Electrician slipped from step-ladder while installing ceiling chandelier. Sustained wrist sprain requiring emergency X-ray and wrist brace at Apollo Clinic.",
    amountClaimed: 4500,
    amountApproved: 4500,
    status: "DISBURSED",
    remarks: "Verified by Cooperative Medical Board. ₹4,500 transferred via instant DBT UPI.",
    submittedAt: "28 Aug 2026",
    transactionRef: "UPI-DBT-992102",
  },
  {
    id: "CLM-91042",
    providerId: "pro-2",
    providerName: "Rajesh Kumar",
    trade: "Senior Plumber",
    insuranceType: "THIRD_PARTY_LIABILITY",
    incidentDate: "04 Sep 2026",
    description: "High-pressure valve slipped during bathroom angle-cock replacement, cracking adjacent imported porcelain wall tiles.",
    amountClaimed: 6500,
    amountApproved: 6500,
    status: "APPROVED",
    remarks: "Resident compensated directly by Cooperative Third-Party Pool. Worker daily fee fully preserved.",
    submittedAt: "04 Sep 2026",
    customerAffected: "Flat 402, Prestige Ozone (Indiranagar)",
    transactionRef: "PENDING-FEDERATION-PAYOUT",
  },
  {
    id: "CLM-94301",
    providerId: "pro-1",
    providerName: "Marcus Thorne",
    trade: "Master Electrician",
    insuranceType: "HEALTH_INSURANCE",
    incidentDate: "06 Sep 2026",
    description: "Daughter admitted for seasonal dengue care with platelet monitoring at Manipal Hospital.",
    amountClaimed: 18500,
    amountApproved: 18500,
    status: "DISBURSED",
    remarks: "Cashless authorization pre-approved. Hospital settlement completed directly.",
    submittedAt: "06 Sep 2026",
    transactionRef: "CASHLESS-AUTH-88129",
  },
];

export const INITIAL_ASSISTANCE_REQUESTS: WelfareAssistanceRequest[] = [
  {
    id: "WEL-REQ-101",
    workerId: "pro-1",
    workerName: "Marcus Thorne",
    category: "CHILD_SCHOLARSHIP",
    amountRequested: 10000,
    amountApproved: 10000,
    reason: "Cooperative Vidya Nidhi Grant: Higher secondary textbooks and STEM lab supplies for daughter Aarav Thorne (Class 10).",
    beneficiaryDetails: "Daughter Aarav Thorne (St. Mary's Convent)",
    status: "DISBURSED",
    submittedAt: "18 Aug 2026",
    adminNotes: "Merit scholarship approved based on 89% academic scorecard.",
    payoutRef: "SCHOLARSHIP-TXN-2026-11",
  },
  {
    id: "WEL-REQ-102",
    workerId: "pro-1",
    workerName: "Marcus Thorne",
    category: "TOOL_EQUIPMENT_REPAIR",
    amountRequested: 3500,
    amountApproved: 3500,
    reason: "Emergency armature rewinding for heavy-duty rotary drill damaged during concrete wall drilling.",
    beneficiaryDetails: "Bosch GBH 2-26 Hammer Drill Repair",
    status: "APPROVED",
    submittedAt: "02 Sep 2026",
    adminNotes: "Sanctioned under Tool Insurance & Welfare Upkeep fund.",
    payoutRef: "PENDING-COMMITTEE-DISBURSEMENT",
  },
];

export const INITIAL_TRAININGS: SkillTrainingProgram[] = [
  {
    id: "TRN-01",
    title: "High-Rise Fall Protection & OSHA Ladder Safety",
    category: "Occupational Safety",
    duration: "4 Hours (Self-Paced)",
    certification: "OSHA & NSDC Safety Badging",
    wageBoost: "Mandatory Safety Clearance",
    enrolledStatus: "COMPLETED",
    completionDate: "12 July 2026",
    certificateNumber: "CERT-OSHA-2026-981",
    rating: 4.9,
    isAiRecommended: true,
  },
  {
    id: "TRN-02",
    title: "EV Home Charger Level 2 Infrastructure & Earthing",
    category: "Green Mobility & Clean Tech",
    duration: "16 Hours (Hybrid Lab)",
    certification: "Skill India Certified EV Specialist",
    wageBoost: "+₹650 per installation",
    enrolledStatus: "ENROLLED",
    rating: 4.95,
    isAiRecommended: true,
  },
  {
    id: "TRN-03",
    title: "Advanced Inverter Multi-Split Jet Servicing",
    category: "HVAC & Cooling Systems",
    duration: "12 Hours (Masterclass)",
    certification: "CoopServe Master Technician L4",
    wageBoost: "+₹400 per job",
    enrolledStatus: "AVAILABLE",
    rating: 4.88,
    isAiRecommended: false,
  },
  {
    id: "TRN-04",
    title: "Smart Home Automation & Zigbee Relay Retrofitting",
    category: "IoT & Modern Electrical",
    duration: "8 Hours (Online + Kit)",
    certification: "IoT Home Wiring Specialist",
    wageBoost: "+₹500 per installation",
    enrolledStatus: "AVAILABLE",
    rating: 4.92,
    isAiRecommended: false,
  },
];

export const INITIAL_HEALTH_RECORDS: HealthCheckupRecord[] = [
  {
    id: "HLT-2026-01",
    campDate: "15 Aug 2026",
    location: "Indiranagar Co-op Primary Care Center",
    doctorName: "Dr. Arvind Rao, MD (Occupational Medicine)",
    bloodPressure: "118/78 mmHg (Optimal)",
    bloodGlucose: "94 mg/dL (Fasting Normal)",
    vision: "6/6 (With protective anti-glare specs)",
    fitnessStatus: "FIT_FOR_DUTY",
    recommendations: "Cardiovascular endurance excellent. Recommended lumbar support belt for heavy geyser lifting.",
  },
  {
    id: "HLT-2025-02",
    campDate: "10 Feb 2026",
    location: "Whitefield Federation Medical Camp",
    doctorName: "Dr. Meera Nambiar, MBBS",
    bloodPressure: "122/82 mmHg",
    bloodGlucose: "102 mg/dL",
    vision: "6/6",
    fitnessStatus: "FIT_FOR_DUTY",
    recommendations: "Maintain hydration while conducting outdoor switchboard diagnostics in summer.",
  },
];

export const INITIAL_LEAVES: WorkerLeaveRecord[] = [
  {
    id: "LEV-01",
    type: "FESTIVAL_LEAVE",
    startDate: "28 Oct 2026",
    endDate: "30 Oct 2026",
    days: 3,
    reason: "Diwali Family Celebrations & Puja",
    status: "APPROVED",
    peerReplacement: "Suresh Patil (Electrician Node B)",
  },
  {
    id: "LEV-02",
    type: "SICK_LEAVE",
    startDate: "12 May 2026",
    endDate: "13 May 2026",
    days: 2,
    reason: "Viral fever recovery with rest",
    status: "APPROVED",
    peerReplacement: "Auto-Assigned Peer Specialist",
  },
];

export const INITIAL_AI_ALERTS: AiWorkerRiskAlert[] = [
  {
    id: "AI-ALERT-01",
    type: "LOW_INCOME",
    severity: "WARNING",
    title: "Income Dip Detected: -14% vs 3-Month Trailing Average",
    description: "August monthly earnings closed at ₹18,600 (below ₹20,000 baseline) due to seasonal monsoon lull in external wiring.",
    aiRecommendation: "AI Auto-Dispatcher has promoted your priority score in Society Gated Pools. Plus, a ₹5,000 interest-free emergency grant is pre-approved from the Cooperative Welfare Fund.",
    actionLabel: "Claim ₹5,000 Welfare Advance",
    actionType: "APPLY_STIPEND",
  },
  {
    id: "AI-ALERT-02",
    type: "FREQUENT_INJURY",
    severity: "INFO",
    title: "Safety Advisory: Ladder Fall Incident Logged on 28 Aug",
    description: "Wrist sprain occurred during step-ladder maneuver. All medical bills were 100% disbursed via Personal Accident Cover.",
    aiRecommendation: "Cooperative safety policy requires mandatory completion of the 20-minute 'OSHA Ladder Safety & Fall Protection' drill to maintain ₹0 insurance deductible.",
    actionLabel: "Launch Safety Module",
    actionType: "START_SAFETY_TRAINING",
  },
  {
    id: "AI-ALERT-03",
    type: "SKILL_SHORTAGE",
    severity: "INFO",
    title: "Local Skill Shortage: EV Charger Installation Surge (+340%)",
    description: "Indiranagar and Whitefield are experiencing severe shortage of certified EV charger domestic wiremen.",
    aiRecommendation: "Enrolling in the 16-Hour Skill India EV Certification will qualify you for ₹1,800/job high-voltage charger installations, projecting monthly earnings up to ₹34,500/month.",
    actionLabel: "Enroll in EV Course",
    actionType: "ENROLL_SKILL",
  },
];

export const DEFAULT_ACCOUNT: WelfareAccount = {
  workerId: "pro-1",
  workerName: "Marcus Thorne",
  trade: "Master Electrician",
  monthlyEarnings: 22400,
  totalAnnualEarnings: 218500,
  welfareFundContributionRate: 2, // 2% as requested
  welfareFundBalance: 18450,
  totalContributionsToDate: 26850,
  emergencyGrantsDisbursed: 13500,
  pfContributionMonthly: 2400, // 12% matching
  pfAccumulatedCorpus: 48600,
  uanPfNumber: "EPFO-1019-2837-4650",
  eShramStatus: "VERIFIED",
  eShramUan: "1294-8849-2041",
  eShramCardHolderName: "Marcus Thorne",
  eShramOccupation: "Domestic Wireman & Electrical Specialist (NCO-2015: 7411.01)",
  verifiedAt: "15 Jan 2026",
  pensionStatus: {
    scheme: "PM-SYM (Pradhan Mantri Shram Yogi Maan-dhan) + Cooperative Old-Age Trust",
    monthlyContribution: 110,
    guaranteedMonthlyPension: 3000,
    vestedYears: 3,
    totalYearsRequired: 10,
  },
  leaveBalance: {
    totalAnnual: 18,
    used: 5,
    remaining: 13,
  },
  policies: DEFAULT_INSURANCE_POLICIES,
  claims: INITIAL_CLAIMS,
  assistanceRequests: INITIAL_ASSISTANCE_REQUESTS,
  trainings: INITIAL_TRAININGS,
  healthRecords: INITIAL_HEALTH_RECORDS,
  leaves: INITIAL_LEAVES,
  aiRiskAlerts: INITIAL_AI_ALERTS,
};

export function getWelfareAccount(): WelfareAccount {
  if (typeof window === "undefined") return DEFAULT_ACCOUNT;
  try {
    const data = localStorage.getItem(STORAGE_KEY_WELFARE);
    if (data) {
      const parsed = JSON.parse(data);
      return {
        ...DEFAULT_ACCOUNT,
        ...parsed,
        policies: parsed.policies || DEFAULT_INSURANCE_POLICIES,
        claims: parsed.claims || INITIAL_CLAIMS,
        assistanceRequests: parsed.assistanceRequests || INITIAL_ASSISTANCE_REQUESTS,
        trainings: parsed.trainings || INITIAL_TRAININGS,
        healthRecords: parsed.healthRecords || INITIAL_HEALTH_RECORDS,
        leaves: parsed.leaves || INITIAL_LEAVES,
        aiRiskAlerts: parsed.aiRiskAlerts || INITIAL_AI_ALERTS,
      };
    }
  } catch (e) {
    console.error("Failed to parse welfare account:", e);
  }
  return DEFAULT_ACCOUNT;
}

export function saveWelfareAccount(account: WelfareAccount): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_WELFARE, JSON.stringify(account));
  } catch (e) {
    console.error("Failed to save welfare account:", e);
  }
}

export function verifyEShramUan(uan: string, holderName: string): WelfareAccount {
  const current = getWelfareAccount();
  const updated: WelfareAccount = {
    ...current,
    eShramStatus: "VERIFIED",
    eShramUan: uan,
    eShramCardHolderName: holderName || current.workerName,
    eShramOccupation: `${current.trade} (Ministry Registry Code: 7411)`,
    verifiedAt: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
  };
  saveWelfareAccount(updated);
  return updated;
}

export function getAllInsuranceClaims(): InsuranceClaim[] {
  const acc = getWelfareAccount();
  return acc.claims || INITIAL_CLAIMS;
}

export function saveInsuranceClaims(claims: InsuranceClaim[]): void {
  const acc = getWelfareAccount();
  acc.claims = claims;
  saveWelfareAccount(acc);
}

export function submitInsuranceClaim(claim: Omit<InsuranceClaim, "id" | "status" | "submittedAt">): InsuranceClaim {
  const acc = getWelfareAccount();
  const newClaim: InsuranceClaim = {
    ...claim,
    id: "CLM-" + Math.floor(10000 + Math.random() * 90000),
    status: "SUBMITTED",
    submittedAt: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
  };
  acc.claims = [newClaim, ...acc.claims];
  saveWelfareAccount(acc);
  return newClaim;
}

export function updateClaimStatus(
  claimId: string,
  status: InsuranceClaim["status"],
  amountApproved?: number,
  remarks?: string
): InsuranceClaim[] {
  const acc = getWelfareAccount();
  acc.claims = acc.claims.map((c) => {
    if (c.id === claimId) {
      return {
        ...c,
        status,
        amountApproved: amountApproved !== undefined ? amountApproved : (c.amountApproved || c.amountClaimed),
        remarks: remarks || c.remarks,
        transactionRef: status === "DISBURSED" ? "UPI-DBT-" + Math.floor(100000 + Math.random() * 900000) : c.transactionRef,
      };
    }
    return c;
  });
  saveWelfareAccount(acc);
  return acc.claims;
}

export function getAllAssistanceRequests(): WelfareAssistanceRequest[] {
  const acc = getWelfareAccount();
  return acc.assistanceRequests || INITIAL_ASSISTANCE_REQUESTS;
}

export function submitAssistanceRequest(req: Omit<WelfareAssistanceRequest, "id" | "status" | "submittedAt">): WelfareAssistanceRequest {
  const acc = getWelfareAccount();
  const newReq: WelfareAssistanceRequest = {
    ...req,
    id: "WEL-REQ-" + Math.floor(100 + Math.random() * 900),
    status: "PENDING",
    submittedAt: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
  };
  acc.assistanceRequests = [newReq, ...acc.assistanceRequests];
  saveWelfareAccount(acc);
  return newReq;
}

export function updateAssistanceStatus(
  requestId: string,
  status: WelfareAssistanceRequest["status"],
  amountApproved?: number,
  adminNotes?: string
): WelfareAssistanceRequest[] {
  const acc = getWelfareAccount();
  acc.assistanceRequests = acc.assistanceRequests.map((r) => {
    if (r.id === requestId) {
      return {
        ...r,
        status,
        amountApproved: amountApproved !== undefined ? amountApproved : (r.amountApproved || r.amountRequested),
        adminNotes: adminNotes || r.adminNotes,
        payoutRef: status === "DISBURSED" ? "COOP-WELFARE-PAY-" + Math.floor(10000 + Math.random() * 90000) : r.payoutRef,
      };
    }
    return r;
  });
  saveWelfareAccount(acc);
  return acc.assistanceRequests;
}

export function enrollOrCompleteTraining(trainingId: string): SkillTrainingProgram[] {
  const acc = getWelfareAccount();
  acc.trainings = acc.trainings.map((t) => {
    if (t.id === trainingId) {
      const nextStatus = t.enrolledStatus === "AVAILABLE" ? "ENROLLED" : "COMPLETED";
      return {
        ...t,
        enrolledStatus: nextStatus,
        completionDate: nextStatus === "COMPLETED" ? new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : t.completionDate,
        certificateNumber: nextStatus === "COMPLETED" ? "CERT-COOP-2026-" + Math.floor(1000 + Math.random() * 9000) : t.certificateNumber,
      };
    }
    return t;
  });
  saveWelfareAccount(acc);
  return acc.trainings;
}

export function submitLeaveRequest(leave: Omit<WorkerLeaveRecord, "id" | "status" | "peerReplacement">): WorkerLeaveRecord {
  const acc = getWelfareAccount();
  const newLeave: WorkerLeaveRecord = {
    ...leave,
    id: "LEV-" + Math.floor(10 + Math.random() * 90),
    status: "APPROVED",
    peerReplacement: "Suresh Patil (Electrician Node B)",
  };
  acc.leaves = [newLeave, ...acc.leaves];
  acc.leaveBalance.used += leave.days;
  acc.leaveBalance.remaining = Math.max(0, acc.leaveBalance.totalAnnual - acc.leaveBalance.used);
  saveWelfareAccount(acc);
  return newLeave;
}
