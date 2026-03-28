/**
 * SETU – Page Wrapper Component
 * AP-05 compliant page container with standardized background
 * Enforces #F8F9FA page background (not pure white)
 */

import { ReactNode } from 'react';

interface PageWrapperProps {
  children: ReactNode;
  /** Optional custom className for additional styling */
  className?: string;
  /** Add padding (default: true) */
  withPadding?: boolean;
  /** Add safe area insets for mobile (default: true) */
  withSafeArea?: boolean;
  /** Include bottom nav spacing for Staff/Principal screens (default: false) */
  withBottomNav?: boolean;
  /** Custom background override (use sparingly) */
  background?: string;
}

/**
 * PageWrapper – Standardized page container for all SETU screens
 * 
 * **AP-05 Compliance:**
 * - Uses #F8F9FA background (not pure white #FFFFFF)
 * - Provides safe area insets for mobile devices
 * - Handles bottom nav spacing automatically
 * 
 * @example
 * // Staff/Principal mobile screens
 * <PageWrapper withBottomNav>
 *   <h1>My Dashboard</h1>
 * </PageWrapper>
 * 
 * @example
 * // RCO desktop screens
 * <PageWrapper withPadding={false}>
 *   <RCOSidebar />
 *   <main>...</main>
 * </PageWrapper>
 */
export function PageWrapper({
  children,
  className = '',
  withPadding = true,
  withSafeArea = true,
  withBottomNav = false,
  background = '#F8F9FA', // AP-05 standard background
}: PageWrapperProps) {
  return (
    <div
      className={className}
      style={{
        backgroundColor: background,
        minHeight: '100vh',
        width: '100%',
        paddingTop: withSafeArea ? 'env(safe-area-inset-top)' : 0,
        paddingLeft: withSafeArea ? 'env(safe-area-inset-left)' : 0,
        paddingRight: withSafeArea ? 'env(safe-area-inset-right)' : 0,
        paddingBottom: withBottomNav 
          ? 'calc(56px + env(safe-area-inset-bottom))' // Bottom nav height + safe area
          : withSafeArea 
            ? 'env(safe-area-inset-bottom)' 
            : 0,
        padding: withPadding ? '16px' : 0,
        boxSizing: 'border-box',
      }}
    >
      {children}
    </div>
  );
}

/**
 * MobilePageWrapper – Preset for Staff/Principal mobile screens
 * Includes bottom nav spacing and safe area by default
 */
export function MobilePageWrapper({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <PageWrapper 
      withBottomNav 
      withSafeArea 
      withPadding={false}
      className={className}
    >
      {children}
    </PageWrapper>
  );
}

/**
 * DesktopPageWrapper – Preset for RCO desktop screens
 * No bottom nav spacing, optional sidebar layout
 */
export function DesktopPageWrapper({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <PageWrapper 
      withBottomNav={false} 
      withSafeArea={false}
      withPadding={false}
      className={className}
    >
      {children}
    </PageWrapper>
  );
}
