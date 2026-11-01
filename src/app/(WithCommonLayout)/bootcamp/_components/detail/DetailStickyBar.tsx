"use client";

import Link from "next/link";
import { Play, ShoppingCart } from "lucide-react";
import type { BootcampCatalogItem } from "@/redux/api/bootcampApi";

interface Props {
  bootcamp: BootcampCatalogItem;
  hasPurchased: boolean;
  onBuy: () => void;
  watchUrl: string;
}

export function DetailStickyBar({ bootcamp, hasPurchased, onBuy, watchUrl }: Props) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#0a0a0b]/95 px-4 py-3 backdrop-blur lg:hidden">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
        <div className="font-bangla">
          <p className="max-w-[45vw] truncate text-sm font-bold">{bootcamp.title}</p>
          <p className="text-sm">
            <span className="font-bold text-[#ffd60a]">
              ৳{bootcamp.recordedPrice}
            </span>{" "}
            {bootcamp.liveFee > bootcamp.recordedPrice ? (
              <span className="text-xs text-white/40 line-through">
                ৳{bootcamp.liveFee}
              </span>
            ) : null}
          </p>
        </div>
        {hasPurchased ? (
          <Link
            href={watchUrl}
            className="flex items-center gap-2 rounded-xl bg-[#ffd60a] px-5 py-2.5 font-bangla text-sm font-bold text-black"
          >
            <Play className="h-4 w-4" /> দেখুন
          </Link>
        ) : (
          <button
            onClick={onBuy}
            className="flex items-center gap-2 rounded-xl bg-[#ffd60a] px-5 py-2.5 font-bangla text-sm font-bold text-black"
          >
            <ShoppingCart className="h-4 w-4" /> কিনুন
          </button>
        )}
      </div>
    </div>
  );
}
