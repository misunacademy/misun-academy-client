import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useEnrollmentCheckout } from "@/hooks/useEnrollmentCheckout";
import { BatchInfoCard } from "./BatchInfoCard";
import { VideoTutorialSection } from "./VideoTutorialSection";
import { PaymentMethodSelector } from "./PaymentMethodSelector";
import { EnrollmentSubmitSection } from "./EnrollmentSubmitSection";

interface StepOneContentProps {
  form: ReturnType<typeof useEnrollmentCheckout>['form'];
  batch: Record<string, unknown>;
  course: Record<string, unknown>;
  agreed: boolean;
  isProcessing: boolean;
  isEnrollmentOpen: boolean;
  showTutorial: boolean;
  batchPrice: number;
  onAgreeChange: (v: boolean) => void;
  onTutorialToggle: () => void;
  onSubmit: (data: { batchId: string; paymentMethod: "SSLCommerz" | "phonePay" }) => void;
}

export function CheckoutStepOne({
  form, batch, course, agreed, isProcessing, isEnrollmentOpen, showTutorial, batchPrice,
  onAgreeChange, onTutorialToggle, onSubmit,
}: StepOneContentProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {batch ? (
          <div className="space-y-4">
            <h3 className="text-base font-semibold flex items-center gap-2.5 text-white/80">
              <StepBadge number={1} />
              Enrolling in Current Batch
            </h3>
            <BatchInfoCard batch={batch} course={course} />
          </div>
        ) : (
          <div className="bg-yellow-500/8 border border-yellow-500/20 rounded-xl p-4 text-center">
            <p className="text-yellow-400 font-medium">No upcoming batches available at the moment</p>
            <p className="text-sm text-white/40 mt-1">Please check back later or contact support</p>
          </div>
        )}

        {batch && <div className="h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" />}

        <VideoTutorialSection show={showTutorial} onToggle={onTutorialToggle} />

        <div className="h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" />

        <div className="space-y-4">
          <h3 className="text-base font-semibold flex items-center gap-2.5 text-white/80">
            <StepBadge number={2} />
            Payment Method
          </h3>
          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem>
                <PaymentMethodSelector value={field.value} onChange={field.onChange as (v: "SSLCommerz" | "phonePay") => void} />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" />

        <EnrollmentSubmitSection
          totalPrice={batchPrice}
          isEnrollmentOpen={isEnrollmentOpen}
          isValid={form.formState.isValid}
          agreed={agreed}
          isProcessing={isProcessing}
          batch={batch}
          onAgreeChange={onAgreeChange}
        />
      </form>
    </Form>
  );
}

export function StepBadge({ number }: { number: number }) {
  return (
    <div className="w-6 h-6 bg-primary/15 border border-primary/30 text-primary rounded-full flex items-center justify-center text-xs font-bold">
      {number}
    </div>
  );
}
