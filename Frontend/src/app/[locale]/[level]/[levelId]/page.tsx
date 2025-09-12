"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useRobotMessages } from "@/app/[locale]/hooks/useRobotMessages";
import { LargeRobotMessageOverlay } from "@/components/large-robot-message";
import Loader from "@/components/ui/loader";
import { useGameStore } from "@/lib/store";
import { useLocale, useTranslations } from "next-intl";
import { HoverButton } from "@/components/ui/hover-button";

// Import level components
import {
  LevelHeader,
  LevelControls,
  LevelBackground,
  LevelDialog,
  LevelSuccess,
  LevelConfirmDialog,
  LevelError,
  LevelHistoryDialog,
} from "@/components/level";

// Import custom hook
import { useLevel } from "@/app/[locale]/hooks/useLevel";
import { getUserLastLevels, sessionUtils, UserLevel } from "@/lib/api/client";

export default function LabGamePage() {
  const t = useTranslations("level.progress");
  const robotT = useTranslations("level.robot");
  const locale = useLocale();
  const params = useParams();
  const levelId = params.levelId as string;
  const [mounted, setMounted] = useState(false);
  const [robotVisible, setRobotVisible] = useState(false);
  const [userLastLevel, setUserLastLevel] = useState<UserLevel | null>(null);
  const [userLastSection, setUserLastSection] = useState<number | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [userLevels, setUserLevels] = useState<UserLevel[]>([]);
  const robotStartedRef = useRef(false);
  useEffect(() => {
    console.log(userLastLevel);
    console.log(userLastSection);
  }, [userLastLevel, userLastSection]);
  const router = useRouter();

  // Zustand store
  const {
    nextLevel,
    setCurrentLevel,
    setNextLevel,
    findNextLevel,
    isLastLevel,
    getSectionByLevelId,
    getUserCurrentLevel,
    sections,
  } = useGameStore();

  // Use custom hook for level logic
  const {
    levelData,
    isLoadingLevel,
    levelError,
    isDialogOpen,
    success,
    showLights,
    fadeOutLights,
    showConfirmDialog,
    isCompiling,
    audioEnabled,
    handleCodeChange,
    handleRunCode,
    handleDialogOpenChange,
    setAudioEnabled,
    setShowConfirmDialog,
  } = useLevel(levelId);

  // Fetch user's last level and check access
  useEffect(() => {
    const fetchUserLevels = async () => {
      const userId = sessionUtils.getUserId();
      console.log(userId, sessionUtils.isAuthenticated());
      if (!userId || !sessionUtils.isAuthenticated()) {
        // User not authenticated. Redirecting to sign-in.
        router.push(`/${locale}/sign-in`);
        return;
      }

      try {
        const res = await getUserLastLevels(userId, locale);
        if (!res.success || !res.data || res.data.length === 0) {
          return;
        }

        const levels = res.data;
        // Find the highest level the user has completed
        const highestLevel = levels.reduce((highest, current) => {
          return current.levelNumber > highest.levelNumber ? current : highest;
        });

        setUserLevels(levels);
        setUserLastLevel(highestLevel);

        // Check if user has already completed this level
        if (
          levelData &&
          highestLevel.levelNumber === levelData.levelNumber &&
          highestLevel.sectionId === levelData.sectionId
        ) {
          // User has already completed this level. Redirecting to home.
          router.push(`/${locale}/`);
          return;
        }

        // Only update section and check access if we have the necessary data
        if (sections.length > 0) {
          // Find the section number for the highest level
          const currentSection = sections.find((section) =>
            section.levels.some((level) => level.id === highestLevel.id)
          );

          if (currentSection) {
            setUserLastSection(currentSection.sectionNumber);
          }

          // Check if user can access this level
          if (levelData) {
            const userCurrentLevel = getUserCurrentLevel();
            if (
              userCurrentLevel &&
              levelData.levelNumber > userCurrentLevel.levelNumber
            ) {
              router.push(`/${locale}/`);

              return;
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user levels:", error);
      }
    };

    // Always try to fetch user levels
    fetchUserLevels();
  }, [levelId, router, sections, levelData, getUserCurrentLevel, locale]);

  useEffect(() => {
    setMounted(true);
    robotStartedRef.current = false;
    setRobotVisible(false);
  }, [levelId]);

  useEffect(() => {
    if (levelData && sections.length > 0) {
      setCurrentLevel(levelData);

      const next = findNextLevel(levelData.id);

      setNextLevel(next);
    }
  }, [levelData, sections, setCurrentLevel, setNextLevel, findNextLevel]);
  const robotMessages = useMemo(
    () => [
      robotT("welcome"),
      levelData?.description || robotT("readyToStart"),
      robotT("clickToStart"),
    ],
    [robotT, levelData?.description]
  );

  const { currentMessage, isVisible, show, next, hide } = useRobotMessages(
    robotMessages,
    10000
  );

  // On mount: show robot overlay and start message cycling
  useEffect(() => {
    if (
      mounted &&
      levelData &&
      levelData.id &&
      !robotVisible &&
      !robotStartedRef.current
    ) {
      robotStartedRef.current = true;
      setRobotVisible(true);
      show(); // kick off the message cycle
    }
  }, [mounted, levelData, robotVisible]);

  const isLastMessage =
    robotMessages.indexOf(currentMessage) === robotMessages.length - 1;

  // Handle starting the coding session
  const handleStartCoding = () => {
    hide(); // Hide the robot messages
    setRobotVisible(false); // Hide overlay after Start clicked
    setMounted(true); // Open the dialog for coding
    setAudioEnabled(true); // Turn on sounds
  };

  // Handle level completion and navigation to next level
  const handleLevelComplete = () => {
    if (nextLevel) {
      // Navigate to next level after a short delay
      setTimeout(() => {
        const currentSection = getSectionByLevelId(levelId);

        if (currentSection) {
          router.push(`/${locale}/${currentSection.sectionId}/${nextLevel.id}`);
        }
      }, 2000);
    } else if (isLastLevel(levelId)) {
      setTimeout(() => {
        router.push(`/${locale}/`);
        // Redirect to map/home
      }, 2000);
    } else {
      setTimeout(() => {
        router.push(`/${locale}/`);
        // Redirect to map/home
      }, 2000);
    }
  };

  // Show loading state
  if (isLoadingLevel) {
    return (
      <div className="relative min-h-screen overflow-hidden flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  // Show error state
  if (levelError) {
    return <LevelError levelError={levelError} />;
  }
  if (
    userLastLevel?.levelNumber === levelData?.levelNumber &&
    userLastLevel?.sectionSectionNumber === levelData?.sectionSectionNumber
  ) {
    router.push(`/${locale}/`);
  }
  return (
    mounted && (
      <div className="relative min-h-screen overflow-hidden">
        <LargeRobotMessageOverlay
          message={robotVisible && isVisible ? currentMessage : ""}
          showStartButton={isLastMessage}
          onStart={handleStartCoding}
          onNext={next}
          startButtonText={robotT("startCode")}
        />

        <LevelControls
          audioEnabled={audioEnabled}
          onToggleAudio={() => setAudioEnabled(!audioEnabled)}
          onShowConfirmDialog={() => setShowConfirmDialog(true)}
        />

        <LevelBackground
          success={success}
          showLights={showLights}
          fadeOutLights={fadeOutLights}
          levelNumber={levelData?.levelNumber}
          sectionNumber={
            sections.find(
              (section) => section.sectionId === levelData?.sectionId
            )?.sectionNumber
          }
        />

        {/* User Progress Display */}
        {levelData && (
          <div className="fixed top-4 left-4 z-[30] bg-metallic-light/10 backdrop-blur-lg border border-white/20 rounded-lg p-3 text-white">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-metallic-accent font-semibold">
                  {t("title")}
                </span>
              </div>
              {levelData && (
                <div className="flex items-center gap-2 text-xs text-metallic-light/80">
                  <span>
                    {t("current")} {t("level")} {levelData.levelNumber}
                  </span>
                  {sections.find(
                    (section) => section.sectionId === levelData.sectionId
                  )?.sectionNumber && (
                    <>
                      <span className="text-metallic-light/60">•</span>
                      <span>
                        {t("section")}{" "}
                        {
                          sections.find(
                            (section) =>
                              section.sectionId === levelData.sectionId
                          )?.sectionNumber
                        }
                      </span>
                    </>
                  )}
                </div>
              )}
              {/* Progress Indicator */}
              {levelData && userLastLevel && (
                <div className="mt-2">
                  <div className="flex justify-between items-center text-xs text-metallic-light/60 mb-1">
                    <span>{t("progressLabel")}</span>
                    <div className="flex items-center gap-2">
                      <span>
                        {Math.min(
                          ((levelData.levelNumber - 1) /
                            sections[levelData.sectionSectionNumber - 1]?.levels
                              .length) *
                            100,
                          100
                        )}
                        %
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-metallic-light/20 rounded-full h-1">
                    <div
                      className="bg-metallic-accent h-1 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(
                          ((levelData.levelNumber - 1) /
                            sections[levelData.sectionSectionNumber - 1]?.levels
                              .length) *
                            100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>{" "}
                  <HoverButton
                    onClick={() => setShowHistory(true)}
                    className="text-xs py-1 px-2 mt-4"
                  >
                    {t("viewPreviousLevels")}
                  </HoverButton>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Main Content */}
        {!success ? (
          <div className="relative z-20 flex flex-col items-center justify-center min-h-screen p-8">
            <LevelHeader sectionNumber={levelData?.sectionSectionNumber ?? 1} />

            <LevelDialog
              isDialogOpen={isDialogOpen}
              onDialogOpenChange={handleDialogOpenChange}
              levelData={levelData}
              onCodeChange={handleCodeChange}
              onRunCode={handleRunCode}
              isCompiling={isCompiling}
            />
          </div>
        ) : (
          <LevelSuccess
            levelData={levelData}
            nextLevel={nextLevel}
            onLevelComplete={handleLevelComplete}
          />
        )}

        <LevelConfirmDialog
          showConfirmDialog={showConfirmDialog}
          onClose={() => setShowConfirmDialog(false)}
        />

        <LevelHistoryDialog
          isOpen={showHistory}
          onOpenChange={setShowHistory}
          userLevels={userLevels}
          currentSectionId={levelData?.sectionId}
          currentLevelId={levelId}
        />
      </div>
    )
  );
}
