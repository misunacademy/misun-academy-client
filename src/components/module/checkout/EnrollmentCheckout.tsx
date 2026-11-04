'use client';
import { useEnrollmentCheckout } from "@/hooks/useEnrollmentCheckout";
import { resolveBatchRef } from "@/lib/enrollment-checkout";
import { CourseInfoSidebar } from "./CourseInfoSidebar";
import { CheckoutStepOne } from "./CheckoutStepOne";
import { CheckoutHeader } from "./CheckoutHeader";
import { EnrollmentStatusNotice } from "./EnrollmentStatusNotice";
import ManualPaymentForm from "./ManualPaymentForm";

export default function EnrollmentCheckout({ courseSlug }: { courseSlug?: string } = {}) {
  const {
    form, currentStep, agreed, isProcessing, showTutorial,
    isDataLoading, isEnrollmentOpen, checkoutState, checkoutEnrollment, isCheckoutBlocked,
    resolvedCourse, resolvedBatch, manualPaymentAmount, manualPaymentCurrency,
    setAgreed, setShowTutorial, setCurrentStep, onSubmit, resumePayment, goBack,
    handleManualPaymentComplete,
  } = useEnrollmentCheckout(courseSlug);

  const batchPrice = (resolvedBatch?.price as number) || 0;
  const course = resolvedCourse as Record<string, unknown>;
  const batch = resolvedBatch as Record<string, unknown>;
  const enrollmentReference = checkoutEnrollment?.enrollmentId;

  const headerTitle = isCheckoutBlocked
    ? "এনরোলমেন্ট স্ট্যাটাস"
    : currentStep === 1
      ? "পেমেন্ট পদ্ধতি বেছে নিন"
      : "ম্যানুয়াল পেমেন্ট";

  const headerSubtitle = isCheckoutBlocked
    ? "আপনার বর্তমান এনরোলমেন্টের তথ্য"
    : currentStep === 1
      ? "পছন্দের পদ্ধতি বেছে নিয়ে ভর্তি সম্পন্ন করুন"
      : "আপনার পেমেন্টের তথ্য দিন";

  return (
    <div className="min-h-screen bg-surface">
      <CheckoutHeader currentStep={currentStep} onBack={goBack} />

      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          <CourseInfoSidebar course={course} batch={batch} isLoading={isDataLoading} />

          <div className="order-1 lg:order-2 lg:col-span-2">
            <div className="relative overflow-hidden rounded-2xl bg-surface border border-primary/15">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
              <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-primary/40 rounded-tl-2xl" />
              <div className="absolute top-0 right-0 w-5 h-5 border-t border-r border-primary/40 rounded-tr-2xl" />

              <div className="p-4 pb-2 sm:p-6 sm:pb-2 border-b border-primary/10">
                <h2 className="text-2xl font-bold text-white/90">
                  {headerTitle}
                </h2>
                <p className="text-sm text-white/70 mt-1">
                  {headerSubtitle}
                </p>
              </div>

              <div className="p-4 sm:p-6">
                {isDataLoading ? (
                  <div className="space-y-3 animate-pulse" aria-busy="true">
                    <div className="h-24 rounded-2xl bg-white/5" />
                    <div className="h-40 rounded-2xl bg-white/5" />
                  </div>
                ) : isCheckoutBlocked ? (
                  <EnrollmentStatusNotice
                    state={checkoutState as "active" | "under-review"}
                    enrollmentId={enrollmentReference}
                  />
                ) : currentStep === 1 ? (
                  <div className="space-y-4">
                    {checkoutState === "resume" && (
                      <EnrollmentStatusNotice
                        state="resume"
                        onResume={resumePayment}
                        isResuming={isProcessing}
                        enrollmentId={enrollmentReference}
                      />
                    )}
                    <CheckoutStepOne
                      form={form}
                      batch={batch}
                      course={course}
                      agreed={agreed}
                      isProcessing={isProcessing}
                      isEnrollmentOpen={isEnrollmentOpen}
                      showTutorial={showTutorial}
                      batchPrice={batchPrice}
                      onAgreeChange={setAgreed}
                      onTutorialToggle={() => setShowTutorial(!showTutorial)}
                      onSubmit={onSubmit}
                    />
                  </div>
                ) : (
                  <ManualPaymentForm
                    onBack={() => setCurrentStep(1)}
                    onPaymentComplete={handleManualPaymentComplete}
                    manualAmount={manualPaymentAmount}
                    manualCurrency={manualPaymentCurrency}
                    isSubmitting={isProcessing}
                    batch={resolveBatchRef(batch)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
