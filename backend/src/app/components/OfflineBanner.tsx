/**
 * SETU – Offline Banner Component
 * Displays amber banner when user is offline
 * Auto-hides when back online
 *
 * Design Spec: Section 0.5, Report Issue Step 4
 */

import { useState, useEffect } from "react";
import { useLanguage } from "../utils/languageContext";
import { t } from "../utils/translations";
import {
  isOnline,
  setupOnlineListener,
} from "../utils/offlineManager";

interface OfflineBannerProps {
  /** Show draft saved message (default: true) */
  showDraftMessage?: boolean;
  /** Custom message override */
  customMessage?: string;
}

/**
 * OfflineBanner – Displays when offline
 * Auto-detects online/offline status changes
 *
 * @example
 * <OfflineBanner />
 * <OfflineBanner showDraftMessage={false} customMessage="Connection lost" />
 */
export function OfflineBanner({
  showDraftMessage = true,
  customMessage,
}: OfflineBannerProps) {
  const { language } = useLanguage();
  const [isOffline, setIsOffline] = useState(!isOnline());

  useEffect(() => {
    // Setup listener for online/offline events
    const cleanup = setupOnlineListener((online) => {
      setIsOffline(!online);
    });

    return cleanup;
  }, []);

  if (!isOffline) return null;

  const message =
    customMessage ||
    (showDraftMessage
      ? t("lbl_offline_banner", language)
      : "You are currently offline");

  return (
    <div
      style={{
        width: "100%",
        padding: "12px 16px",
        backgroundColor: "#FEF3C7", // Amber/Warning color
        borderBottom: "1px solid #FDE68A",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        fontFamily: "Noto Sans",
      }}
      role="alert"
      aria-live="polite"
    >
      {/* Offline Icon */}
      <span
        className="material-symbols-rounded"
        style={{
          fontSize: "20px",
          color: "#92400E", // Dark amber
        }}
      >
        cloud_off
      </span>

      {/* Message */}
      <p
        style={{
          flex: 1,
          margin: 0,
          fontSize: "13px",
          fontWeight: 500,
          color: "#92400E",
          lineHeight: "1.4",
        }}
        data-i18n="lbl_offline_banner"
      >
        {message}
      </p>
    </div>
  );
}

/**
 * Hook to check online status
 */
export function useOnlineStatus(): boolean {
  const [online, setOnline] = useState(isOnline());

  useEffect(() => {
    const cleanup = setupOnlineListener(setOnline);
    return cleanup;
  }, []);

  return online;
}
