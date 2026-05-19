import NextLink from 'next/link';
import type { ComponentProps } from 'react';

/** Site navigation link — prefetch disabled to reduce memory use on mobile Safari. */
export default function AppLink({
  prefetch = false,
  ...props
}: ComponentProps<typeof NextLink>) {
  return <NextLink prefetch={prefetch} {...props} />;
}
