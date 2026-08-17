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
  refreshToken?: string;
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
// address sub-fields other than street are stored plaintext with `default: null`
// on the model, so they come back as `null`, not `undefined`, until set.
export interface ApplicationAddress {
  street: string | null;
  suburb: string | null;
  city: string | null;
  province: string | null;
  postalCode: string | null;
}

// coursesSelected/preferredIntake are populated via appDoc.toObject() in
// application.service.js (toDecryptedJSON), which does NOT apply Course's
// toJSON id-transform — populated refs come back with a raw Mongo `_id`, not `id`.
export interface PopulatedCourseRef {
  _id: string;
  grade: string;
  title: string;
  fee: number;
}

export interface PopulatedIntakeRef {
  _id: string;
  title: string;
  startDate: string;
}

export interface Application {
  id: string;
  referenceCode: string;
  firstName: string;
  lastName: string;
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
  // totalAmount is server-computed (courses' fees + PSIRA registration fee) and
  // never derivable client-side from coursesSelected alone — always use this field.
  totalAmount: number;
  // changedBy is null for the initial "new" entry created at submission (system
  // action, no actor) — application.model.js: `default: null // null = system`.
  statusHistory: { status: ApplicationStatus; date: string; changedBy: { _id: string; name: string } | null }[];
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
  isActive: boolean;
}

export interface Intake {
  id: string;
  title: string;
  applicableGrades: string[]; // intakes reference grades, not a specific course
  startDate: string;
  capacity: number | null; // createIntake's Joi schema doesn't even accept capacity — only settable via update
  isActive: boolean;
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
  psiraRegistrationFee: number;
  whatsappNumber: string;
  contactPhone: string;
}

// ---- Gallery / Testimonials / FAQs / Announcements ----
// gallery.model.js has no id-transform, so responses carry Mongo's raw `_id`.
// GALLERY_CATEGORIES (shared/constants/enums.js) is a fixed 3-value enum,
// validated server-side by gallery.validation.js — not free text.
export type GalleryCategory = 'Practical Drills' | 'Graduations' | 'Campus Life';

export interface GalleryItem {
  _id: string;
  category: GalleryCategory;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  title: string; // always a string, default '' on the model — never undefined
  order: number;
  isActive: boolean;
}

// No toJSON/virtuals transform on testimonial.model.js, so responses carry
// raw `_id`. COURSE_GRADE (shared/constants/enums.js) is only {E, D, C, B} —
// no A — same enum courses use.
export interface Testimonial {
  _id: string;
  studentName: string;
  courseGrade: 'E' | 'D' | 'C' | 'B';
  quote: string;
  photoUrl: string | null; // set server-side from an uploaded file, never sent by the client as text
  isFeatured: boolean;
}

// No toJSON/virtuals transform on faq.model.js, so responses carry raw `_id`.
export interface Faq {
  _id: string;
  question: string;
  answer: string;
  order: number;
  isActive: boolean;
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
  // inquiry.service.js's toDecryptedJSON keeps the model's own field names
  // here (message, date) rather than renaming, unlike some other DTOs in
  // this file — sentBy is required on every reply (no system-generated
  // case), normalized to {id, name} the same way statusHistory.changedBy
  // and audit log actor are, so this never carries a bare ObjectId either.
  replies: { message: string; sentBy: { id: string; name: string | null }; date: string }[];
  createdAt: string;
}

// ---- Users / Roles ----
// GET /users populates `role` (a real object, not the bare ID), and unlike
// coursesSelected/preferredIntake on Application (which bypass toJSON via a
// manual .toObject() in application.service.js's toDecryptedJSON and so come
// back with a raw `_id`), staff users go through the normal res.json() path,
// so Role's own toJSON id-transform applies and this comes back as `id`.
// UserEditForm.tsx and UserManagementTable.tsx both already read it this way
// (role.id, role.name); this was the only place still calling it a string.
export interface StaffUser {
  id: string;
  name: string;
  phone: string | null;
  email: string;
  role: { id: string; name: string };
  active: boolean;
}

export interface Role {
  id: string;
  name: string;
  permissions: Permission[];
}

// ---- Audit Logs ----
// listAuditLogs in auditLog.service.js shapes its own output (like
// application.service.js's toDecryptedJSON), so this does NOT mirror
// auditLog.model.js field-for-field: `timestamp` is renamed to `createdAt`,
// and `actor` — null for system-generated entries (auditLog.model.js:
// `default: null`), otherwise populated via .populate('actor', 'name') — is
// normalized to {id, name} either way rather than a bare ObjectId.
export interface AuditLogEntry {
  id: string;
  actor: { id: string; name: string } | null;
  action: string;
  targetType?: string;
  targetId?: string;
  createdAt: string;
}

// ---- Analytics (analytics.service.js's getDashboard/getCapacityAlerts) ----
export type AnalyticsPeriod = 'daily' | 'weekly' | 'monthly';

export interface AnalyticsCountPoint {
  date: string;
  count: number;
}

export interface AnalyticsRevenuePoint {
  date: string;
  proforma: number;
  official: number;
}

export interface AnalyticsAvgHoursPoint {
  date: string;
  avgHours: number;
}

export interface AnalyticsStatusCount {
  status: ApplicationStatus;
  count: number;
}

export interface AnalyticsGradeCount {
  grade: string;
  count: number;
}

export interface AnalyticsProvinceCount {
  province: string;
  count: number;
}

export interface AnalyticsInquiryStatusCount {
  status: Inquiry['status'];
  count: number;
}

export interface AnalyticsCategoryCount {
  category: string;
  count: number;
}

export interface AnalyticsConversionRate {
  enrolled: number;
  rejected: number;
  total: number;
  rate: number | null;
}

export interface AnalyticsAvgTimeToEnrollment {
  avgDays: number | null;
  count: number;
}

export interface AnalyticsAvgInquiryResponseTime {
  avgHours: number | null;
  count: number;
}

export interface AnalyticsMonthlyRevenue {
  thisMonth: number;
  lastMonth: number;
  change: number | null;
}

export interface AnalyticsMfaAdoption {
  enabled: number;
  disabled: number;
  total: number;
  rate: number | null;
}

// Keyed by grade, then by ApplicationStatus, e.g. matrix.B.enrolled
export type AnalyticsGradeStatusMatrix = Record<string, Record<ApplicationStatus, number>>;

export interface AnalyticsDashboard {
  period: AnalyticsPeriod;
  lines: {
    applications: AnalyticsCountPoint[];
    revenue: AnalyticsRevenuePoint[];
    enrollments: AnalyticsCountPoint[];
    inquiryResponseTimeTrend: AnalyticsAvgHoursPoint[];
    failedLogins: AnalyticsCountPoint[];
  };
  pies: {
    applicationsByStatus: AnalyticsStatusCount[];
    applicationsByGrade: AnalyticsGradeCount[];
    applicationsByProvince: AnalyticsProvinceCount[];
    inquiriesByStatus: AnalyticsInquiryStatusCount[];
    auditByCategory: AnalyticsCategoryCount[];
  };
  metrics: {
    conversionRate: AnalyticsConversionRate;
    avgTimeToEnrollment: AnalyticsAvgTimeToEnrollment;
    avgInquiryResponseTime: AnalyticsAvgInquiryResponseTime;
    monthlyRevenue: AnalyticsMonthlyRevenue;
    mfaAdoption: AnalyticsMfaAdoption;
  };
  gradeStatusMatrix: AnalyticsGradeStatusMatrix;
}

export type CapacityAlertLevel = 'full' | 'approaching' | 'low' | null;

export interface CapacityAlert {
  id: string;
  title: string;
  startDate: string;
  applicableGrades: string[];
  capacity: number | null;
  enrolled: number;
  totalApplications: number;
  fillRate: number | null;
  alertLevel: CapacityAlertLevel;
  daysUntilStart: number;
}
