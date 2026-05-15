import CommonLayoutShell from '@/components/layout/CommonLayoutShell';

export default function layout({ children }: { children: React.ReactNode }) {
  return <CommonLayoutShell>{children}</CommonLayoutShell>;
}
