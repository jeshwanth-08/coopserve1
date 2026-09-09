// Worker Welfare & Social Security Service (SIH 2026)
// Handles 5% Cooperative Welfare Fund accumulation, e-Shram UAN verification, and micro-insurance claims

export interface WelfareAccount {
  workerId: string;
  workerName: string;
  trade: string;
  totalBalance: number;
  monthlyContributionRate: number; // 5%
  totalContributionsToDate: number;
  emergencyGrantsDisbursed: number;
  eShramStatus: "UNVERIFIED" | "VERIFIED" | "PENDING";
  eShramUan: string;
  eShramCardHolderName: string;
  eShramOccupation: string;
  verifiedAt?: string;
  activePolicy: InsurancePolicy;
}

export interface InsurancePolicy {
  policyNumber: string;
  schemeName: string;
  sumInsuredAccidental: number;
  sumInsuredDisability: number;
  toolDamageCoverage: number;
  validUntil: string;
  status: "ACTIVE" | "EXPIRED";
  cashlessHospitalCount: number;
}

export interface InsuranceClaim {
  id: string;
  providerId: string;
  providerName: string;
  trade: string;
  incidentType: "ON_DUTY_INJURY" | "TOOL_THEFT_DAMAGE" | "EMERGENCY_MEDICAL";
  incidentDate: string;
  description: string;
  amountClaimed: number;
  amountApproved?: number;
  photoEvidence?: string;
  hospitalBillUrl?: string;
  status: "SUBMITTED" | "UNDER_REVIEW" | "APPROVED" | "DISBURSED" | "REJECTED";
  remarks?: string;
  submittedAt: string;
  transactionRef?: string;
}

const STORAGE_KEY_WELFARE = "coopserve_welfare_account";
const STORAGE_KEY_CLAIMS = "coopserve_insurance_claims";

const DEFAULT_POLICY: InsurancePolicy = {
  policyNumber: "PMSBY-COOP-2026-88910",
  schemeName: "PM Suraksha Bima Yojana + CoopServe Group Transit & Trade Cover",
  sumInsuredAccidental: 500000,
  sumInsuredDisability: 300000,
  toolDamageCoverage: 50000,
  validUntil: "31 March 2027",
  status: "ACTIVE",
  cashlessHospitalCount: 1420,
};

const DEFAULT_ACCOUNT: WelfareAccount = {
  workerId: "pro-1",
  workerName: "Marcus Thorne",
  trade: "Master Electrician",
  totalBalance: 14250,
  monthlyContributionRate: 5,
  totalContributionsToDate: 21850,
  emergencyGrantsDisbursed: 5000,
  eShramStatus: "VERIFIED",
  eShramUan: "1294-8849-2041",
  eShramCardHolderName: "Marcus Thorne",
  eShramOccupation: "Electrician / Domestic Wireman (NCO-2015: 7411.01)",
  verifiedAt: "15 Jan 2026",
  activePolicy: DEFAULT_POLICY,
};

const INITIAL_CLAIMS: InsuranceClaim[] = [
  {
    id: "CLM-88219",
    providerId: "pro-1",
    providerName: "Marcus Thorne",
    trade: "Master Electrician",
    incidentType: "TOOL_THEFT_DAMAGE",
    incidentDate: "28 Aug 2026",
    description: "Multimeter and Bosch Rotary Hammer drill damaged due to water tank overflow during ceiling wiring work.",
    amountClaimed: 4500,
    amountApproved: 4500,
    status: "DISBURSED",
    remarks: "Approved by Indiranagar Cooperative Node Committee. Reimbursed via UPI.",
    submittedAt: "28 Aug 2026",
    transactionRef: "UPI-CLAIM-992102",
  },
  {
    id: "CLM-91042",
    providerId: "pro-2",
    providerName: "Rajesh Kumar",
    trade: "Senior Plumber",
    incidentType: "ON_DUTY_INJURY",
    incidentDate: "04 Sep 2026",
    description: "Deep cut on palm while repairing pressurized copper pipe fitting. Required 4 stitches at Manipal Clinic.",
    amountClaimed: 3200,
    amountApproved: 3200,
    status: "APPROVED",
    remarks: "Medical bills verified. Ready for federation batch payout.",
    submittedAt: "04 Sep 2026",
    transactionRef: "PENDING-DISBURSEMENT",
  },
];

export function getWelfareAccount(): WelfareAccount {
  if (typeof window === "undefined") return DEFAULT_ACCOUNT;
  try {
    const data = localStorage.getItem(STORAGE_KEY_WELFARE);
    if (data) return JSON.parse(data);
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
  const cleanUan = uan.replace(/[^0-9]/g, "");
  
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
  if (typeof window === "undefined") return INITIAL_CLAIMS;
  try {
    const data = localStorage.getItem(STORAGE_KEY_CLAIMS);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error("Failed to parse claims:", e);
  }
  return INITIAL_CLAIMS;
}

export function saveInsuranceClaims(claims: InsuranceClaim[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_CLAIMS, JSON.stringify(claims));
  } catch (e) {
    console.error("Failed to save claims:", e);
  }
}

export function submitInsuranceClaim(claim: Omit<InsuranceClaim, "id" | "status" | "submittedAt">): InsuranceClaim {
  const allClaims = getAllInsuranceClaims();
  const newClaim: InsuranceClaim = {
    ...claim,
    id: "CLM-" + Math.floor(10000 + Math.random() * 90000),
    status: "SUBMITTED",
    submittedAt: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
  };
  const updated = [newClaim, ...allClaims];
  saveInsuranceClaims(updated);
  return newClaim;
}

export function updateClaimStatus(
  claimId: string,
  status: InsuranceClaim["status"],
  amountApproved?: number,
  remarks?: string
): InsuranceClaim[] {
  const allClaims = getAllInsuranceClaims();
  const updated = allClaims.map((c) => {
    if (c.id === claimId) {
      return {
        ...c,
        status,
        amountApproved: amountApproved !== undefined ? amountApproved : c.amountApproved,
        remarks: remarks || c.remarks,
        transactionRef: status === "DISBURSED" ? "UPI-TXN-" + Math.floor(100000 + Math.random() * 900000) : c.transactionRef,
      };
    }
    return c;
  });
  saveInsuranceClaims(updated);
  return updated;
}
