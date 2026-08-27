'use client';
import { useEnrollmentCheckout } from "@/hooks/useEnrollmentCheckout";
import { CourseInfoSidebar } from "./CourseInfoSidebar";
import { CheckoutStepOne } from "./CheckoutStepOne";
import { CheckoutHeader } from "./CheckoutHeader";
import ManualPaymentForm from "./ManualPaymentForm";

export default function EnrollmentCheckout({ courseSlug }: { courseSlug?: string } = {}) {
  const {
    form, currentStep, agreed, isProcessing, showTutorial,
    isDataLoading, isEnrollmentOpen, resolvedCourse, resolvedBatch,
    manualPaymentAmount, manualPaymentCurrency,
    setAgreed, setShowTutorial, setCurrentStep, onSubmit, goBack, handleManualPaymentComplete,
  } = useEnrollmentCheckout(courseSlug);

  const batchPrice = (resolvedBatch?.price as number) || 0;
  const course = resolvedCourse as Record<string, unknown>;
  const batch = resolvedBatch as Record<string, unknown>;

  return (
    <div className="min-h-screen bg-surface">
      <CheckoutHeader currentStep={currentStep} onBack={goBack} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <CourseInfoSidebar course={course} batch={batch} isLoading={isDataLoading} />

          <div className="lg:col-span-2">
            <div className="relative overflow-hidden rounded-2xl bg-surface border border-primary/15">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
              <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-primary/40 rounded-tl-2xl" />
              <div className="absolute top-0 right-0 w-5 h-5 border-t border-r border-primary/40 rounded-tr-2xl" />

              <div className="p-6 pb-2 border-b border-primary/10">
                <h2 className="text-2xl font-bold text-white/90">
                  {currentStep === 1 ? 'Choose Payment Method' : 'Manual Payment'}
                </h2>
                <p className="text-sm text-white/45 mt-1">
                  {currentStep === 1
                    ? 'Select your preferred payment method and complete enrollment'
                    : 'Complete your payment details'}
                </p>
              </div>

              <div className="p-6">
                {currentStep === 1 ? (
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
                ) : (
                  <ManualPaymentForm
                    onBack={() => setCurrentStep(1)}
                    onPaymentComplete={handleManualPaymentComplete}
                    manualAmount={manualPaymentAmount}
                    manualCurrency={manualPaymentCurrency}
                    batch={(batch?.title as string)?.split(' ')[1]}
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
