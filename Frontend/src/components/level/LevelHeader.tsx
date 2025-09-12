import { AlertTriangle } from "lucide-react";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { BASE_URL } from "@/app/[locale]/api-services";

interface SectionData {
  id: string;
  updatedAt: string;
  deletedAt: string | null;
  name: string;
  enName: string;
  sectionNumber: number;
  description: string;
  enDescription: string;
}

interface LevelHeaderProps {
  sectionNumber: number;
}

export function LevelHeader({ sectionNumber }: LevelHeaderProps) {
  const locale = useLocale();
  const [sectionData, setSectionData] = useState<SectionData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetch(`${BASE_URL}/section/getAll?Lang=${locale}`);
        const dataJson = await data.json();
        // Find the section data for the current section number
        const currentSection = dataJson.data?.find(
          (section: SectionData) => section.sectionNumber === sectionNumber
        );
        setSectionData(currentSection || null);
      } catch (error) {
        console.error("Error fetching section data:", error);
        setSectionData(null);
      }
    };
    fetchData();
  }, [locale, sectionNumber]);

  if (sectionData) {
    return (
      <div className="text-center mb-8 animate-fade-in max-w-3xl">
        <div className="flex items-center justify-center mb-4">
          <AlertTriangle className="w-16 h-16 text-red-500 animate-bounce" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-glow">
          {locale === "en" ? sectionData.enName : sectionData.name}
        </h1>
        <p className="text-xl text-red-300 animate-pulse">
          {locale === "en"
            ? sectionData.enDescription
            : sectionData.description}
        </p>
      </div>
    );
  }

  return null;
}
