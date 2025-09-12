"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import JavaEditor from "@/components/java-editor/JavaEditor";
import Loader from "@/components/ui/loader";
import { HoverButton } from "@/components/ui/hover-button";
import {
  getAllLevels,
  getPreviousCodeForLevel,
  Level,
  sessionUtils,
} from "@/lib/api/client";

export default function SectionLevelsPage() {
  const tDialog = useTranslations("level.dialog");
  const tProgress = useTranslations("level.progress");
  const locale = useLocale();
  const router = useRouter();
  const routeParams = useParams();
  const sectionId = (routeParams?.level as string) || "";

  const [levels, setLevels] = useState<Level[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [isLoadingLevels, setIsLoadingLevels] = useState(false);
  const [isLoadingCode, setIsLoadingCode] = useState(false);
  const [previousCode, setPreviousCode] = useState<string>("");

  useEffect(() => {
    if (!sectionId) return;
    const fetchLevels = async () => {
      setIsLoadingLevels(true);
      try {
        const res = await getAllLevels({ SectionId: sectionId }, locale);
        if (res.success && res.data) {
          setLevels(res.data.data || []);
        }
      } finally {
        setIsLoadingLevels(false);
      }
    };
    fetchLevels();
  }, [sectionId, locale]);

  const handleSelectLevel = async (level: Level) => {
    setSelectedLevel(level);
    setIsLoadingCode(true);
    try {
      const userId = sessionUtils.getUserId();
      if (userId) {
        const res = await getPreviousCodeForLevel(level.id, userId);
        if (res.success && res.data && res.data.trim()) {
          setPreviousCode(res.data);
        } else {
          setPreviousCode(level.task || level.description || "");
        }
      } else {
        setPreviousCode(level.task || level.description || "");
      }
    } finally {
      setIsLoadingCode(false);
    }
  };

  const goBack = () => router.push(`/${locale}`);

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">
          {tDialog("allLevelsInSection")}
        </h1>
        <HoverButton onClick={goBack}>{tDialog("backToLevels")}</HoverButton>
      </div>

      {isLoadingLevels ? (
        <div className="flex justify-center items-center h-[200px]">
          <Loader />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            {levels.map((lvl) => (
              <div
                key={lvl.id}
                className="p-4 rounded-lg border border-metallic-dark bg-white/10 backdrop-blur-sm"
              >
                <div className="grid grid-cols-4 gap-5 items-center justify-between">
                  <div className="col-span-3">
                    <div className="text-white font-medium">
                      {tProgress("level")} {lvl.levelNumber}: {lvl.name}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                      {lvl.description}
                    </div>
                  </div>
                  <HoverButton
                    className="col-span-1"
                    onClick={() => handleSelectLevel(lvl)}
                  >
                    {tDialog("viewCode")}
                  </HoverButton>
                </div>
              </div>
            ))}
          </div>

          <div className="min-h[400px] rounded-lg border border-metallic-dark bg-white/10 backdrop-blur-sm p-4">
            {selectedLevel ? (
              isLoadingCode ? (
                <div className="flex justify-center items-center h-[380px]">
                  <Loader />
                </div>
              ) : (
                <>
                  <div className="mb-2 text-sm text-gray-400">
                    {tDialog("codeForLevel", {
                      levelNumber: selectedLevel.levelNumber,
                    })}
                  </div>
                  <JavaEditor
                    initialValue={previousCode}
                    readOnly
                    enableSyntaxCheck={false}
                  />
                </>
              )
            ) : (
              <div className="text-gray-400 h-full flex items-center justify-center">
                {tDialog("loadingCode")}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
