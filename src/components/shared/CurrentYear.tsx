'use client';

import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

export default function CurrentYear() {
  const year = useSyncExternalStore(
    subscribe,
    () => String(new Date().getFullYear()),
    () => ''
  );

  return <>{year}</>;
}
