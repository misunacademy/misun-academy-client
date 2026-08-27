'use client'

import { useEffect, useRef } from 'react'
import { track } from '@/lib/metaPixel'

export function TrackView() {
  const tracked = useRef(false)

  useEffect(() => {
    if (tracked.current) return
    tracked.current = true
    track('ViewContent', {
      content_name: 'Graphic Design Course',
      content_type: 'course',
      content_ids: ['rvtheryheyhtwe1234'],
    })
  }, [])

  return null
}
