"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import * as lucideReact from "lucide-react";
import { HoverButton } from "@/components/ui/hover-button";
import FormInput from "@/components/ui/form-input";
import { useLocale, useTranslations } from "next-intl";
import { askForPasswordToken, resetPassword } from "@/lib/api/client";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const t = useTranslations("auth.resetPassword");
  const locale = useLocale();
  const router = useRouter();

  const [resetEmail, setResetEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [resetNewPassword, setResetNewPassword] = useState("");
  const [resetConfirmPassword, setResetConfirmPassword] = useState("");
  const [isRequestingToken, setIsRequestingToken] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);
  const [tokenRequested, setTokenRequested] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleAskForToken = async () => {
    setResetError(null);
    setResetSuccess(null);
    if (!resetEmail.trim()) {
      setResetError(t("errors.missingEmail"));
      return;
    }
    setIsRequestingToken(true);
    try {
      const res = await askForPasswordToken({ email: resetEmail.trim() });
      if (res.success) {
        setTokenRequested(true);
        setResetSuccess(t("tokenSent"));
      } else {
        const msg = Array.isArray(res.error)
          ? res.error.join(", ")
          : res.error || t("errors.tokenFailed");
        setResetError(msg);
      }
    } catch {
      setResetError(t("errors.tokenError"));
    } finally {
      setIsRequestingToken(false);
    }
  };

  const handleResetPassword = async () => {
    setResetError(null);
    setResetSuccess(null);
    if (!resetEmail.trim() || !resetToken.trim() || !resetNewPassword) {
      setResetError(t("errors.missingFields"));
      return;
    }
    if (resetNewPassword !== resetConfirmPassword) {
      setResetError(t("errors.passwordMismatch"));
      return;
    }
    setIsResettingPassword(true);
    try {
      const res = await resetPassword({
        email: resetEmail.trim(),
        token: resetToken.trim(),
        newPassword: resetNewPassword,
      });
      if (res.success) {
        setResetSuccess(t("resetSuccess"));
        // Redirect to sign-in after 3 seconds
        setTimeout(() => {
          router.push(`/${locale}/sign-in`);
        }, 3000);
      } else {
        const msg = Array.isArray(res.error)
          ? res.error.join(", ")
          : res.error || t("errors.resetFailed");
        setResetError(msg);
      }
    } catch {
      setResetError(t("errors.resetError"));
    } finally {
      setIsResettingPassword(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-md p-8 rounded-2xl bg-metallic-light/5 backdrop-blur-lg border border-white/10"
      >
        <motion.div variants={itemVariants} className="mb-8 text-center">
          <div className="w-16 h-16 bg-metallic-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <lucideReact.Key className="w-8 h-8 text-metallic-accent" />
          </div>
          <h1 className="text-3xl font-bold mb-2 text-white">{t("title")}</h1>
          <p className="text-white/80">{t("description")}</p>
        </motion.div>

        {resetError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm flex items-center gap-2"
          >
            <lucideReact.AlertCircle className="w-4 h-4 flex-shrink-0" />
            {resetError}
          </motion.div>
        )}

        {resetSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-300 text-sm flex items-center gap-2"
          >
            <lucideReact.Check className="w-4 h-4 flex-shrink-0" />
            {resetSuccess}
          </motion.div>
        )}

        <div className="space-y-6">
          <motion.div variants={itemVariants}>
            <label className="block text-white/80 text-sm font-medium mb-2">
              {t("email")}
            </label>
            <FormInput
              icon={<lucideReact.Mail className="text-white/60" size={18} />}
              type="email"
              placeholder={t("enterEmail")}
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-3 flex-wrap">
              <HoverButton
                onClick={handleAskForToken}
                disabled={isRequestingToken}
                className="px-4 py-2 bg-metallic-accent/20 hover:bg-metallic-accent/30"
              >
                {isRequestingToken ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                    {t("sending")}
                  </div>
                ) : (
                  <div className="flex items-center">
                    <lucideReact.Send className="w-4 h-4 mr-2" />
                    {t("sendToken")}
                  </div>
                )}
              </HoverButton>
              {tokenRequested && (
                <span className="text-xs text-white/60">
                  {t("tokenSentNote")}
                </span>
              )}
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block text-white/80 text-sm font-medium mb-2">
              {t("token")}
            </label>
            <FormInput
              icon={<lucideReact.Key className="text-white/60" size={18} />}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder={t("enterToken")}
              value={resetToken}
              onChange={(e) =>
                setResetToken(e.target.value.replace(/[^0-9]/g, ""))
              }
              onPaste={(e) => {
                e.preventDefault();
                const text = e.clipboardData.getData("text");
                const digitsOnly = text.replace(/[^0-9]/g, "");
                setResetToken(digitsOnly);
              }}
              disabled={!tokenRequested}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block text-white/80 text-sm font-medium mb-2">
              {t("newPassword")}
            </label>
            <div className="relative">
              <FormInput
                icon={<lucideReact.Lock className="text-white/60" size={18} />}
                type={showNewPassword ? "text" : "password"}
                placeholder={t("enterNewPassword")}
                value={resetNewPassword}
                onChange={(e) => setResetNewPassword(e.target.value)}
                disabled={!tokenRequested}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white focus:outline-none transition-colors"
                onClick={() => setShowNewPassword(!showNewPassword)}
                disabled={!tokenRequested}
              >
                {showNewPassword ? (
                  <lucideReact.EyeOff size={18} />
                ) : (
                  <lucideReact.Eye size={18} />
                )}
              </button>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block text-white/80 text-sm font-medium mb-2">
              {t("confirmPassword")}
            </label>
            <div className="relative">
              <FormInput
                icon={<lucideReact.Check className="text-white/60" size={18} />}
                type={showConfirmPassword ? "text" : "password"}
                placeholder={t("enterConfirmPassword")}
                value={resetConfirmPassword}
                onChange={(e) => setResetConfirmPassword(e.target.value)}
                disabled={!tokenRequested}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white focus:outline-none transition-colors"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={!tokenRequested}
              >
                {showConfirmPassword ? (
                  <lucideReact.EyeOff size={18} />
                ) : (
                  <lucideReact.Eye size={18} />
                )}
              </button>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <HoverButton
              onClick={handleResetPassword}
              disabled={isResettingPassword}
              className="w-full py-3 bg-metallic-accent hover:bg-metallic-accent/70"
            >
              {isResettingPassword ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                  {t("resetting")}
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <lucideReact.RefreshCw className="w-4 h-4 mr-2" />
                  {t("resetPassword")}
                </div>
              )}
            </HoverButton>
          </motion.div>

          <motion.div variants={itemVariants} className="text-center">
            <a
              href={`/${locale}/sign-in`}
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              {t("backToSignIn")}
            </a>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
