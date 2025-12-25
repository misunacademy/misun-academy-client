// import Footer from '@/components/layout/Footer';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { Toaster } from '@/components/ui/sonner';

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 grid-rows-[auto,1fr,auto] min-h-screen">
      <Navbar />
      <main>{children}</main>
      <Footer />
      <Toaster />
    </div>
  );
}
