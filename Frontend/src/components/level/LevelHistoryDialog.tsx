"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  UserLevel,
  getPreviousCodeForLevel,
  getAllLevels,
  Level,
  sessionUtils,
} from "@/lib/api/client";
import { HoverButton } from "@/components/ui/hover-button";
import JavaEditor from "@/components/java-editor/JavaEditor";
import { useState, useEffect } from "react";
import Loader from "@/components/ui/loader";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";

interface LevelHistoryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userLevels: UserLevel[];
  currentSectionId?: string;
  onLevelSelect?: (levelId: string) => void;
  currentLevelId?: string; // Add current level ID prop
}

export function LevelHistoryDialog({
  isOpen,
  onOpenChange,
  userLevels,
  currentSectionId,
  onLevelSelect,
  currentLevelId,
}: LevelHistoryDialogProps) {
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [previousCode, setPreviousCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [allLevels, setAllLevels] = useState<Level[]>([]);
  const [isLoadingLevels, setIsLoadingLevels] = useState(false);
  const t = useTranslations("level.dialog");
  const locale = useLocale();

  // Fetch all levels for the current section
  useEffect(() => {
    if (isOpen && currentSectionId) {
      const fetchAllLevels = async () => {
        setIsLoadingLevels(true);
        try {
          const response = await getAllLevels(
            { SectionId: currentSectionId },
            locale
          );
          if (response.success && response.data) {
            setAllLevels(response.data.data);
          }
        } catch (error) {
          console.error("Error fetching all levels:", error);
        } finally {
          setIsLoadingLevels(false);
        }
      };

      fetchAllLevels();
    }
  }, [isOpen, currentSectionId, locale]);

  const handleLevelSelect = async (level: Level) => {
    setSelectedLevel(level);
    setIsLoading(true);
    setPreviousCode(null);

    const userId = sessionUtils.getUserId();
    if (userId) {
      try {
        const result = await getPreviousCodeForLevel(level.id, userId);
        console.log("Previous code result:", result);
        console.log("Previous code data:", result.data);
        console.log("Previous code data type:", typeof result.data);
        console.log("Previous code data length:", result.data?.length);

        if (result.success && result.data && result.data.trim()) {
          console.log("Setting previous code:", result.data);
          setPreviousCode(result.data);
        } else {
          // If no previous code, show the task description
          const fallbackCode = level.task || level.description || "";
          console.log("Setting fallback code:", fallbackCode);
          setPreviousCode(fallbackCode);
        }
      } catch (error) {
        console.error("Error fetching previous code:", error);
        const fallbackCode = level.task || level.description || "";
        console.log("Setting fallback code due to error:", fallbackCode);
        setPreviousCode(fallbackCode);
      }
    } else {
      // If no user ID, show the task description
      const fallbackCode = level.task || level.description || "";
      console.log("Setting fallback code (no user ID):", fallbackCode);
      setPreviousCode(fallbackCode);
    }
    setIsLoading(false);

    if (onLevelSelect) {
      onLevelSelect(level.id);
    }
  };

  // Check if a level is completed by the user
  const isLevelCompleted = (level: Level) => {
    return userLevels.some(
      (userLevel) =>
        userLevel.id === level.id ||
        (userLevel.levelNumber === level.levelNumber &&
          userLevel.sectionId === level.sectionId)
    );
  };

  // Check if a level is accessible (completed or before current level)
  const isLevelAccessible = (level: Level) => {
    if (!currentLevelId) return isLevelCompleted(level);

    // Find current level in allLevels
    const currentLevel = allLevels.find((l) => l.id === currentLevelId);
    if (!currentLevel) return isLevelCompleted(level);

    // Level is accessible if:
    // 1. It's completed by the user, OR
    // 2. It's before the current level in the same section
    return (
      isLevelCompleted(level) ||
      (level.sectionId === currentLevel.sectionId &&
        level.levelNumber < currentLevel.levelNumber)
    );
  };

  // Get the highest completed level number in this section
  const getHighestCompletedLevelNumber = () => {
    const sectionUserLevels = userLevels.filter(
      (ul) => ul.sectionId === currentSectionId
    );
    if (sectionUserLevels.length === 0) return 0;

    return Math.max(...sectionUserLevels.map((ul) => ul.levelNumber));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl min-h-[70vh] max-h-[85vh] overflow-hidden bg-black/70 backdrop-blur-sm border border-gray-700">
        <DialogHeader className="border-b border-gray-700 pb-4">
          <DialogTitle className="text-xl font-bold text-white">
            {selectedLevel
              ? t("codeForLevel", { levelNumber: selectedLevel.levelNumber })
              : t("previousLevels")}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-6 flex-grow overflow-auto">
          {selectedLevel ? (
            <div className="space-y-6">
              <HoverButton
                onClick={() => setSelectedLevel(null)}
                className="text-sm px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600 rounded-lg transition-colors"
              >
                ← {t("backToLevels")}
              </HoverButton>
              {isLoading ? (
                <div className="flex justify-center items-center h-[500px] bg-gray-800/50 rounded-lg">
                  <Loader />
                </div>
              ) : (
                <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
                  <div className="mb-2 text-sm text-gray-400">
                    Previous code for Level {selectedLevel.levelNumber}
                  </div>
                  <JavaEditor
                    initialValue={previousCode || ""}
                    readOnly={true}
                    enableSyntaxCheck={false}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* All Levels in Section */}
              <div>
                {isLoadingLevels ? (
                  <div className="flex justify-center items-center h-[300px] bg-gray-800/30 rounded-lg">
                    <Loader />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 max-h-[60vh] overflow-y-auto pr-2">
                    {allLevels.map((level) => {
                      const completed = isLevelCompleted(level);
                      const accessible = isLevelAccessible(level);
                      const highestCompleted = getHighestCompletedLevelNumber();

                      return (
                        <div
                          key={level.id}
                          className={`p-6 rounded-xl border transition-all ${
                            accessible
                              ? "bg-gray-800/50 border-gray-600 hover:bg-gray-700/50"
                              : "bg-gray-900/30 border-gray-700 opacity-60"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h4 className="text-white font-medium">
                                Level {level.levelNumber}: {level.name}
                              </h4>
                              <p className="text-sm text-metallic-light/60 mt-1">
                                {level.description}
                              </p>
                              {completed && (
                                <span className="inline-block mt-2 px-2 py-1 bg-green-500/30 text-green-400 text-xs rounded">
                                  {t("completed")}
                                </span>
                              )}
                              {!completed &&
                                accessible &&
                                level.levelNumber <= highestCompleted + 1 && (
                                  <span className="inline-block mt-2 px-2 py-1 bg-green-500/30 text-green-400 text-xs rounded">
                                    {t("completed")}
                                  </span>
                                )}
                            </div>
                            <div className="ml-4">
                              <HoverButton
                                onClick={() => handleLevelSelect(level)}
                                className={`text-sm px-6 py-3 rounded-lg transition-all ${
                                  accessible
                                    ? "bg-blue-600/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 hover:text-blue-200"
                                    : "bg-gray-700/50 border border-gray-600 text-gray-400 cursor-not-allowed"
                                }`}
                                disabled={!accessible}
                              >
                                {accessible ? t("viewCode") : t("notCompleted")}
                              </HoverButton>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
