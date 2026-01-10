/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./baseApi";

export interface CertificateResponse {
  _id: string;
  enrollmentId: string;
  userId: string;
  batchId: string;
  courseId: string;
  certificateId: string;
  issueDate: Date;
  certificateUrl: string;
  verificationUrl: string;
  status: 'pending' | 'active' | 'revoked' | 'Pending' | 'Approved' | 'Rejected';
  revokedAt?: Date;
  revokedReason?: string;
  rejectionReason?: string;
  approvedAt?: string;
  rejectedAt?: string;
  completionPercentage?: number;
  user?: {
    name: string;
    email: string;
  };
  course?: {
    title: string;
  };
  batch?: {
    title: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const certificateApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Student: Request certificate (creates pending request)
    requestCertificate: build.mutation<{ data: CertificateResponse }, string>({
      query: (enrollmentId) => ({
        url: `/certificates/request/${enrollmentId}`,
        method: "POST",
      }),
      invalidatesTags: ["Certificates"],
    }),

    // Check certificate eligibility
    checkEligibility: build.query<{ data: { isEligible: boolean } }, string>({
      query: (enrollmentId) => ({
        url: `/certificates/enrollment/${enrollmentId}/eligibility`,
      }),
    }),

    // Get my certificates (includes pending, active, revoked)
    getMyCertificates: build.query<{ data: CertificateResponse[] }, void>({
      query: () => ({
        url: "/certificates/my-certificates",
      }),
      providesTags: ["Certificates"],
    }),

    // Get certificate by enrollment
    getCertificateByEnrollment: build.query<{ data: CertificateResponse }, string>({
      query: (enrollmentId) => ({
        url: `/certificates/enrollment/${enrollmentId}`,
      }),
      providesTags: ["Certificates"],
    }),

    // Verify certificate (public)
    verifyCertificate: build.query<{ data: { isValid: boolean; status: string; certificate?: any; reason?: string } }, string>({
      query: (certificateId) => ({
        url: `/certificates/verify/${certificateId}`,
      }),
    }),

    // Admin: Get all certificates (pending, approved, rejected)
    getCertificates: build.query<{ data: CertificateResponse[] }, { status?: string }>({
      query: (params) => ({
        url: "/certificates",
        params,
      }),
      providesTags: ["Certificates"],
    }),

    // Admin: Get pending certificates
    getPendingCertificates: build.query<{ data: CertificateResponse[] }, void>({
      query: () => ({
        url: "/certificates/pending",
      }),
      providesTags: ["Certificates"],
    }),

    // Admin: Update certificate (approve/reject)
    updateCertificate: build.mutation<{ data: CertificateResponse }, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/certificates/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Certificates", "CourseEnrollments"],
    }),

    // Admin: Approve pending certificate
    approveCertificate: build.mutation<{ data: CertificateResponse }, string>({
      query: (certificateId) => ({
        url: `/certificates/approve/${certificateId}`,
        method: "POST",
      }),
      invalidatesTags: ["Certificates", "CourseEnrollments"],
    }),

    // Admin: Issue certificate directly (bypasses approval)
    issueCertificate: build.mutation<{ data: CertificateResponse }, string>({
      query: (enrollmentId) => ({
        url: `/certificates/issue/${enrollmentId}`,
        method: "POST",
      }),
      invalidatesTags: ["Certificates", "CourseEnrollments"],
    }),

    // Admin: Revoke certificate
    revokeCertificate: build.mutation<{ data: CertificateResponse }, { certificateId: string; reason: string }>({
      query: ({ certificateId, reason }) => ({
        url: `/certificates/revoke/${certificateId}`,
        method: "PUT",
        body: { reason },
      }),
      invalidatesTags: ["Certificates"],
    }),
  }),
});

export const {
  useRequestCertificateMutation,
  useCheckEligibilityQuery,
  useGetMyCertificatesQuery,
  useGetCertificateByEnrollmentQuery,
  useVerifyCertificateQuery,
  useGetCertificatesQuery,
  useGetPendingCertificatesQuery,
  useUpdateCertificateMutation,
  useApproveCertificateMutation,
  useIssueCertificateMutation,
  useRevokeCertificateMutation,
} = certificateApi;
