export type PaymentMethodType =
  | "UPI"
  | "CREDIT_CARD"
  | "DEBIT_CARD"
  | "NET_BANKING"
  | "WALLETS"
  | "CASH_AFTER_SERVICE";

export type PaymentState =
  | "IDLE"
  | "PROCESSING"
  | "SUCCESSFUL"
  | "FAILED"
  | "PENDING";

export interface PaymentInitiationPayload {
  orderId: string;
  amount: number;
  method: PaymentMethodType;
  details?: {
    upiApp?: "GPAY" | "PHONEPE" | "PAYTM" | "BHIM" | "QR";
    upiId?: string;
    cardNumber?: string;
    cardExpiry?: string;
    cardCvv?: string;
    bankName?: string;
    walletName?: string;
  };
}

export interface PaymentReceipt {
  transactionId: string;
  orderId: string;
  amount: number;
  servicePrice: number;
  taxes: number;
  discount: number;
  materialsCost: number;
  total: number;
  method: PaymentMethodType;
  methodLabel: string;
  status: "Payment successful" | "Payment failed" | "Payment pending";
  timestamp: string;
  authCode: string;
  payerName: string;
}

export const PAYMENT_METHODS = [
  {
    id: "UPI" as PaymentMethodType,
    title: "UPI (Fastest & Zero Fees)",
    sub: "Google Pay, PhonePe, Paytm, BHIM, QR Code",
    badge: "Recommended",
    badgeColor: "bg-emerald-100 text-emerald-800",
  },
  {
    id: "CREDIT_CARD" as PaymentMethodType,
    title: "Credit Card",
    sub: "Visa, Mastercard, RuPay, Amex",
  },
  {
    id: "DEBIT_CARD" as PaymentMethodType,
    title: "Debit Card",
    sub: "All major Indian & international banks",
  },
  {
    id: "NET_BANKING" as PaymentMethodType,
    title: "Net Banking",
    sub: "HDFC, ICICI, SBI, Axis, Kotak, 50+ Banks",
  },
  {
    id: "WALLETS" as PaymentMethodType,
    title: "Wallets & Postpaid",
    sub: "Paytm Wallet, Amazon Pay, Mobikwik",
  },
  {
    id: "CASH_AFTER_SERVICE" as PaymentMethodType,
    title: "Cash After Service",
    sub: "Pay in cash or UPI scan directly to technician upon completion",
    badge: "Most Popular",
    badgeColor: "bg-brand-100 text-brand-800",
  },
];

export async function processRealisticPayment(
  payload: PaymentInitiationPayload,
  simulateFail: boolean = false
): Promise<{ success: boolean; state: PaymentState; receipt: PaymentReceipt }> {
  // Simulate realistic gateway latency (Stripe / Razorpay handshakes)
  await new Promise((resolve) => setTimeout(resolve, 1400));

  const txnId = "TXN-PAY-" + Math.floor(10000000 + Math.random() * 90000000);
  const authCode = "AUTH-" + Math.floor(100000 + Math.random() * 900000);

  if (simulateFail) {
    return {
      success: false,
      state: "FAILED",
      receipt: {
        transactionId: txnId,
        orderId: payload.orderId,
        amount: payload.amount,
        servicePrice: Math.round(payload.amount / 1.18),
        taxes: Math.round(payload.amount - payload.amount / 1.18),
        discount: 0,
        materialsCost: 0,
        total: payload.amount,
        method: payload.method,
        methodLabel: payload.method.replace(/_/g, " "),
        status: "Payment failed",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        authCode: "N/A",
        payerName: "Customer",
      },
    };
  }

  const isCash = payload.method === "CASH_AFTER_SERVICE";

  return {
    success: true,
    state: isCash ? "PENDING" : "SUCCESSFUL",
    receipt: {
      transactionId: txnId,
      orderId: payload.orderId,
      amount: payload.amount,
      servicePrice: Math.round(payload.amount / 1.18),
      taxes: Math.round(payload.amount - payload.amount / 1.18),
      discount: 0,
      materialsCost: 0,
      total: payload.amount,
      method: payload.method,
      methodLabel: payload.method.replace(/_/g, " "),
      status: isCash ? "Payment pending" : "Payment successful",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      authCode,
      payerName: "Customer",
    },
  };
}
