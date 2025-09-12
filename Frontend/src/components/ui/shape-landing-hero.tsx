"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { AiFillTool } from "react-icons/ai";
import { IoMdSettings } from "react-icons/io";
import { GiRobotGrab } from "react-icons/gi";

function ElegantShape({
    className,
    delay = 0,
    width = 400,
    height = 100,
    rotate = 0,
    icon: Icon,
}: {
    className?: string;
    delay?: number;
    width?: number;
    height?: number;
    rotate?: number;
    icon: React.ElementType;
}) {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [rotation, setRotation] = useState(rotate);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const moveShape = () => {
            if (!containerRef.current) return;

            const container = containerRef.current;
            const containerRect = container.getBoundingClientRect();

            const padding = 50;
            const maxX = Math.max(0, containerRect.width - width - padding * 2);
            const maxY = Math.max(
                0,
                containerRect.height - height - padding * 2
            );

            const newX = padding + Math.random() * maxX;
            const newY = padding + Math.random() * maxY;
            const newRotation = rotate + (Math.random() * 120 - 60);

            setPosition({ x: newX, y: newY });
            setRotation(newRotation);
        };

        moveShape();
        const interval = setInterval(moveShape, 1500);

        return () => clearInterval(interval);
    }, [width, height, rotate]);

    return (
        <motion.div
            initial={{
                opacity: 0,
                y: -150,
                rotate: rotate - 15,
            }}
            animate={{
                opacity: 1,
                y: 0,
                rotate: rotate,
            }}
            transition={{
                duration: 2.4,
                delay,
                ease: [0.23, 0.86, 0.39, 0.96],
                opacity: { duration: 1.2 },
            }}
            className={cn("absolute", className)}
            ref={containerRef}
        >
            <motion.div
                animate={{
                    x: position.x,
                    y: position.y,
                    rotate: rotation,
                }}
                transition={{
                    duration: 2,
                    ease: [0.4, 0, 0.2, 1],
                    rotate: {
                        duration: 2.5,
                        ease: [0.4, 0, 0.2, 1],
                    },
                }}
                style={{
                    width,
                    height,
                }}
                className="relative"
            >
                <motion.div
                    animate={{
                        y: [0, 15, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 5,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                    }}
                    className="flex items-center justify-center"
                >
                    <Icon className="w-32 h-32 text-metallic-light/80" />
                </motion.div>
            </motion.div>
        </motion.div>
    );
}

function HeroGeometric() {
    return (
        <div className="fixed bg-metallic-dark inset-0 w-full h-full flex items-center justify-center overflow-hidden ">
            <div className="fixed inset-0 bg-gradient-to-br from-metallic-accent/[0.05] via-transparent to-metallic-accent/[0.05] blur-3xl" />

            <div className="fixed inset-0 overflow-hidden">
                <ElegantShape
                    delay={0.3}
                    width={800}
                    height={200}
                    rotate={12}
                    className="left-[0%] top-[15%]"
                    icon={AiFillTool}
                />

                <ElegantShape
                    delay={0.5}
                    width={700}
                    height={180}
                    rotate={-15}
                    className="right-[0%] top-[1%]"
                    icon={IoMdSettings}
                />

                <ElegantShape
                    delay={0.4}
                    width={600}
                    height={160}
                    rotate={-8}
                    className="left-[-10%] bottom-[5%]"
                    icon={GiRobotGrab}
                />

                <ElegantShape
                    delay={0.6}
                    width={500}
                    height={140}
                    rotate={20}
                    className="right-[1%] top-[25%]"
                    icon={AiFillTool}
                />

                <ElegantShape
                    delay={0.7}
                    width={400}
                    height={120}
                    rotate={-25}
                    className="left-[2%] top-[1%]"
                    icon={IoMdSettings}
                />

                <ElegantShape
                    delay={0.8}
                    width={300}
                    height={100}
                    rotate={15}
                    className="right-[2.5%] bottom-[20%]"
                    icon={GiRobotGrab}
                />

                <ElegantShape
                    delay={0.9}
                    width={900}
                    height={220}
                    rotate={-30}
                    className="left-[0%] top-[1%]"
                    icon={AiFillTool}
                />

                <ElegantShape
                    delay={1.0}
                    width={750}
                    height={190}
                    rotate={25}
                    className="right-[3.5%] top-[4%]"
                    icon={IoMdSettings}
                />

                <ElegantShape
                    delay={1.1}
                    width={650}
                    height={170}
                    rotate={-18}
                    className="left-[0%] bottom-[40%]"
                    icon={GiRobotGrab}
                />
            </div>

            <div className="fixed inset-0 bg-gradient-to-t from-metallic-dark via-transparent to-metallic-dark/80 pointer-events-none" />
        </div>
    );
}
export { HeroGeometric };
