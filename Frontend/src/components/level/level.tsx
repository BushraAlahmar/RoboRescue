"use client";

import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";
import JavaEditor from "../java-editor/JavaEditor";
import { Meteors } from "../ui/meteors";
import { HoverButton } from "../ui/hover-button";
import { IoMdSettings } from "react-icons/io";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

function Level() {
  const [animationData, setAnimationData] = useState(null);
  const t = useTranslations("level.polymorphism");

  useEffect(() => {
    const loadAnimation = async () => {
      try {
        const response = await fetch("/assets/images/error-robot.json");
        const data = await response.json();
        setAnimationData(data);
      } catch (error) {
        console.error("Error loading animation:", error);
      }
    };
    loadAnimation();
  }, []);

  return (
    <div className="mx-auto min-h-screen">
      <div className="w-full h-full pb-10 pt-24 relative text-white flex items-center justify-center">
        <div className="flex flex-col lg:flex-row items-center justify-between container w-full gap-8 px-4">
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between w-full gap-8">
            <div className="w-full lg:basis-1/4 overflow-hidden">
              <div className="w-full max-w-[400px] h-[300px] lg:h-[400px] animate-float mx-auto">
                {animationData && (
                  <Lottie
                    animationData={animationData}
                    loop={true}
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                  />
                )}
              </div>
            </div>
            <div className="w-full lg:basis-2/4">
              <h3 className="text-2xl font-bold mb-8 text-blue-400 text-center lg:text-left">
                {t("title")}
              </h3>
              <div className="mb-6 text-start">
                <h4 className="text-xl font-semibold mb-4 text-blue-300">
                  {t("exercise")}
                </h4>
                <p className="text-gray-300 mb-4">{t("description")}</p>
                <ol className="list-decimal list-inside text-gray-300 space-y-2">
                  <li>
                    Create an abstract{" "}
                    <code className="text-blue-400">Robot</code> class with an
                    abstract{" "}
                    <code className="text-blue-400">performTask()</code> method
                  </li>
                  <li>
                    Create three robot types:{" "}
                    <code className="text-blue-400">CleaningRobot</code>,{" "}
                    <code className="text-blue-400">AssemblyRobot</code>, and{" "}
                    <code className="text-blue-400">WeldingRobot</code>
                  </li>
                  <li>
                    Each robot should implement{" "}
                    <code className="text-blue-400">performTask()</code> with
                    its specific behavior
                  </li>
                  <li>
                    Create a <code className="text-blue-400">RobotFactory</code>{" "}
                    class that can create any type of robot
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full relative px-4">
        <div
          className={cn(
            "relative backdrop-blur-lg bg-[rgba(43,55,80,0.1)] shadow-xl max-w-screen-2xl mx-auto w-full border border-gray-800 px-4 py-8 h-full overflow-hidden rounded-2xl items-start",
            "before:shadow-[inset_0_0_0_1px_rgba(170,202,255,0.2),inset_0_0_16px_0_rgba(170,202,255,0.1),inset_0_-3px_12px_0_rgba(170,202,255,0.15),0_1px_3px_0_rgba(0,0,0,0.50),0_4px_12px_0_rgba(0,0,0,0.45)]",
            "before:mix-blend-multiply before:transition-transform before:duration-300",
            "overflow-hidden"
          )}
        >
          <div className="absolute w-full h-full top-0 left-0 z-0"></div>

          <JavaEditor />

          <Meteors number={20} />
        </div>
        <HoverButton className="flex items-center gap-1 mx-auto mt-10">
          <IoMdSettings /> {t("controls.runCode")}
        </HoverButton>
      </div>
    </div>
  );
}

export default Level;
