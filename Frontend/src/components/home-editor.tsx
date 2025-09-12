"use client";
import React from "react";
import JavaEditor from "./java-editor/JavaEditor";
import { HoverButton } from "./ui/hover-button";
import { IoMdSettings } from "react-icons/io";
import { Meteors } from "./ui/meteors";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

function HomeEditor() {
  const router = useRouter();
  const t = useTranslations("home.editor");
  const locale = useLocale();
  return (
    <div className="w-full max-w-7xl mx-auto">
      <div
        className={cn(
          "relative backdrop-blur-lg bg-[rgba(43,55,80,0.1)] shadow-xl w-full border border-gray-800 px-6 py-6 rounded-2xl",
          "before:shadow-[inset_0_0_0_1px_rgba(170,202,255,0.2),inset_0_0_16px_0_rgba(170,202,255,0.1),inset_0_-3px_12px_0_rgba(170,202,255,0.15),0_1px_3px_0_rgba(0,0,0,0.50),0_4px_12px_0_rgba(0,0,0,0.45)]",
          "before:mix-blend-multiply before:transition-transform before:duration-300",
          "overflow-hidden relative"
        )}
      >
        <div className="absolute w-full h-full top-0 left-0 z-10"></div>

        <div className="relative z-20 h-[600px]">
          <JavaEditor
            initialValue={`public class Main {\n    public static void main(String[] args) {\n        System.out.println("${t(
              "helloWorld"
            )}");\n    }\n}`}
          />
        </div>

        <Meteors number={20} />
      </div>

      <div className="flex justify-center mt-6">
        <HoverButton
          className="flex items-center gap-2 px-6 py-3"
          onClick={() => {
            router.push(`/${locale}/challenges`);
          }}
        >
          <IoMdSettings className="w-5 h-5" />
          {t("runCode")}
        </HoverButton>
      </div>
    </div>
  );
}

export default HomeEditor;
