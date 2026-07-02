export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  role: "user" | "doctor" | "admin";
  membershipPlan: "basic" | "gold" | "platinum" | "femmeelite";
  journeyStage: string;
  nextAction: string | null;
  phone: string | null;
  city: string | null;
  area: string | null;
  avatarUrl: string | null;
  createdAt: string;
}

export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  city: string;
  area: string;
  languages: string[];
  consultationModes: string[];
  rating: number;
  experienceYears: number;
  avatarUrl: string | null;
  bio: string | null;
  availableSlots: number;
}

export interface Appointment {
  id: number;
  userId: number;
  userName: string;
  doctorId: number;
  doctorName: string;
  status: "pending" | "approved" | "rejected" | "rescheduled" | "completed";
  city: string;
  area: string;
  language: string;
  mode: "in-person" | "video" | "phone";
  preferredDate: string;
  confirmedDate: string | null;
  notes: string | null;
  doctorNotes: string | null;
  createdAt: string;
}

export interface Report {
  id: number;
  userId: number;
  userName: string;
  type: "amh" | "fertility" | "metropolis" | "external" | "doctor_recommendation";
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
  doctorNotes: string | null;
  recommendations: string | null;
  isLabBooked: boolean;
  labName: string | null;
  labDate: string | null;
}

export interface CommunityPost {
  id: number;
  title: string;
  content: string;
  category: string;
  isAnonymous: boolean;
  authorName: string;
  upvotes: number;
  commentCount: number;
  createdAt: string;
}

export interface Comment {
  id: number;
  postId: number;
  content: string;
  authorName: string;
  isAnonymous: boolean;
  createdAt: string;
}

export interface MessageThread {
  id: number;
  userId: number;
  counterpartId: number;
  counterpartName: string;
  counterpartRole: string;
  lastMessage: string | null;
  lastMessageAt: string | null;
  unreadCount: number;
}

export interface Message {
  id: number;
  threadId: number;
  senderId: number;
  senderName: string;
  content: string;
  sentAt: string;
  isOwn: boolean;
}

export interface Webinar {
  id: number;
  title: string;
  description: string;
  type: "webinar" | "seminar";
  speaker: string;
  date: string;
  duration: number;
  price: number;
  registeredCount: number;
  maxCapacity: number;
  isRegistered: boolean;
  imageUrl: string | null;
  meetingUrl: string | null;
  location: string | null;
  createdAt: string;
}

export interface SipPlan {
  id: number;
  userId: number;
  monthlyContribution: number;
  goalAmount: number;
  currentSaved: number;
  progressPercent: number;
  estimatedCompletionDate: string;
  startDate: string;
  bankName: string | null;
}

export interface LoanOffer {
  id: number;
  bankName: string;
  interestRate: number;
  minEmi: number;
  maxTenureMonths: number;
  maxAmount: number;
  eligibilityCriteria: string;
  processingFee: number;
  logoUrl: string | null;
}

export interface SupportTicket {
  id: number;
  userId: number;
  userName: string;
  subject: string;
  message: string;
  status: "open" | "in_progress" | "resolved";
  createdAt: string;
}

export interface Notification {
  id: number;
  userId: number;
  message: string;
  type: "info" | "success" | "warning" | "action";
  isRead: boolean;
  createdAt: string;
}

export interface PatientSummary {
  id: number;
  name: string;
  email: string;
  membershipPlan: string;
  journeyStage: string;
  lastAppointmentDate: string | null;
  reportsCount: number;
  avatarUrl: string | null;
}
