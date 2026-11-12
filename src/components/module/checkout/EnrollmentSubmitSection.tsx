'use client';
import { Loader2 } from "lucide-react";
import { AnimatedBorder } from '@/components/shared/AnimatedBorder';
import { useTranslations } from 'next-intl';
import { formatBDT } from '@/lib/i18n';

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
  const t = useTranslations('checkout');
  const isDisabled = !(isValid && agreed && isEnrollmentOpen) || isProcessing;

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-xl bg-primary/8 border border-primary/20 p-4">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="flex justify-between items-center font-semibold text-lg">
          <span className="text-white/80">{t('coursePrice')}</span>
          <span className="text-primary font-bold">{formatBDT(totalPrice)}</span>
        </div>
      </div>

      {!isEnrollmentOpen && batch && (
        <div className="relative overflow-hidden rounded-xl bg-yellow-500/8 border border-yellow-500/20 p-3 text-center">
          <p className="text-sm text-yellow-400 font-medium">{t('batchClosed')}</p>
          {(batch.enrollmentStartDate as string) && (
            <p className="text-xs text-white/70 mt-1">
              {t('startDate')}: {new Date(batch.enrollmentStartDate as string).toLocaleDateString('bn-BD', {
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
            {t('agreeTerms')} <a href="/terms-and-conditions" target="_blank" className="text-primary hover:text-primary/80 underline underline-offset-2">{t('termsAndConditions')}</a>,{' '}
            <a href="/privacy-policy" target="_blank" className="text-primary hover:text-primary/80 underline underline-offset-2">{t('privacyPolicy')}</a> 和{' '}
            <a href="/refund-policy" target="_blank" className="text-primary hover:text-primary/80 underline underline-offset-2">{t('refundPolicy')}</a>{' '}
            {t('haveReadAndAgreed')}
          </span>
        </label>

        <div className="relative p-[1.5px] rounded-xl overflow-hidden">
          <AnimatedBorder variant="simple" speed="3s" />

          <button
            type="submit"
            disabled={isDisabled}
            className="
            relative w-full
            bg-primary text-primary-foreground
            hover:bg-primary/90
            active:bg-primary/80
            disabled:cursor-not-allowed
            disabled:bg-emerald-darker
            disabled:text-white
            disabled:ring-1 disabled:ring-inset
            disabled:ring-primary/25
            transition-colors duration-200 ease-in-out
            font-bold py-3.5 rounded-xl text-base
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-primary/50
            focus-visible:ring-offset-2
          "
          >

            {isProcessing ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                {t('processing')}
              </span>
            ) : !isEnrollmentOpen && batch ? (
              t('enrollmentNotStarted')
            ) : (
              t('enroll')
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
