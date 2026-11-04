"use client"

import { Component, Suspense, type ReactNode } from "react"
import { Canvas } from "@react-three/fiber"
import { useReducedMotion } from "framer-motion"
import dynamic from "next/dynamic"

const Scene = dynamic(() => import("./ThreeDScene").then((mod) => mod.Scene), {
  ssr: false,
})

class CanvasBoundary extends Component<{ children: ReactNode }> {
  state = { hasError: false }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  render() {
    if (this.state.hasError) return null
    return this.props.children
  }
}

export default function ClassesSceneBackground() {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return (
      <div
        aria-hidden="true"
        className="h-full w-full"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 20%, hsl(156 70% 42% / 0.10), transparent 45%), radial-gradient(circle at 75% 75%, hsl(217 91% 60% / 0.08), transparent 45%)",
        }}
      />
    )
  }

  return (
    <CanvasBoundary>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 1.5]}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </CanvasBoundary>
  )
}
