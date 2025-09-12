"use client";
import React from "react";
import { FC, ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { usePathname } from "next/navigation";
import GridBackground from "./ui/grid-background";
import { HeroGeometric } from "./ui/shape-landing-hero";
import {
  RobotToastProvider,
  useGlobalRobotToast,
} from "@/app/[locale]/hooks/useRobotToast";
import { RobotToast } from "./robot-toast";
import { Header } from "./ui/header";
import { SectionsProvider } from "./sections-provider";

interface ProvidersProps {
  children: ReactNode;
}

// Component to render the global robot toast
function GlobalRobotToast() {
  const { toastState, hideToast } = useGlobalRobotToast();

  return (
    <RobotToast
      isVisible={toastState.isVisible}
      message={toastState.message}
      showStartButton={toastState.showStartButton}
      showCloseButton={toastState.showCloseButton}
      onStart={toastState.onStart}
      onHide={hideToast}
    />
  );
}

const Providers: FC<ProvidersProps> = ({ children }) => {
  const pathname = usePathname();
  const isLevelPage = pathname.includes("/level");

  return (
    <RobotToastProvider>
      <SectionsProvider>
        {isLevelPage ? <GridBackground /> : <HeroGeometric />}

        <div className="relative">
          <Toaster position="top-center" reverseOrder={false} />

          {/* Global Robot Toast */}
          <GlobalRobotToast />
          <Header />
          {children}
          {/* <Footer /> */}
        </div>
      </SectionsProvider>
    </RobotToastProvider>
  );
};

export default Providers;
