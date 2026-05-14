"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import PopupBannerModal from "@/components/shared/PopupBannerModal";

const MAINTENANCE_PATH = "/maintenance";

export default function CommonLayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isMaintenance = pathname === MAINTENANCE_PATH;

  if (isMaintenance) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <div className="grid grid-cols-1 grid-rows-[auto,1fr,auto] min-h-screen">
      <PopupBannerModal />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
