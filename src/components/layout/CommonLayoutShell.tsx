import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import PopupBannerModal from "@/components/shared/PopupBannerModal";
import AnnouncementBanner from "@/components/shared/AnnouncementBanner";

export default function CommonLayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 grid-rows-[auto,1fr,auto] min-h-screen">
      <PopupBannerModal />
      <Navbar />
      <AnnouncementBanner />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
