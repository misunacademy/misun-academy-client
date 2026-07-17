import { type ReactNode } from "react"

interface FieldWrapperProps {
  children: ReactNode
  cols?: 1 | 2 | 3 | 4
  className?: string
}

const gridCols: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-3",
  4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
}

export function FieldWrapper({ children, cols = 1, className }: FieldWrapperProps) {
  return (
    <div className={`grid ${gridCols[cols]} gap-4 ${className || ""}`}>
      {children}
    </div>
  )
}
