export const MOCK_OTP = "123456";
export const OTP_RESEND_SECONDS = 30;
export const KYC_REVIEW_HOURS = "24 a 48 horas";

export const ONBOARDING_STORAGE_KEY = "walpay.onboarding";

export type KycStatus = "draft" | "submitted" | "in_review" | "approved" | "rejected";

export interface OnboardingState {
  email: string;
  password: string;
  emailVerified: boolean;
  firstName: string;
  lastName: string;
  birthDate: string;
  nationality: string;
  gender: string;
  phone: string;
  phoneVerified: boolean;
  documentNumber: string;
  documentIssueDate: string;
  documentFrontCaptured: boolean;
  documentBackCaptured: boolean;
  selfieCaptured: boolean;
  termsAccepted: boolean;
  kycStatus: KycStatus;
}

export const initialOnboardingState: OnboardingState = {
  email: "",
  password: "",
  emailVerified: false,
  firstName: "",
  lastName: "",
  birthDate: "",
  nationality: "Paraguay",
  gender: "",
  phone: "",
  phoneVerified: false,
  documentNumber: "",
  documentIssueDate: "",
  documentFrontCaptured: false,
  documentBackCaptured: false,
  selfieCaptured: false,
  termsAccepted: false,
  kycStatus: "draft",
};

export const ONBOARDING_STEPS = [
  { path: "/app/signup", label: "Cuenta" },
  { path: "/app/onboarding/verify-email", label: "Email" },
  { path: "/app/onboarding/personal", label: "Datos" },
  { path: "/app/onboarding/phone", label: "Teléfono" },
  { path: "/app/onboarding/document", label: "Documento" },
  { path: "/app/onboarding/selfie", label: "Selfie" },
  { path: "/app/onboarding/review", label: "Revisión" },
];
