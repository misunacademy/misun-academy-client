"use client";

import Image from "next/image";
import { UserRound } from "lucide-react";
import type { BootcampCatalogItem } from "@/redux/api/bootcampApi";

export function DetailMentor({
  mentor,
}: {
  mentor?: BootcampCatalogItem["mentor"];
}) {
  if (!mentor?.name) return null;
  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <p className="font-bangla text-sm font-semibold text-[#ffd60a]">মেন্টর</p>
      <h2 className="mt-1 font-bangla text-2xl font-bold sm:text-3xl">
        যার কাছ থেকে শিখবেন
      </h2>
      <div className="mt-5 flex flex-col gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:flex-row sm:items-start">
        {mentor.image ? (
          <Image
            src={mentor.image}
            alt={mentor.name}
            width={160}
            height={160}
            className="h-28 w-28 shrink-0 rounded-2xl border border-white/10 object-cover"
          />
        ) : (
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#ffd60a]/15 text-[#ffd60a]">
            <UserRound className="h-8 w-8" />
          </span>
        )}
        <div>
          <p className="font-bangla text-xl font-bold">{mentor.name}</p>
          {mentor.title ? (
            <p className="mt-0.5 font-bangla text-sm text-white/55">
              {mentor.title}
            </p>
          ) : null}
          {mentor.bio ? (
            <p className="mt-3 max-w-2xl font-bangla text-sm leading-relaxed text-white/70">
              {mentor.bio}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
