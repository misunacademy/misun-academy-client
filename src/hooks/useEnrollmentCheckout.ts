import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useGetCourseBySlugQuery } from "@/redux/api/courseApi";
import { useGetCurrentEnrollmentBatchQuery, useGetUpcomingBatchesQuery } from "@/redux/api/batchApi";
import { useEnrollStudentManualMutation, useInitiateEnrollmentMutation } from "@/redux/api/enrollmentApi";
import {
  enrollmentCheckoutSchema,
  type EnrollmentCheckoutForm,
  isBatchEnrollmentOpen,
} from "@/lib/enrollment-checkout";

const enrollmentSchema = enrollmentCheckoutSchema;

export type EnrollmentForm = EnrollmentCheckoutForm;
export type ManualPaymentData = { senderNumber: string; transactionId: string };

export function useEnrollmentCheckout(courseSlug?: string) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [agreed, setAgreed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [enrollmentData, setEnrollmentData] = useState<EnrollmentForm | null>(null);
  // Ticking clock: a frozen mount-time `now` permanently blocks enrollment
  // for tabs left open across the window boundary.
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 60_000);
    const onVisible = () => {
      if (!document.hidden) setNow(Date.now());
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  const [enrollStudent] = useInitiateEnrollmentMutation();
  const [enrollStudentManual] = useEnrollStudentManualMutation();

  const form = useForm<EnrollmentForm>({
    resolver: zodResolver(enrollmentSchema),
    mode: 'onChange',
    defaultValues: { batchId: "", paymentMethod: undefined },
  });

  const { data: courseBySlug, isLoading: courseLoading } = useGetCourseBySlugQuery(
    courseSlug!, { skip: !courseSlug }
  );
  const courseData = (courseBySlug?.data) as Record<string, unknown> | undefined;

  const { data: currentBatchRes, isLoading: currentBatchLoading } = useGetCurrentEnrollmentBatchQuery(
    { courseId: courseData?._id as string }, { skip: !courseData?._id }
  );

  const { data: upcomingBatchRes, isLoading: upcomingBatchLoading } = useGetUpcomingBatchesQuery(
    { courseId: courseData?._id as string },
    { skip: !courseData?._id || !!currentBatchRes?.data }
  );

  const batchLoading = currentBatchLoading || upcomingBatchLoading;
  const resolvedCourse = courseSlug ? courseData : {};
  const resolvedBatch: Record<string, unknown> = courseSlug
    ? ((currentBatchRes?.data ?? (upcomingBatchRes?.data as unknown[])?.[0]) as unknown as Record<string, unknown>)
    : {};

  const resolvedBatchId = (resolvedBatch as Record<string, { _id: string } | string>)?._id;
  // Shared window policy (missing dates = open, matching the server); only
  // evaluate once a batch is actually resolved.
  const isEnrollmentOpen = resolvedBatchId
    ? isBatchEnrollmentOpen(resolvedBatch as { enrollmentStartDate?: unknown; enrollmentEndDate?: unknown }, now)
    : false;

  const isDataLoading = !!courseSlug && (courseLoading || (!!courseData && batchLoading));

  const manualPaymentAmount =
    typeof (resolvedBatch as Record<string, unknown>).manualPaymentPrice === 'number'
      ? (resolvedBatch as Record<string, number>).manualPaymentPrice
      : 0;

  const manualPaymentCurrency = (resolvedBatch as Record<string, string>)?.currency || 'BDT';

  useEffect(() => {
    if (!form.getValues('batchId') && resolvedBatchId) {
      form.setValue('batchId', resolvedBatchId as string);
    }
  }, [form, resolvedBatchId]);

  const processSSLCommerzPayment = useCallback(async (data: EnrollmentForm) => {
    setIsProcessing(true);
    try {
      const res = await enrollStudent({ batchId: data.batchId }).unwrap();
      const paymentUrl = (res as Record<string, Record<string, string>>)?.data?.paymentUrl;
      if (!paymentUrl) {
        toast.error("Failed to get payment URL. Please try again.");
        setIsProcessing(false);
        return;
      }
      toast.success("Redirecting to SSLCommerz...", {
        description: "You'll be redirected to complete your payment securely.",
      });
      router.push(paymentUrl);
    } catch (error: unknown) {
      const paymentError = error as { data?: { message?: string } };
      toast.error(paymentError?.data?.message || "Payment initiation failed. Please try again.");
      setIsProcessing(false);
    }
  }, [enrollStudent, router]);

  const handleManualPaymentComplete = useCallback(async (paymentData: ManualPaymentData) => {
    if (!enrollmentData) {
      toast.error("Enrollment data missing!");
      return;
    }
    setIsProcessing(true);
    try {
      const res = await enrollStudentManual({
        batchId: enrollmentData.batchId,
        paymentData,
      }).unwrap();
      if ((res as Record<string, boolean>)?.success) {
        toast.success("Payment submitted successfully!", {
          description: "We'll verify your payment within 12-24 hours.",
        });
        router.push('/');
      }
    } catch (err: unknown) {
      const errM = err as { data: { message: string } };
      toast.error(errM?.data?.message || "Something went wrong!");
    } finally {
      setIsProcessing(false);
    }
  }, [enrollmentData, enrollStudentManual, router]);

  const onSubmit = useCallback((data: EnrollmentForm) => {
    setEnrollmentData(data);
    if (data.paymentMethod === "SSLCommerz") {
      processSSLCommerzPayment(data);
    } else if (data.paymentMethod === "phonePay") {
      setCurrentStep(2);
    }
  }, [processSSLCommerzPayment]);

  const goBack = useCallback(() => {
    if (currentStep === 2) setCurrentStep(1);
    else window.history.back();
  }, [currentStep]);

  return {
    form,
    currentStep,
    agreed,
    isProcessing,
    showTutorial,
    isDataLoading,
    isEnrollmentOpen,
    resolvedCourse,
    resolvedBatch,
    manualPaymentAmount,
    manualPaymentCurrency,
    setAgreed,
    setShowTutorial,
    setCurrentStep,
    onSubmit,
    goBack,
    handleManualPaymentComplete,
  };
}
