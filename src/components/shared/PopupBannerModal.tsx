"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { useGetSettingsQuery } from "@/redux/api/settingsApi";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

export default function PopupBannerModal() {
  const { data, isSuccess } = useGetSettingsQuery();
  const [isDismissed, setIsDismissed] = useState(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem("misunPopupDismissed") === "1";
  });

  const popupEnabled = data?.data?.popupEnabled;
  const popupImageUrl = data?.data?.popupImageUrl?.trim() || "";
  const popupLink = data?.data?.popupLink?.trim() || "";
  const showPopup = !isDismissed && isSuccess && popupEnabled && !!popupImageUrl;

  const close = useCallback(() => {
    setIsDismissed(true);
    try {
      sessionStorage.setItem("misunPopupDismissed", "1");
    } catch {
      // storage unavailable
    }
  }, []);

  return (
    <Dialog open={showPopup} onOpenChange={(open) => { if (!open) close(); }}>
      <DialogContent
        className="max-w-5xl gap-0 overflow-hidden border-primary/20 bg-surface-darker p-0 shadow-2xl [&>button]:rounded-full [&>button]:bg-white/10 [&>button]:p-1.5 [&>button]:text-white [&>button]:shadow-md [&>button]:hover:bg-white/20"
        aria-describedby={undefined}
      >
        <DialogTitle className="sr-only">প্রোমোশনাল ব্যানার</DialogTitle>
        <DialogDescription className="sr-only">
          বর্তমান অফার বা ঘোষণা প্রদর্শনকারী ব্যানার
        </DialogDescription>

        {popupLink ? (
          <a href={popupLink} target="_blank" rel="noopener noreferrer" onClick={close}>
            <div className="relative h-[70vh] max-h-[80vh] w-full sm:h-[80vh]">
              <Image
                src={popupImageUrl}
                alt="প্রোমোশনাল ব্যানার"
                fill
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="object-cover"
                unoptimized
              />
            </div>
          </a>
        ) : (
          <div className="relative h-[70vh] max-h-[80vh] w-full sm:h-[80vh]">
            <Image
              src={popupImageUrl}
              alt="প্রোমোশনাল ব্যানার"
              fill
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover"
              unoptimized
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
