'use client';
import { useTranslations } from 'next-intl';

interface BatchInfoCardProps {
  batch: Record<string, unknown> | undefined;
  course: Record<string, unknown> | undefined;
}

export function BatchInfoCard({ batch, course }: BatchInfoCardProps) {
  const t = useTranslations('checkout');
  if (!batch) {
    return (
      <div className="bg-yellow-500/8 border border-yellow-500/20 rounded-xl p-4 text-center">
        <p className="text-yellow-400 font-medium">{t('batchClosed')}</p>
        <p className="text-sm text-white/70 mt-1">{t('batchClosedDesc')}</p>
      </div>
    );
  }

  return (
    <div className="bg-primary/6 border border-primary/20 rounded-xl p-4 space-y-3">
      <div>
        <p className="text-xs text-white/70 mb-0.5">{t('header.paymentMethod')}</p>
        <p className="font-semibold text-white/85">{batch.title as string}</p>
      </div>
      {course && (
        <div>
          <p className="text-xs text-white/70 mb-0.5">কোর্স</p>
          <p className="font-medium text-white/70">{course.title as string}</p>
        </div>
      )}
      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-primary/15">
        {(batch.enrollmentStartDate as string) && (
          <div>
            <p className="text-xs text-white/70">{t('startDate')}</p>
            <p className="text-sm font-medium text-white/70">
              {new Date(batch.enrollmentStartDate as string).toLocaleDateString('bn-BD')}
            </p>
          </div>
        )}
        {(batch.enrollmentEndDate as string) && (
          <div>
            <p className="text-xs text-white/70">{t('endDate')}</p>
            <p className="text-sm font-medium text-white/70">
              {new Date(batch.enrollmentEndDate as string).toLocaleDateString('bn-BD')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
