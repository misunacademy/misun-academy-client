import { Skeleton } from "@/components/ui/skeleton"

interface LoadingBoundaryProps {
  loading: boolean
  children: React.ReactNode
  fallback?: React.ReactNode
  className?: string
}

export function LoadingBoundary({ loading, children, fallback, className }: LoadingBoundaryProps) {
  if (!loading) return children

  return (
    <div aria-busy="true" className={className}>
      {fallback ?? (
        <>
          <Skeleton className="h-6 w-full" />
          <Skeleton className="mt-3 h-6 w-5/6" />
          <Skeleton className="mt-3 h-24 w-full" />
        </>
      )}
    </div>
  )
}
