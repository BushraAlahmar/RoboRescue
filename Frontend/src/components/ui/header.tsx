"use client";

import React, { useEffect, useState } from "react";
import { Code2, User, LogOut, ChevronDown, Globe } from "lucide-react";
import { HoverButton } from "./hover-button";
import { useRouter, usePathname } from "next/navigation";
import { routeName } from "@/app/[locale]/_route-name";
import { sessionUtils } from "@/lib/api/client";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { routing } from "@/i18n/routing";

export function Header() {
  const route = useRouter();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const t = useTranslations("header");
  const locale = useLocale();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Check authentication status on mount and when pathname changes
    setIsAuthenticated(sessionUtils.isAuthenticated());
  }, [pathname]);

  useEffect(() => {
    // Close dropdowns when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (
        !target.closest(".profile-dropdown") &&
        !target.closest(".language-dropdown")
      ) {
        setShowProfileDropdown(false);
        setShowLanguageDropdown(false);
      }
    };

    if (showProfileDropdown || showLanguageDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfileDropdown, showLanguageDropdown]);

  const isActive = (path: string) => {
    return pathname === path;
  };

  const handleLogout = () => {
    sessionUtils.clearTokens();
    setIsAuthenticated(false);
    setShowProfileDropdown(false);
    route.push(`/${locale}/${routeName.home}`);
    // Reload the page after logout to clear all state
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const handleProfileClick = () => {
    setShowProfileDropdown(false);
    route.push(`/${locale}/profile`);
  };

  const handleLanguageSwitch = (newLocale: string) => {
    setShowLanguageDropdown(false);
    // Get the current path without the locale
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, "");
    const newPath = `/${newLocale}/${pathWithoutLocale}`;
    route.push(newPath);
  };
  // Hide header for level routes that match the pattern /:locale/:sectionId/:levelId
  const isLevelRoute =
    /^\/[a-z]{2}\/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(
      pathname
    );
  if (isLevelRoute) return null;
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled
          ? "bg-metallic-light/5 backdrop-blur-sm border-b border-white/10"
          : "border-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Code2 className="h-8 w-8 text-metallic-accent" />
            <span className="md:text-xl text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-metallic-accent to-metallic-light">
              RoboRescue
            </span>
          </div>

          {/* Navigation and Auth */}
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href={`/${locale}/${routeName.home}`}
                className={`transition-colors ${
                  isActive(routeName.home)
                    ? "text-metallic-accent"
                    : "text-metallic-light/60 hover:text-metallic-light"
                }`}
              >
                {t("home")}
              </Link>

              {/* <Link
                href={`/${locale}/${routeName.challenges}`}
                className={`transition-colors ${
                  isActive(routeName.challenges)
                    ? "text-metallic-accent"
                    : "text-metallic-light/60 hover:text-metallic-light"
                }`}
              >
                {t("challenges")}
              </Link> */}

              <Link
                href={`/${locale}/${routeName.about}`}
                className={`transition-colors ${
                  isActive(routeName.about)
                    ? "text-metallic-accent"
                    : "text-metallic-light/60 hover:text-metallic-light"
                }`}
              >
                {t("about")}
              </Link>
            </nav>
            <div className="flex items-center gap-4">
              {/* Language Switcher */}
              <div className="relative language-dropdown">
                <button
                  onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                  className="flex items-center gap-2 text-sm px-3 py-2 text-metallic-light/80 hover:text-metallic-light bg-metallic-accent/10 hover:bg-metallic-accent/20 rounded-lg transition-colors"
                >
                  <Globe className="w-4 h-4 text-metallic-accent" />
                  <span className="hidden md:inline uppercase">
                    {locale.toUpperCase()}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {showLanguageDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-32 bg-metallic-dark/95 backdrop-blur-lg border border-metallic-accent/20 rounded-lg shadow-lg z-50">
                    <div className="py-2">
                      {routing.locales.map((lang) => (
                        <button
                          key={lang}
                          onClick={() => handleLanguageSwitch(lang)}
                          className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center gap-2 ${
                            locale === lang
                              ? "text-metallic-accent bg-metallic-accent/10"
                              : "text-metallic-light/80 hover:text-metallic-light hover:bg-metallic-accent/10"
                          }`}
                        >
                          <span className="uppercase">
                            {lang.toUpperCase()}
                          </span>
                          {locale === lang && (
                            <span className="text-metallic-accent">✓</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {isAuthenticated ? (
                <div className="relative profile-dropdown">
                  <button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="flex items-center gap-2 text-sm px-4 py-2 text-metallic-light/80 hover:text-metallic-light transition-colors"
                  >
                    <div className="w-8 h-8 bg-metallic-accent/20 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-metallic-accent" />
                    </div>
                    <span className="hidden md:inline">{t("profile")}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {showProfileDropdown && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-metallic-dark/95 backdrop-blur-lg border border-metallic-accent/20 rounded-lg shadow-lg z-50">
                      <div className="py-2">
                        <button
                          onClick={handleProfileClick}
                          className="w-full text-left px-4 py-2 text-sm text-metallic-light/80 hover:text-metallic-light hover:bg-metallic-accent/10 transition-colors flex items-center gap-2"
                        >
                          <User className="w-4 h-4" />
                          {t("viewProfile")}
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors flex items-center gap-2"
                        >
                          <LogOut className="w-4 h-4" />
                          {t("logout")}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <HoverButton
                    onClick={() => route.push(`/${locale}/${routeName.signIn}`)}
                    className="text-sm px-4 py-2"
                  >
                    {t("signIn")}
                  </HoverButton>
                  <HoverButton
                    onClick={() => route.push(`/${locale}/${routeName.signUp}`)}
                    className="text-sm px-4 py-2 bg-metallic-accent/20 hover:bg-metallic-accent/30"
                  >
                    {t("signUp")}
                  </HoverButton>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
