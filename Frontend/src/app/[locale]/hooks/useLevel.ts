import { useState, useEffect, useRef } from "react";
import { getLevelById, Level, checkCode, sessionUtils } from "@/lib/api/client";
import { javaSyntaxChecker } from "@/lib/javaSyntaxChecker";
import { useRobotMessage } from "./useRobotToast";
import { useLocale, useTranslations } from "next-intl";

export function useLevel(levelId: string) {
  const locale = useLocale();
  const t = useTranslations("level.robot");
  // Level data state
  const [levelData, setLevelData] = useState<Level | null>(null);
  const [isLoadingLevel, setIsLoadingLevel] = useState(true);
  const [levelError, setLevelError] = useState<string | null>(null);

  // UI state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showLights, setShowLights] = useState(false);
  const [fadeOutLights, setFadeOutLights] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Code and compilation state
  const [currentCode, setCurrentCode] = useState("");
  const [isCompiling, setIsCompiling] = useState(false);

  // Audio state
  const [audioEnabled, setAudioEnabled] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const successAudioRef = useRef<HTMLAudioElement | null>(null);

  // Robot toast hook
  const { showRobotPersistent, hideRobotMessage } = useRobotMessage();

  // Cleanup audio on unmount or level change
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
      if (successAudioRef.current) {
        successAudioRef.current.pause();
        successAudioRef.current.currentTime = 0;
        successAudioRef.current = null;
      }
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = null;
      }
    };
  }, [levelId]);

  // Fetch level data
  useEffect(() => {
    const fetchLevelData = async () => {
      if (!levelId) return;

      try {
        setIsLoadingLevel(true);
        setLevelError(null);

        const response = await getLevelById(levelId, locale);

        if (response.success && response.data) {
          setLevelData(response.data);
          // Set initial code if available
          if (response.data.previousCode) {
            setCurrentCode(response.data.previousCode);
          }
        } else {
          const errorMessage = Array.isArray(response.error)
            ? response.error.join(", ")
            : response.error || t("failedToLoad");
          setLevelError(errorMessage);
        }
      } catch (error) {
        setLevelError(t("failedToLoadData"));
        console.error("Error fetching level:", error);
      } finally {
        setIsLoadingLevel(false);
      }
    };

    fetchLevelData();
  }, [levelId]);

  // Handle code changes from editor
  const handleCodeChange = (code: string | undefined) => {
    const newCode = code || "";
    setCurrentCode(newCode);
  };
  // Handle run code button click
  const handleRunCode = async () => {
    if (!currentCode.trim()) {
      return;
    }

    // Always trigger error checking in the editor to show current syntax status
    const windowWithTrigger = window as typeof window & {
      triggerJavaErrorCheck?: () => void;
    };
    if (
      typeof window !== "undefined" &&
      windowWithTrigger.triggerJavaErrorCheck
    ) {
      windowWithTrigger.triggerJavaErrorCheck();
    }

    // Check syntax and always show the result
    const validation = javaSyntaxChecker.validateSyntax(currentCode);

    if (!validation.isValid) {
      // Don't proceed with compilation if there are syntax errors
      return;
    }

    setIsCompiling(true);

    try {
      // Get current user ID
      const userId = sessionUtils.getUserId();
      console.log(userId);
      if (!userId) {
        console.error("User not authenticated");
        return;
      }

      // Call checkCode API when syntax is valid
      const checkResult = await checkCode(userId, levelId, currentCode, locale);

      if (checkResult.success) {
        setSuccess(true);
        setIsDialogOpen(false);
        setShowLights(true);
        setFadeOutLights(false);

        // Show success message
        showRobotPersistent(t("successMessage"), {
          showCloseButton: false,
        });

        // Hide robot toast after a delay
        setTimeout(() => {
          hideRobotMessage();
        }, 3000);

        setTimeout(() => {
          setFadeOutLights(true);
          setTimeout(() => {
            setShowLights(false);
          }, 1000);
        }, 4000);
      } else {
        // Handle checkCode failure - check if error is an array of strings
        console.error("Code check failed:", checkResult.error);

        let errorMessage = t("errorPrefix");

        if (checkResult.error) {
          // Handle nested error structure
          let actualErrors: string[] = [];

          if (
            typeof checkResult.error === "object" &&
            checkResult.error !== null
          ) {
            // Check if error has a nested error property (like {success: false, error: [...]})
            if (
              "error" in checkResult.error &&
              Array.isArray(checkResult.error.error)
            ) {
              actualErrors = checkResult.error.error;
            } else if (Array.isArray(checkResult.error)) {
              actualErrors = checkResult.error;
            }
          } else if (typeof checkResult.error === "string") {
            actualErrors = [checkResult.error];
          }

          if (actualErrors.length > 0) {
            // Format array of errors as a numbered list
            errorMessage += "\n\n";
            actualErrors.forEach((error, index) => {
              errorMessage += `${index + 1}. ${error}\n`;
            });
            errorMessage = errorMessage.trim();
          } else {
            errorMessage += t("unknownError");
          }
        } else {
          errorMessage += t("unknownError");
        }

        // Show error message to user
        showRobotPersistent(errorMessage, {
          showCloseButton: true,
        });
      }
    } catch (error) {
      console.error("Error checking code:", error);
      // Handle error silently or show user feedback
      showRobotPersistent(t("networkError"), {
        showCloseButton: true,
      });
    } finally {
      setIsCompiling(false);
    }
  };

  // Handle dialog open change to show toast
  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);

    if (open) {
      // Show persistent robot toast when dialog opens with the task
      const taskMessage = levelData?.description || t("taskFallback");
      showRobotPersistent(taskMessage, {
        showCloseButton: false,
      });
    } else {
      // Hide toast when dialog closes
      hideRobotMessage();
    }
  };

  // Audio effects - Success sound
  useEffect(() => {
    if (success && audioEnabled) {
      // Reuse existing audio object or create new one
      if (!successAudioRef.current) {
        successAudioRef.current = new Audio("/assets/audio/power-on.mp3");
        successAudioRef.current.volume = 0.5;
      }

      successAudioRef.current.currentTime = 0;
      successAudioRef.current.play().catch((err) => {
        console.error("Power-on audio playback failed:", err);
      });
    }
  }, [success, audioEnabled]);

  // Audio effects - Error sound (only when not successful and audio enabled)
  useEffect(() => {
    if (!audioEnabled) return;

    if (!success) {
      // Clear any existing timeout
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = null;
      }

      // Reuse existing audio object or create new one
      if (!audioRef.current) {
        audioRef.current = new Audio("/assets/audio/error-robot.mp3");
        audioRef.current.volume = 0.5;
      }

      // Play sound once after 0.5s delay
      timeoutIdRef.current = setTimeout(() => {
        if (audioRef.current && !success && audioEnabled) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch((error) => {
            console.log("Audio playback failed:", error);
          });
        }
      }, 500);
    } else {
      // Clear error audio when successful
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = null;
      }
    }
  }, [success, audioEnabled]);

  return {
    // Level data
    levelData,
    isLoadingLevel,
    levelError,

    // UI state
    isDialogOpen,
    success,
    showLights,
    fadeOutLights,
    showConfirmDialog,

    // Code state
    currentCode,
    isCompiling,

    // Audio state
    audioEnabled,

    // Actions
    handleCodeChange,
    handleRunCode,
    handleDialogOpenChange,
    setAudioEnabled,
    setShowConfirmDialog,
    setSuccess,
    setShowLights,
    setFadeOutLights,
  };
}
