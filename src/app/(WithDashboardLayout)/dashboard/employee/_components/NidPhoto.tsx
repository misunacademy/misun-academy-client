"use client";

import Image from "next/image";
import { useGetNidPhotoUrlQuery } from "@/redux/api/employeeApi";

const isDirectUrl = (value?: string | null) =>
  !value || value.startsWith("http://") || value.startsWith("https://");

export function useNidPhotoSrc(value?: string | null): string | null {
  const isReference = Boolean(value) && !isDirectUrl(value);
  const { data } = useGetNidPhotoUrlQuery({ publicId: value }, { skip: !isReference });
  if (!value) return null;
  if (isDirectUrl(value)) return value;
  return data?.data?.url ?? null;
}

export function NidPhoto({
  value,
  alt,
  sizes,
  className,
}: {
  value?: string | null;
  alt: string;
  sizes?: string;
  className?: string;
}) {
  const src = useNidPhotoSrc(value);
  if (!src) return null;
  return (
    <Image
      src={src}
      alt={alt}
      fill={Boolean(sizes)}
      width={sizes ? undefined : 800}
      height={sizes ? undefined : 600}
      sizes={sizes}
      unoptimized
      className={className}
    />
  );
}
