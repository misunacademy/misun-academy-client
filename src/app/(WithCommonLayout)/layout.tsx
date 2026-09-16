import CommonLayoutShell from '@/components/layout/CommonLayoutShell';
import LenisProvider from '@/providers/LenisProvider';

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <LenisProvider>
      <CommonLayoutShell>{children}</CommonLayoutShell>
    </LenisProvider>
  );
}
