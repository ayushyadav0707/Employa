'use client';

// This is a no-op component. The logout-on-refresh behavior was causing users
// to be logged out every time they refreshed the page, which is incorrect.
// Session persistence is handled by the HttpOnly cookie with a 7-day expiry.
export default function StrictSessionGuard() {
  return null;
}
