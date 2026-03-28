import { Navigate, Outlet } from 'react-router';
import { getSession } from '../utils/session';

/**
 * Wraps protected routes. Unauthenticated users are redirected to /login.
 * Place as the `Component` of a parent route with children.
 */
export function AuthGuard() {
  const session = getSession();
  if (!session) return <Navigate to="/login" replace />;
  return <Outlet />;
}
