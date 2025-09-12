// "use client";

// import { motion } from "framer-motion";
// import Map from "@/components/map/map";
// import { useTranslations } from "next-intl";

// export default function ChallengesPage() {
//   const t = useTranslations("challenges");
//   return (
//     <main className="relative min-h-screen overflow-hidden py-24">
//       {/* Background */}
//       <div
//         className="absolute inset-0 bg-cover bg-center bg-no-repeat"
//         // style={{
//         //     backgroundImage: "url('/assets/images/BB.jpg')",
//         // }}
//       >
//         <div className="absolute inset-0 bg-black/60" />
//       </div>

//       {/* Grid Background Overlay */}
//       <div className="absolute inset-0 opacity-20">
//         <div className="h-full w-full bg-gradient-to-br from-metallic-dark via-transparent to-metallic-accent/20" />
//         <div
//           className="absolute inset-0 opacity-30"
//           style={{
//             backgroundImage: `
//                             linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
//                             linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
//                         `,
//             backgroundSize: "50px 50px",
//           }}
//         />
//       </div>

//       {/* Main Content */}
//       <div className="relative z-10">
//         {/* Page Header */}
//         <motion.div
//           className="text-center pt-20 pb-16 px-8"
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//         >
//           <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-glow">
//             {t("title")}
//           </h1>
//           <p className="text-xl md:text-2xl text-gray-300 max-w-7xl mx-auto leading-relaxed">
//             {t("description")}
//           </p>
//         </motion.div>

//         {/* Map Section */}
//         <div className="px-10 mx-auto w-full h-full pb-32 overflow-hidden">
//           {/* Map Section with Title and Description */}
//           <motion.div
//             className="text-center space-y-8"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8, delay: 0.3 }}
//           >
//             <div className="space-y-4">
//               <h2 className="text-4xl md:text-6xl font-bold text-white animate-glow">
//                 {t("mapTitle")}
//               </h2>
//               <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
//                 {t("mapDescription")}
//                 <span className="text-metallic-accent font-semibold">
//                   {" "}
//                   {t("clickToStart")}
//                 </span>{" "}
//                 {t("toBegin")}
//               </p>
//               {/* <div className="flex justify-center gap-4 text-sm text-gray-400">
//                                 <div className="flex items-center gap-2">
//                                     <div className="w-3 h-3 bg-metallic-accent rounded-full animate-pulse"></div>
//                                     <span>Available Levels</span>
//                                 </div>
//                                 <div className="flex items-center gap-2">
//                                     <div className="w-3 h-3 bg-green-500 rounded-full"></div>
//                                     <span>Completed</span>
//                                 </div>
//                                 <div className="flex items-center gap-2">
//                                     <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
//                                     <span>Locked</span>
//                                 </div>
//                             </div> */}
//             </div>
//           </motion.div>

//           {/* Map Component */}
//           <motion.div
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.8, delay: 0.6 }}
//             className="px-10 mx-auto grid grid-cols-1 gap-y-24 w-full h-full pt-32 overflow-hidden "
//           >
//             <Map />
//           </motion.div>
//         </div>
//       </div>
//     </main>
//   );
// }

import React from "react";

function page() {
  return <div>page</div>;
}

export default page;
