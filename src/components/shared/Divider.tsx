interface DividerProps {
  label?: string
}

export function Divider({ label = "অথবা" }: DividerProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px bg-primary/15" />
      {label && (
        <span className="text-xs text-white/30 font-medium">{label}</span>
      )}
      <div className="flex-1 h-px bg-primary/15" />
    </div>
  )
}
