"use client";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Loader from "../ui/loader";
import ReplayConfirmDialog from "./ReplayConfirmDialog";
import { useLocale, useTranslations } from "next-intl";
import {
  getAllLevels,
  getSectionsForMap,
  SectionForMap,
  sessionUtils,
  replaySection,
} from "@/lib/api/client";
import { useGameStore } from "@/lib/store";

function Map() {
  const router = useRouter();
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [showReplayDialog, setShowReplayDialog] = useState(false);
  const [replaySectionId, setReplaySectionId] = useState<string | null>(null);
  const [isReplaying, setIsReplaying] = useState(false);
  const locale = useLocale();
  const tMap = useTranslations("map");

  // Zustand store
  const { sections } = useGameStore();

  // Sections fetched specifically for the map, including user's last finished level per section
  const [mapSections, setMapSections] = useState<SectionForMap[]>([]);
  const [isFetchingSections, setIsFetchingSections] = useState(false);

  useEffect(() => {
    const fetchSections = async () => {
      if (!sessionUtils.isAuthenticated()) return;
      const userId = sessionUtils.getUserId();
      if (!userId) return;
      try {
        setIsFetchingSections(true);
        const res = await getSectionsForMap(userId, locale);
        if (res.success && res.data) {
          // Sort by sectionNumber to ensure stable layout order
          const sorted = [...res.data].sort(
            (a, b) => a.sectionNumber - b.sectionNumber
          );
          setMapSections(sorted);
        }
      } finally {
        setIsFetchingSections(false);
      }
    };
    fetchSections();
  }, [locale]);

  const handleLevelClick = async (sectionId: string) => {
    console.log("Section clicked:", sectionId);

    // Check if user is authenticated
    if (!sessionUtils.isAuthenticated()) {
      console.log("User not authenticated, redirecting to sign-in");
      router.push(`/${locale}/sign-in`);
      return;
    }

    // If authenticated, proceed with level selection
    // Show loading while determining whether to navigate or show dialog (no scale animation yet)
    setIsLoading(true);

    // Determine next level to navigate within the selected section
    try {
      const sectionFromApi = mapSections.find((s) => s.id === sectionId);

      // Desired next level number is last finished + 1; fallback to 1
      const desiredLevelNumber = Math.max(
        1,
        (sectionFromApi?.userLastLevelFinishNumber ?? 0) + 1
      );

      // Fetch all levels for that section to find the target level id
      const levelsRes = await getAllLevels({ SectionId: sectionId }, locale);
      let targetLevelId: string | null = null;

      if (levelsRes.success && levelsRes.data) {
        const allLevels = levelsRes.data.data || [];
        // Try exact desired level
        const exact = allLevels.find(
          (lvl) => lvl.levelNumber === desiredLevelNumber
        );
        if (exact) {
          targetLevelId = exact.id;
        } else {
          // Try the next available level greater than last finished
          const nextAvailable = allLevels
            .filter(
              (lvl) =>
                lvl.levelNumber >
                (sectionFromApi?.userLastLevelFinishNumber ?? 0)
            )
            .sort((a, b) => a.levelNumber - b.levelNumber)[0];
          if (nextAvailable) {
            targetLevelId = nextAvailable.id;
          } else if (allLevels.length > 0) {
            // User completed all levels in this section: ask for confirmation before replaying
            setIsLoading(false);
            setReplaySectionId(sectionId);
            setShowReplayDialog(true);
            return; // stop further navigation until user confirms
          }
        }
      }

      // Final fallback: use store sections if API didn't produce levels
      if (!targetLevelId) {
        const sectionFromStore = sections.find(
          (s) => s.sectionId === sectionId
        );
        targetLevelId = sectionFromStore?.levels?.[0]?.id ?? null;
      }

      if (targetLevelId) {
        console.log(
          "Navigating to:",
          `/${locale}/${sectionId}/${targetLevelId}`
        );
        // Show loading animation briefly before navigation
        setSelectedSectionId(sectionId);
        setIsLoading(true);
        setTimeout(() => {
          router.push(`/${locale}/${sectionId}/${targetLevelId}`);
        }, 1200);
      } else {
        // No more levels available, show replay dialog
        setIsLoading(false);
        setReplaySectionId(sectionId);
        setShowReplayDialog(true);
      }
    } catch (err) {
      console.error("Error determining next level:", err);
      setIsLoading(false);
    }
  };

  const handleReplaySection = async () => {
    if (!replaySectionId) return;

    const userId = sessionUtils.getUserId();
    if (!userId) return;

    setIsReplaying(true);
    try {
      const result = await replaySection(replaySectionId, userId);
      if (result.success) {
        // After successful replay, navigate to the first level of the section
        const levelsRes = await getAllLevels(
          { SectionId: replaySectionId },
          locale
        );
        if (levelsRes.success && levelsRes.data) {
          const allLevels = levelsRes.data.data || [];
          const firstLevel = [...allLevels].sort(
            (a, b) => a.levelNumber - b.levelNumber
          )[0];
          if (firstLevel) {
            setShowReplayDialog(false);
            setSelectedSectionId(replaySectionId);
            setIsLoading(true);
            setTimeout(() => {
              router.push(`/${locale}/${replaySectionId}/${firstLevel.id}`);
            }, 1200);
          }
        }
      }
    } catch (error) {
      console.error("Error replaying section:", error);
    } finally {
      setIsReplaying(false);
    }
  };

  const handleCancelReplay = () => {
    setShowReplayDialog(false);
    setReplaySectionId(null);
  };

  // Generate map levels from sections data
  const mapLevels = useMemo(() => {
    if (mapSections.length > 0) {
      return mapSections.map((section) => ({
        id: section.id,
        sectionNumber: section.sectionNumber,
        image: `/assets/images/map-${section.sectionNumber}.png`,
        description: `Section ${section.sectionNumber}`,
        levels: section.levels,
      }));
    }
    return sections.map((section) => ({
      id: section.sectionId,
      sectionNumber: section.sectionNumber,
      image: `/assets/images/map-${section.sectionNumber}.png`,
      description: `Section ${section.sectionNumber}`,
      levels: section.levels,
    }));
  }, [mapSections, sections]);

  if (
    isFetchingSections ||
    (sections.length === 0 && mapSections.length === 0)
  ) {
    return (
      <div className="relative w-full h-full md:min-h-[60vh] min-h-[40vh] flex items-center justify-center">
        <Loader message={tMap("loading")} />
        <div className="text-white text-sm mt-4">{tMap("loadingSections")}</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full md:min-h-[70vh] min-h-[50vh]  pt-20">
      <AnimatePresence>{isLoading && <Loader />}</AnimatePresence>

      <ReplayConfirmDialog
        open={showReplayDialog}
        isLoading={isReplaying}
        onCancel={handleCancelReplay}
        onConfirm={handleReplaySection}
        onViewSection={() => {
          if (!replaySectionId) return;
          router.push(`/${locale}/${replaySectionId}`);
        }}
      />
      <motion.div
        className="relative w-full max-w-[1250px] mx-auto h-full flex justify-center"
        animate={
          selectedSectionId
            ? {
                scale: [1, 2, 2.2],
                transition: {
                  duration: 1,
                  times: [0, 0.8, 1],
                  ease: "linear",
                },
              }
            : {}
        }
      >
        <Image
          src="/assets/images/map.png"
          alt={tMap("backgroundAlt")}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1250px"
          className="z-10 w-full mx-auto"
        />
        {mapLevels.map((section, index) => (
          <div
            key={section.id}
            style={{ left: `${(index + (index > 1 ? 1 : 0.3)) * 20}%` }}
            className={`absolute  left-0 w-[14%] cursor-pointer group transition-all duration-500 ease-out ${
              index === 1 || index === 2
                ? "h-[80%] top-[-35%]"
                : "h-[70%] top-[-8%]"
            }`}
            onClick={() => handleLevelClick(section.id)}
          >
            <div className="absolute top-0 left-0 w-full h-full  z-[9999] transition-all duration-500 "></div>

            <Image
              src={section.image}
              alt={tMap("sectionAlt", { sectionNumber: section.sectionNumber })}
              fill
              sizes="(max-width: 768px) 14vw, 14vw"
              className="!w-full mx-auto group-hover:scale-105 group-hover:-translate-y-4 transition-all duration-500 ease-out"
            />
          </div>
        ))}
      </motion.div>
      <motion.div
        className="fixed inset-0 pointer-events-none z-50"
        initial={{ opacity: 0 }}
        animate={
          selectedSectionId
            ? {
                opacity: [0, 0.5, 0.8],
                background: [
                  "radial-gradient(circle at center, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 100%)",
                  "radial-gradient(circle at center, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 100%)",
                  "radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 100%)",
                ],
                transition: {
                  duration: 1,
                  times: [0, 0.8, 1],
                  ease: "linear",
                },
              }
            : { opacity: 0 }
        }
      />
    </div>
  );
}

export default Map;
