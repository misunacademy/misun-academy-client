# Plan: Integrate CursorGrid into /my-classes page

## Context

The `/my-classes` page currently uses a custom `GridScan` component (heavy WebGL face-tracking grid with webcam support) as its decorative background. The user wants to replace it with the `CursorGrid` component from React Bits — a lighter, cursor-reactive grid effect that responds to mouse movement.

## Files to modify

1. **Create** `src/app/(WithCommonLayout)/my-classes/components/CursorGrid.tsx` — the React Bits component source
2. **Create** `src/app/(WithCommonLayout)/my-classes/components/CursorGrid.css` — the component styles
3. **Modify** `src/app/(WithCommonLayout)/my-classes/page.tsx` — swap GridScan → CursorGrid

## Steps

## Step 1: Create CursorGrid component

1. Create `src/app/(WithCommonLayout)/my-classes/components/CursorGrid.tsx` with the React Bits CursorGrid component source

2. Create `src/app/(WithCommonLayout)/my-classes/components/CursorGrid.css` with the component's CSS styles

## Step 2: Update page.tsx

1. Change the dynamic import from `GridScan` to `CursorGrid` in `/my-classes/page.tsx`:
```tsx
import dynamic from "next/dynamic";

const CursorGrid = dynamic(() => import("./components/CursorGrid"), { ssr: false });
```

2. Replace the existing GridScan background with CursorGrid and wrap the content inside:
```tsx
<div className="absolute inset-0 z-[1] h-full">
  <CursorGrid
    cellSize={30}
    color="#20b486"
    gridColor="#2b5b54"
    highlight="area"
    gridStyle="lines"
    radius={90}
    holdTime={400}
    fadeDuration={800}
    fillOpacity={0.06}
    gridOpacity={0.08}
    spotlight={0.6}
    clickPulse
  >
    {/* Content wrapped inside CursorGrid */}
    <WelcomeBanner firstName={firstName} enrolledCourses={enrolledCourses} />
    <Tabs defaultValue="courses" className="space-y-6">
      {/* Tab content */}
    </Tabs>
  </CursorGrid>
</div>
```

## Step 3: Verify build

- Run `npm run typecheck` and `npm run lint` to ensure no errors