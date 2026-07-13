"use client"

import { Component, Suspense, type ReactNode } from "react"
import { Canvas } from "@react-three/fiber"
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
  return (
    <CanvasBoundary>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ alpha: true, antialias: true }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </CanvasBoundary>
  )
}
