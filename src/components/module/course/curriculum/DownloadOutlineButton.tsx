"use client"

import { Download } from "lucide-react"

interface DownloadOutlineButtonProps {
  /** Public URL of the PDF, e.g. "/outlines/misun-academy-course-outline.pdf" */
  href: string
  /** File name the browser saves the download as */
  fileName: string
  /** Button colour (the active course colour) */
  color: string
}

/**
 * Downloads the course outline PDF (one file that contains every course).
 *
 * The PDF is generated from `courseCurriculum.ts`. If the curriculum data
 * changes, the PDF must be regenerated, otherwise the download shows old content.
 */
export function DownloadOutlineButton({ href, fileName, color }: DownloadOutlineButtonProps) {
  return (
    <a
      href={href}
      download={fileName}
      type="application/pdf"
      className="group inline-flex min-h-[48px] items-center justify-center gap-2.5 rounded-xl px-6 py-3 font-bangla text-sm font-bold text-white transition-[filter,transform,background-color] duration-300 hover:brightness-110 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80 motion-reduce:transition-none"
      style={{ background: color }}
    >
      <Download
        size={18}
        aria-hidden="true"
        className="transition-transform duration-200 group-hover:translate-y-0.5 motion-reduce:transition-none"
      />
      <span>সব কোর্সের আউটলাইন ডাউনলোড করুন</span>
      <span className="rounded-md bg-black/15 px-1.5 py-0.5 text-[11px] font-semibold">PDF</span>
    </a>
  )
}