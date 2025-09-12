"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import * as lucideReact from "lucide-react";
import FormInput from "@/components/ui/form-input";
import { HoverButton } from "@/components/ui/hover-button";
import { activateEmail, EmailActivationRequest } from "@/lib/api/client";
import Loader from "@/components/ui/loader";
import { useLocale, useTranslations } from "next-intl";

function ActivateEmailContent() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("activateEmail");
  const locale = useLocale();
  // Pre-fill email if passed as query parameter
  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !token.trim()) {
      setError(t("errors.missingFields"));
      return;
    }

    if (token.length !== 8) {
      setError(t("errors.invalidTokenLength"));
      return;
    }

    setIsSubmitting(true);

    try {
      const requestBody: EmailActivationRequest = {
        email: email.trim(),
        token: token.trim(),
      };

      const result = await activateEmail(requestBody);

      if (result.success) {
        setIsSuccess(true);

        // Redirect to dashboard or home page after successful activation
        setTimeout(() => {
          router.push(`/${locale}/sign-in`);
        }, 2000);
      } else {
        const errorMessage = Array.isArray(result.error)
          ? result.error.join(", ")
          : result.error || t("errors.activationFailed");
        setError(errorMessage);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : t("errors.unexpectedError");
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br ">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-md"
      >
        <motion.div
          variants={itemVariants}
          className="p-8 rounded-2xl bg-metallic-light/5 backdrop-blur-lg border border-white/10"
        >
          <motion.div variants={itemVariants} className="mb-8 text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-metallic-accent/20 mb-4">
                <lucideReact.Mail className="w-8 h-8 text-metallic-accent" />
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-2 relative group">
              <span className="absolute -inset-1 bg-gradient-to-r from-metallic-accent/20 via-metallic-accent/30 to-metallic-light/20 blur-xl opacity-75 group-hover:opacity-100 transition-all duration-500 animate-pulse"></span>
              <span className="relative inline-block text-3xl font-bold mb-2 text-white">
                {t("title")}
              </span>
            </h2>
            <div className="text-white/80 flex flex-col items-center space-y-1">
              <span className="relative group cursor-default">
                <span className="absolute -inset-1 bg-gradient-to-r from-metallic-accent/20 to-metallic-accent/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                <span className="relative inline-block animate-pulse">
                  {t("description")}
                </span>
              </span>
              <span className="text-xs text-white/50 animate-pulse">
                {t("subtitle")}
              </span>
            </div>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}

          {isSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm"
            >
              {t("successMessage")}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div variants={itemVariants}>
              <FormInput
                icon={<lucideReact.Mail className="text-white/60" size={18} />}
                type="email"
                placeholder={t("email")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <FormInput
                icon={<lucideReact.Key className="text-white/60" size={18} />}
                type="text"
                placeholder={t("activationCode")}
                value={token}
                onChange={(e) => setToken(e.target.value.slice(0, 8))}
                maxLength={8}
                required
              />
              <p className="text-xs text-white/50 mt-1">
                {t("codeDescription")}
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <HoverButton
                type="submit"
                disabled={isSubmitting || isSuccess}
                className={`w-full py-3 rounded-lg ${
                  isSuccess
                    ? "bg-green-500"
                    : "bg-metallic-accent hover:bg-metallic-accent/70"
                } text-white font-medium transition-all duration-200 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-metallic-accent focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-metallic-accent/20 hover:shadow-metallic-accent/40`}
              >
                {isSubmitting
                  ? t("activating")
                  : isSuccess
                  ? t("activated")
                  : t("activateEmail")}
              </HoverButton>
            </motion.div>
          </form>

          <motion.p
            variants={itemVariants}
            className="mt-6 text-center text-sm text-white/60"
          >
            {t("alreadyActivated")}{" "}
            <a
              href={`/${locale}/sign-in`}
              className="font-medium text-white hover:text-metallic-accent transition-colors"
            >
              {t("signInHere")}
            </a>
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function ActivateEmailPage() {
  return (
    <Suspense fallback={<Loader />}>
      <ActivateEmailContent />
    </Suspense>
  );
}
