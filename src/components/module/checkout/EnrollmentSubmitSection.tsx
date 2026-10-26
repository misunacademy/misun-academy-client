import { Loader2 } from "lucide-react";
import { AnimatedBorder } from '@/components/shared/AnimatedBorder';

interface EnrollmentSubmitSectionProps {
  totalPrice: number;
  isEnrollmentOpen: boolean;
  isValid: boolean;
  agreed: boolean;
  isProcessing: boolean;
  batch: Record<string, unknown> | undefined;
  onAgreeChange: (agreed: boolean) => void;
}

export function EnrollmentSubmitSection({
  totalPrice,
  isEnrollmentOpen,
  isValid,
  agreed,
  isProcessing,
  batch,
  onAgreeChange,
}: EnrollmentSubmitSectionProps) {
  const isDisabled = !(isValid && agreed && isEnrollmentOpen) || isProcessing;

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-xl bg-primary/8 border border-primary/20 p-4">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="flex justify-between items-center font-semibold text-lg">
          <span className="text-white/80">সর্বমোট:</span>
          <span className="text-primary font-bold">৳{totalPrice?.toLocaleString?.('en-IN')}</span>
        </div>
      </div>

      {!isEnrollmentOpen && batch && (
        <div className="rounded-xl bg-yellow-500/8 border border-yellow-500/20 p-3 text-center">
          <p className="text-sm text-yellow-400 font-medium">এনরোলমেন্ট উইন্ডো এখনো খোলা হয়নি</p>
          {(batch.enrollmentStartDate as string) && (
            <p className="text-xs text-white/70 mt-1">
              শুরু: {new Date(batch.enrollmentStartDate as string).toLocaleDateString('bn-BD', {
                day: 'numeric', month: 'long', year: 'numeric'
              })}
            </p>
          )}
        </div>
      )}

      <div className="space-y-4">
        <label className="flex items-start gap-2.5 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={() => onAgreeChange(!agreed)}
            className="mt-1 accent-primary"
          />
          <span className="text-white/75 leading-relaxed">
            আমি{' '}
            <a href="/terms-and-conditions" target="_blank" className="text-primary hover:text-primary/80 underline underline-offset-2">
              শর্তাবলী
            </a>,{' '}
            <a href="/privacy-policy" target="_blank" className="text-primary hover:text-primary/80 underline underline-offset-2">
              প্রাইভেসি পলিসি
            </a> এবং{' '}
            <a href="/refund-policy" target="_blank" className="text-primary hover:text-primary/80 underline underline-offset-2">
              রিটার্ন, রিফান্ড ও ক্যান্সেলেশন পলিসি
            </a>{' '}
            পড়েছি এবং সম্মত আছি।
          </span>
        </label>

        <div className="relative p-[1.5px] rounded-xl overflow-hidden">
          <AnimatedBorder variant="simple" speed="3s" />
          <button
            type="submit"
            disabled={isDisabled}
            className="relative w-full bg-primary hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-emerald-darker disabled:text-white disabled:ring-1 disabled:ring-inset disabled:ring-primary/25 transition-colors duration-300 text-primary-foreground font-bold py-3.5 rounded-xl text-base"
          >
            {isProcessing ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                প্রসেস হচ্ছে...
              </span>
            ) : !isEnrollmentOpen && batch ? (
              'এনরোলমেন্ট শুরু হয়নি'
            ) : (
              'এনরোলমেন্ট সম্পন্ন করুন'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
