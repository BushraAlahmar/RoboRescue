"use client";
import React, { useEffect } from "react";
import { useLocale } from "next-intl";
import { useGameStore } from "@/lib/store";
import { BASE_URL } from "@/app/[locale]/api-services";
import { getAllLevels, Level } from "@/lib/api/client";

interface Section {
  id: string;
  updatedAt: string | null;
  deletedAt: string | null;
  sectionNumber: number;
  description: string;
}

interface SectionWithLevels {
  sectionId: string;
  sectionNumber: number;
  levels: Level[];
}

interface ApiResponse {
  data: Section[];
  totalCount: number;
  pageSize: number;
  pageNumber: number;
  totalPages: number;
  nextPage: number | null;
  previousPage: number | null;
}

interface SectionsProviderProps {
  children: React.ReactNode;
}

export function SectionsProvider({ children }: SectionsProviderProps) {
  const locale = useLocale();
  const { setSections } = useGameStore();

  useEffect(() => {
    const fetchSectionsAndLevels = async () => {
      try {
        console.log("🔍 SectionsProvider: Fetching sections and levels...");

        // Fetch sections
        const sectionsResponse = await fetch(
          BASE_URL + "/section/getAll?lang=" + locale
        );

        if (!sectionsResponse.ok) {
          console.error("Failed to fetch sections");
          return;
        }

        const sectionsData: ApiResponse = await sectionsResponse.json();
        const sortedSections = sectionsData.data.sort(
          (a, b) => a.sectionNumber - b.sectionNumber
        );

        console.log(
          "🔍 SectionsProvider: Fetched sections:",
          sortedSections.length
        );

        // Fetch all levels
        const levelsResponse = await getAllLevels(
          {
            PageSize: 50,
            Asc: true,
          },
          locale
        );

        if (!levelsResponse.success || !levelsResponse.data) {
          console.error("Failed to fetch levels");
          return;
        }

        const allLevels = levelsResponse.data.data;
        console.log("🔍 SectionsProvider: Fetched levels:", allLevels.length);

        // Combine sections with their levels
        const sectionsWithLevels: SectionWithLevels[] = sortedSections.map(
          (section) => ({
            sectionId: section.id,
            sectionNumber: section.sectionNumber,
            levels: allLevels
              .filter((level) => level.sectionId === section.id)
              .sort((a, b) => a.levelNumber - b.levelNumber),
          })
        );

        console.log(
          "🔍 SectionsProvider: Combined sections with levels:",
          sectionsWithLevels
        );

        // Store in global store
        setSections(sectionsWithLevels);

        console.log("🔍 SectionsProvider: Sections stored in global store");
      } catch (error) {
        console.error("Error fetching sections and levels:", error);
      }
    };

    fetchSectionsAndLevels();
  }, [locale, setSections]);

  return <>{children}</>;
}
