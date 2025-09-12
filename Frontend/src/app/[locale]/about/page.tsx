"use client";
import React from "react";
import { motion } from "framer-motion";
import * as lucideReact from "lucide-react";
import { useTranslations } from "next-intl";

function Page() {
  const t = useTranslations("about");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const departmentIcons = [
    <lucideReact.Layers key="dept-0" className="w-6 h-6" />, // Abstraction
    <lucideReact.GitBranch key="dept-1" className="w-6 h-6" />, // Inheritance
    <lucideReact.Shapes key="dept-2" className="w-6 h-6" />, // Polymorphism
    <lucideReact.Cpu key="dept-3" className="w-6 h-6" />, // Concurrency
  ];

  const skillIcons = [
    <lucideReact.Layers key="skill-0" className="w-6 h-6" />, // Abstraction
    <lucideReact.GitBranch key="skill-1" className="w-6 h-6" />, // Inheritance
    <lucideReact.Shapes key="skill-2" className="w-6 h-6" />, // Polymorphism
    <lucideReact.Cpu key="skill-3" className="w-6 h-6" />, // Concurrency
  ];

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-3xl font-bold mb-8 relative text-center">
      <span className="relative inline-block text-white">{children}</span>
    </h2>
  );

  return (
    <div className="min-h-[100dvh] w-full py-36 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-24"
        >
          {/* Hero Section */}
          <div className="space-y-10">
            <motion.div variants={itemVariants} className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 relative group">
                <span className="relative inline-block text-white">
                  {t("title")}
                </span>
              </h1>
              <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-metallic-accent">
                {t("subtitle")}
              </h2>
              <p className="text-white/80 max-w-3xl mx-auto text-lg leading-relaxed">
                {t("description")}
              </p>
            </motion.div>
          </div>

          {/* Mission Section */}
          <motion.div variants={itemVariants}>
            <SectionTitle>{t("mission.title")}</SectionTitle>
            <div className="px-8 py-12 rounded-2xl bg-metallic-light/5 backdrop-blur-lg border border-white/10">
              <div className="max-w-4xl mx-auto space-y-8">
                <p className="text-white/80 leading-relaxed text-center text-lg">
                  {t("mission.description")}
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  {(t.raw("mission.points") as string[])?.map(
                    (point: string, index: number) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-metallic-accent rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-white/70">{point}</p>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Game Concept Section */}
          <motion.div variants={itemVariants}>
            <SectionTitle>{t("gameContent.title")}</SectionTitle>

            {/* Rescue Mission */}
            <div className="mb-12">
              <div className="p-8 rounded-2xl bg-gradient-to-r from-metallic-accent/10 to-metallic-light/10 border border-metallic-accent/20 mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <lucideReact.Zap className="w-8 h-8 text-metallic-accent" />
                  <h3 className="text-2xl font-bold text-white">
                    {t("gameContent.rescueMission.title")}
                  </h3>
                </div>
                <p className="text-white/80 leading-relaxed text-lg">
                  {t("gameContent.rescueMission.description")}
                </p>
              </div>
            </div>

            {/* Challenge - Departments */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <lucideReact.AlertTriangle className="w-6 h-6 text-metallic-accent" />
                {t("gameContent.challenge.title")}
              </h3>
              <p className="text-white/80 mb-8 text-lg">
                {t("gameContent.challenge.description")}
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                {(
                  t.raw("gameContent.challenge.departments") as {
                    name: string;
                    description: string;
                  }[]
                )?.map(
                  (
                    dept: { name: string; description: string },
                    index: number
                  ) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      className="p-6 rounded-xl bg-metallic-light/5 border border-white/10 hover:border-metallic-accent/30 transition-all duration-300"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-metallic-accent/20 rounded-full flex items-center justify-center">
                          {departmentIcons[index]}
                        </div>
                        <h4 className="text-lg font-semibold text-white">
                          {dept.name}
                        </h4>
                      </div>
                      <p className="text-white/70">{dept.description}</p>
                    </motion.div>
                  )
                )}
              </div>
            </div>

            {/* Objectives */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <lucideReact.Target className="w-6 h-6 text-metallic-accent" />
                {t("gameContent.objectives.title")}
              </h3>
              <p className="text-white/80 mb-8 text-lg">
                {t("gameContent.objectives.description")}
              </p>

              <div className="grid gap-8">
                {(
                  t.raw("gameContent.objectives.skills") as {
                    title: string;
                    points: string[];
                  }[]
                )?.map(
                  (
                    skill: { title: string; points: string[] },
                    index: number
                  ) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      className="p-6 rounded-xl bg-metallic-light/5 border border-white/10"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-metallic-accent/20 rounded-full flex items-center justify-center">
                          {skillIcons[index]}
                        </div>
                        <h4 className="text-xl font-semibold text-white">
                          {skill.title}
                        </h4>
                      </div>
                      <div className="space-y-2">
                        {skill.points.map(
                          (point: string, pointIndex: number) => (
                            <div
                              key={pointIndex}
                              className="flex items-start gap-3"
                            >
                              <div className="w-1.5 h-1.5 bg-metallic-accent rounded-full mt-2 flex-shrink-0"></div>
                              <p className="text-white/70">{point}</p>
                            </div>
                          )
                        )}
                      </div>
                    </motion.div>
                  )
                )}
              </div>
            </div>
          </motion.div>

          {/* Contact Section */}
          <motion.div variants={itemVariants}>
            <SectionTitle>{t("contact.title")}</SectionTitle>
            <div className="p-8 rounded-2xl bg-metallic-light/5 backdrop-blur-lg border border-white/10 text-center">
              <p className="text-white/80 mb-6 text-lg">
                {t("contact.description")}
              </p>
              <div className="space-y-3">
                <p className="text-white font-semibold">
                  {t("contact.developer")}
                </p>
                <p className="text-metallic-accent">{t("contact.email")}</p>
              </div>
            </div>
          </motion.div>

          {/* Hero Journey Section */}
          <motion.div variants={itemVariants}>
            <div className="text-center space-y-8">
              <div className="p-8 rounded-2xl bg-gradient-to-r from-metallic-accent/20 to-metallic-light/20 border border-metallic-accent/30">
                <h3 className="text-3xl font-bold text-white mb-4 flex items-center justify-center gap-3">
                  <lucideReact.Shield className="w-8 h-8 text-metallic-accent" />
                  {t("hero.title")}
                </h3>
                <p className="text-white/80 max-w-3xl mx-auto text-lg leading-relaxed mb-8">
                  {t("hero.description")}
                </p>

                <div className="mb-8">
                  <h4 className="text-xl font-semibold text-white mb-6">
                    {t("hero.journey.title")}
                  </h4>
                  <div className="grid md:grid-cols-5 gap-4">
                    {(t.raw("hero.journey.steps") as string[])?.map(
                      (step: string, index: number) => (
                        <div key={index} className="flex flex-col items-center">
                          <div className="w-12 h-12 bg-metallic-accent/20 rounded-full flex items-center justify-center mb-3">
                            <span className="text-metallic-accent font-bold">
                              {index + 1}
                            </span>
                          </div>
                          <p className="text-white/70 text-sm text-center">
                            {step}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div className="text-2xl font-bold text-metallic-accent">
                  {t("hero.tagline")}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default Page;
