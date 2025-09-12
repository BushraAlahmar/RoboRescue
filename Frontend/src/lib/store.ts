import { create } from "zustand";
import { Level, UserLevel } from "./api/client";

interface SectionWithLevels {
  sectionId: string;
  sectionNumber: number;
  levels: Level[];
}

interface GameStore {
  sections: SectionWithLevels[];
  userLevels: UserLevel[];
  currentLevel: Level | null;
  nextLevel: Level | null;

  // Actions
  setSections: (sections: SectionWithLevels[]) => void;
  setUserLevels: (userLevels: UserLevel[]) => void;
  setCurrentLevel: (level: Level | null) => void;
  setNextLevel: (level: Level | null) => void;

  // Computed actions
  findNextLevel: (currentLevelId: string) => Level | null;
  isLastLevel: (levelId: string) => boolean;
  getSectionByLevelId: (levelId: string) => SectionWithLevels | null;
  getCurrentSection: () => SectionWithLevels | null;
  getNextSection: () => SectionWithLevels | null;
  getUserCurrentLevel: () => Level | null;
}

export const useGameStore = create<GameStore>((set, get) => ({
  sections: [],
  userLevels: [],
  currentLevel: null,
  nextLevel: null,

  setSections: (sections) => set({ sections }),
  setUserLevels: (userLevels) => set({ userLevels }),
  setCurrentLevel: (level) => set({ currentLevel: level }),
  setNextLevel: (level) => set({ nextLevel: level }),

  findNextLevel: (currentLevelId: string) => {
    const { sections } = get();

    console.log("🔍 findNextLevel called with:", currentLevelId);
    console.log("🔍 Available sections:", sections);

    // First try to find the level in the sections array
    let currentLevel: Level | null = null;
    let currentSection: SectionWithLevels | null = null;

    // Sort sections by section number to ensure proper order
    const sortedSections = [...sections].sort(
      (a, b) => a.sectionNumber - b.sectionNumber
    );

    // Find current level and section
    for (const section of sortedSections) {
      // Sort levels within section by level number
      const sortedLevels = [...section.levels].sort(
        (a, b) => a.levelNumber - b.levelNumber
      );
      const level = sortedLevels.find((l) => l.id === currentLevelId);
      if (level) {
        currentLevel = level;
        currentSection = { ...section, levels: sortedLevels };
        break;
      }
    }

    console.log("🔍 Current level found:", currentLevel);
    console.log("🔍 Current section found:", currentSection);

    if (!currentLevel || !currentSection) {
      console.log("❌ No current level or section found");
      return null;
    }

    // Find next level in same section
    const nextLevelInSection = currentSection.levels.find(
      (l) => l.levelNumber === currentLevel!.levelNumber + 1
    );

    console.log("🔍 Next level in same section:", nextLevelInSection);

    if (nextLevelInSection) {
      return nextLevelInSection;
    }

    // If no next level in same section, find first level of next section
    const currentSectionIndex = sortedSections.findIndex(
      (s) => s.sectionNumber === currentSection!.sectionNumber
    );

    if (currentSectionIndex === -1) {
      console.log("❌ Could not find current section index");
      return null;
    }

    const nextSection = sortedSections[currentSectionIndex + 1];
    console.log("🔍 Next section found:", nextSection);

    if (nextSection && nextSection.levels.length > 0) {
      // Sort levels in next section and get the first one
      const sortedNextLevels = [...nextSection.levels].sort(
        (a, b) => a.levelNumber - b.levelNumber
      );
      console.log(
        "🔍 Returning first level of next section:",
        sortedNextLevels[0]
      );
      return sortedNextLevels[0];
    }

    // If we reach here, we're at the last level of the last section
    console.log("❌ No next level found - user is at the last level");
    return null;
  },

  // Helper function to check if a level is the last level
  isLastLevel: (levelId: string) => {
    const { sections } = get();

    // Find current level and section
    let currentLevel: Level | null = null;
    let currentSection: SectionWithLevels | null = null;

    for (const section of sections) {
      const level = section.levels.find((l) => l.id === levelId);
      if (level) {
        currentLevel = level;
        currentSection = section;
        break;
      }
    }

    if (!currentLevel || !currentSection) return false;

    // Check if there's a next level in the same section
    const nextLevelInSection = currentSection.levels.find(
      (l) => l.levelNumber === currentLevel!.levelNumber + 1
    );

    if (nextLevelInSection) return false;

    // Check if there's a next section with levels
    const nextSection = sections.find(
      (s) => s.sectionNumber === currentSection!.sectionNumber + 1
    );

    if (nextSection && nextSection.levels.length > 0) return false;

    // If we reach here, this is the last level
    return true;
  },

  getSectionByLevelId: (levelId: string) => {
    const { sections } = get();
    return (
      sections.find((section) =>
        section.levels.some((level) => level.id === levelId)
      ) || null
    );
  },

  getCurrentSection: () => {
    const { currentLevel, sections } = get();
    if (!currentLevel) return null;

    return (
      sections.find((section) =>
        section.levels.some((level) => level.id === currentLevel.id)
      ) || null
    );
  },

  getNextSection: () => {
    const { currentLevel, sections } = get();
    if (!currentLevel) return null;

    const currentSection = get().getCurrentSection();
    if (!currentSection) return null;

    return (
      sections.find(
        (s) => s.sectionNumber === currentSection.sectionNumber + 1
      ) || null
    );
  },

  // Get the user's current level (next level they should access)
  getUserCurrentLevel: () => {
    const { userLevels, sections } = get();

    if (userLevels.length === 0) return null;

    // Find the highest level number among user's completed levels
    const highestUserLevel = userLevels.reduce((highest, current) => {
      return current.levelNumber > highest.levelNumber ? current : highest;
    });

    // Find the next level after the highest completed level
    const nextLevel = sections
      .flatMap((section) => section.levels)
      .find(
        (level) =>
          level.sectionId === highestUserLevel.sectionId &&
          level.levelNumber === highestUserLevel.levelNumber + 1
      );

    // If there's a next level in the same section, return it
    if (nextLevel) return nextLevel;

    // If no next level in same section, find the first level of the next section
    const currentSection = sections.find(
      (s) => s.sectionId === highestUserLevel.sectionId
    );
    if (currentSection) {
      const nextSection = sections.find(
        (s) => s.sectionNumber === currentSection.sectionNumber + 1
      );
      if (nextSection) {
        const firstLevelOfNextSection = nextSection.levels.find(
          (level) => level.levelNumber === 1
        );
        if (firstLevelOfNextSection) return firstLevelOfNextSection;
      }
    }

    // If no next level found, return the highest completed level
    const lastCompletedLevel = sections
      .flatMap((section) => section.levels)
      .find((level) => level.id === highestUserLevel.id);

    return lastCompletedLevel || null;
  },
}));
