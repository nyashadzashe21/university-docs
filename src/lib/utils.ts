import { v4 as uuidv4 } from "uuid";

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  studentId: string;
  dateOfBirth: string;
  photo: string;
  department: string;
  year: string;
  email: string;
}

export interface Course {
  code: string;
  name: string;
  instructor: string;
  schedule: string;
  room: string;
  credits: number;
}

export interface Schedule {
  term: string;
  academicYear: string;
  courses: Course[];
}

export interface TuitionPayment {
  receiptNumber: string;
  term: string;
  academicYear: string;
  amountPaid: number;
  paymentDate: string;
  paymentMethod: string;
  balance: number;
  totalDue: number;
}

export interface GeneratedDocument {
  id: string;
  type: "id-card" | "schedule" | "receipt";
  studentId: string;
  studentName: string;
  generatedAt: string;
  generatedBy: string;
  expirationDate: string;
}

export interface UniversityInfo {
  name: string;
  shortName: string;
  motto: string;
  established: string;
  address: string;
  phone: string;
  website: string;
  logo: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export const DEFAULT_UNIVERSITY: UniversityInfo = {
  name: "",
  shortName: "",
  motto: "",
  established: "",
  address: "",
  phone: "",
  website: "",
  logo: "",
  colors: {
    primary: "#1a1a6e",
    secondary: "#c5a55a",
    accent: "#f5ecd7",
  },
};

export function generateStudentId(): string {
  const year = new Date().getFullYear().toString().slice(-2);
  const random = Math.floor(Math.random() * 100000).toString().padStart(5, "0");
  return `PRU${year}${random}`;
}

export function generateReceiptNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 1000000).toString().padStart(6, "0");
  return `T-${year}-${random}`;
}

export function generateDocId(): string {
  return uuidv4();
}

export function getIssueDate(): string {
  return new Date().toISOString().split("T")[0];
}

export function getExpirationDate(issueDate: string): string {
  const date = new Date(issueDate);
  date.setFullYear(date.getFullYear() + 1);
  return date.toISOString().split("T")[0];
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function generateScheduleData(courses: Course[], term: string, year: string): Schedule {
  return {
    term,
    academicYear: year,
    courses,
  };
}

export function generateTuitionPayment(
  term: string,
  year: string,
  amount: number
): TuitionPayment {
  const today = new Date().toISOString().split("T")[0];
  return {
    receiptNumber: generateReceiptNumber(),
    term,
    academicYear: year,
    amountPaid: amount,
    paymentDate: today,
    paymentMethod: "Credit Card",
    balance: 0,
    totalDue: amount,
  };
}
