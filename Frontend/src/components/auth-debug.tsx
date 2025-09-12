"use client";

import { useEffect, useState } from "react";
import { sessionUtils } from "@/lib/api/client";
import { useTranslations } from "next-intl";

export function AuthDebug() {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    userId: null as string | null,
    rememberMe: false,
    hasTokens: false,
  });
  const t = useTranslations("auth.debug");

  useEffect(() => {
    const updateAuthState = () => {
      setAuthState({
        isAuthenticated: sessionUtils.isAuthenticated(),
        userId: sessionUtils.getUserId(),
        rememberMe: sessionUtils.isRememberMeEnabled(),
        hasTokens: sessionUtils.getTokens() !== null,
      });
    };

    // Update on mount
    updateAuthState();

    // Listen for storage changes
    const handleStorageChange = () => {
      updateAuthState();
    };

    window.addEventListener("storage", handleStorageChange);

    // Check periodically for changes - reduced frequency from 1s to 5s
    const interval = setInterval(updateAuthState, 5000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  if (process.env.NODE_ENV === "production") {
    return null; // Don't show in production
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs font-mono z-50 max-w-xs">
      <div className="font-bold mb-2">{t("title")}</div>
      <div>
        {t("authenticated")}: {authState.isAuthenticated ? "✅" : "❌"}
      </div>
      <div>
        {t("userId")}: {authState.userId || t("none")}
      </div>
      <div>
        {t("rememberMe")}: {authState.rememberMe ? "✅" : "❌"}
      </div>
      <div>
        {t("hasTokens")}: {authState.hasTokens ? "✅" : "❌"}
      </div>
      <div className="mt-2 text-xs text-gray-400">
        {t("storage")}:{" "}
        {authState.rememberMe ? t("localStorage") : t("sessionStorage")}
      </div>
    </div>
  );
}
