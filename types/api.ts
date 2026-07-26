/**
 * Types here mirror the actual Mongoose models read from the backend source
 * (src/modules/*.model.js), not assumptions from the TAD prose. Keep this
 * file in sync if the backend models change.
 */

// ---- Envelope (ApiResponse.js / error.middleware.js) ----
export interface ApiSuccessEnvelope<T> {
  success: true;
  data: T;
  message: string;
}

export interface ApiErrorEnvelope {
  success: false;
  message: string;
  errors: ApiFieldError[];
}

export interface ApiFieldError {
  field: string;
  message: string;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

// ---- Enums (shared/constants/enums.js) ----
export type ApplicationStatus = 'new' | 'under_review' | 'payment_verified' | 'enrolled' | 'rejected';
export type IdType = 'sa_id' | 'passport';
export type InvoiceType = 'proforma' | 'official';
export type Permission =
  | 'applications:read'
  | 'applications:write'
  | 'invoices:issue'
  | 'courses:manage'
  | 'gallery:manage'
  | 'testimonials:manage'
  | 'faqs:manage'
  | 'inquiries:manage'
  | 'content:manage'
  | 'users:manage';

// ---- Auth ----
export interface LoginResponse {
  accessToken?: string;
  user?: AuthUser;
  mfaRequired?: boolean;
  mfaToken?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: Permission[];
}

// ---- Applications (application.model.js) ----
export interface ApplicationAddress {
  line1: string;
  line2?: string;
  city: string;
  province: string;
  postalCode: string;
}

export interface PopulatedCourseRef {
  id: string;
  grade: string;
  title: string;
  fee: number;
}

export interface PopulatedIntakeRef {
  id: string;
  title: string;
  startDate: string;
}

export interface Application {
  id: string;
  referenceCode: string;
  fullName: string;
  idType: IdType;
  idNumber: string; // decrypted on read, per application.service.js
  phone: string;
  whatsapp?: string;
  email: string;
  address: ApplicationAddress;
  // Populated with {grade, title, fee} on list/detail responses
  // (application.service.js: .populate('coursesSelected', 'grade title fee')),
  // not bare course ID strings.
  coursesSelected: PopulatedCourseRef[];
  // Populated with {title, startDate} (application.service.js:
  // .populate('preferredIntake', 'title startDate')).
  preferredIntake: PopulatedIntakeRef;
  status: ApplicationStatus;
  statusHistory: { status: ApplicationStatus; changedAt: string; changedBy: { id: string; name: string } }[];
  consentGiven: true;
  consentGivenAt: string;
  documentUrl?: string; // signed URL, fetched fresh via GET /applications/:id/document
  createdAt: string;
}

export interface ApplicationSubmitResponse {
  referenceCode: string;
  applicationId: string;
}

// ---- Invoices (invoice.model.js) ----
export interface Invoice {
  id: string;
  applicationId: string;
  type: InvoiceType;
  amount: number;
  issuedAt: string;
  pdfUrl: string;
}

// ---- Courses / Intakes ----
export interface Course {
  id: string;
  grade: string;
  title: string;
  duration: string;
  fee: number;
  active: boolean;
}

export interface Intake {
  id: string;
  courseId: string;
  startDate: string;
  capacity: number;
  active: boolean;
}

// ---- Settings ----
export interface BankAccount {
  bankName: string;
  accountName: string;
  accountNumber: string;
  branchCode: string;
}

export interface Settings {
  bankAccounts: BankAccount[];
  psiraFee: number;
  whatsappNumber: string;
  contactPhone: string;
}

// ---- Gallery / Testimonials / FAQs / Announcements ----
export interface GalleryItem {
  id: string;
  category: string;
  imageUrl: string;
  caption?: string;
  order: number;
  active: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  grade: string;
  quote: string;
  photoUrl?: string;
  featured: boolean;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  order: number;
  active: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  publishAt: string;
  expiresAt?: string;
}

// ---- Inquiries ----
export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: 'open' | 'replied';
  replies: { body: string; repliedAt: string; repliedBy: string }[];
  createdAt: string;
}

// ---- Users / Roles ----
export interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
}

export interface Role {
  id: string;
  name: string;
  permissions: Permission[];
}

// ---- Audit Logs ----
export interface AuditLogEntry {
  id: string;
  actor: string;
  action: string;
  target?: string;
  createdAt: string;
}
