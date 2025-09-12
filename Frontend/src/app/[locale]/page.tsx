import React from "react";
import Map from "@/components/map/map";
import { useTranslations } from "next-intl";

// Force dynamic rendering to prevent static generation issues
export const dynamic = "force-dynamic";

function Page() {
  const t = useTranslations("home");

  return (
    <main className=" ">
      {/* <div className="container pb-10 mx-auto grid grid-cols-1 gap-y-24 w-full h-full">
        <Landing />
      </div> */}
      <div className="px-10 mx-auto grid grid-cols-1 gap-y-[200px] w-full h-full pt-20 overflow-hidden ">
        {/* Map Section with Title and Description */}
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-bold text-white animate-glow">
              {t("title")}
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {t("description")}
              <span className="text-metallic-accent font-semibold">
                {" "}
                {t("clickInstruction")}
              </span>{" "}
              {t("beginAdventure")}
            </p>
          </div>
        </div>
        <Map />
      </div>
    </main>
  );
}

export default Page;
