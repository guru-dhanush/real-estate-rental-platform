// import { useState, useEffect } from "react";
// import { Calendar, Sun, Snowflake, Leaf, ArrowRight } from "lucide-react";
// import { Button } from "@/components/ui/button";

// type Season = "summer" | "winter" | "autumn" | "spring";

// const getCurrentSeason = (): Season => {
//   const month = new Date().getMonth();

//   if (month >= 2 && month <= 4) return "spring";
//   if (month >= 5 && month <= 7) return "summer";
//   if (month >= 8 && month <= 10) return "autumn";
//   return "winter";
// };

// const SeasonalPromotions = () => {
//   const [currentSeason, setCurrentSeason] = useState<Season>(
//     getCurrentSeason()
//   );

//   // For demo purposes, let's allow changing seasons with a button
//   const rotateSeason = () => {
//     const seasons: Season[] = ["winter", "spring", "summer", "autumn"];
//     const currentIndex = seasons.indexOf(currentSeason);
//     const nextIndex = (currentIndex + 1) % seasons.length;
//     setCurrentSeason(seasons[nextIndex]);
//   };

//   // Season-specific content
//   const seasonData = {
//     summer: {
//       title: "Summer Escape Deals",
//       description:
//         "Unlock special rates on beach houses and lakeside properties for your perfect summer getaway.",
//       icon: <Sun className="h-8 w-8" />,
//       color: "from-amber-500 to-orange-600",
//       bgClass: "bg-gradient-to-r from-amber-50 to-orange-50",
//       textClass: "text-orange-600",
//       image:
//         "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
//     },
//     winter: {
//       title: "Winter Wonderland Retreats",
//       description:
//         "Cozy cabins and ski-in/ski-out chalets with special seasonal discounts.",
//       icon: <Snowflake className="h-8 w-8" />,
//       color: "from-blue-500 to-indigo-600",
//       bgClass: "bg-gradient-to-r from-blue-50 to-indigo-50",
//       textClass: "text-blue-600",
//       image:
//         "https://images.unsplash.com/photo-1418985991508-e47386d96a71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
//     },
//     autumn: {
//       title: "Fall Foliage Getaways",
//       description:
//         "Experience the beauty of autumn with special rates on countryside retreats and mountain cabins.",
//       icon: <Leaf className="h-8 w-8" />,
//       color: "from-amber-600 to-red-600",
//       bgClass: "bg-gradient-to-r from-amber-50 to-red-50",
//       textClass: "text-amber-700",
//       image:
//         "https://images.unsplash.com/photo-1477414956199-7dafc86a4f1a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
//     },
//     spring: {
//       title: "Spring Renewal Escapes",
//       description:
//         "Refresh and rejuvenate with special offers on garden view apartments and countryside cottages.",
//       icon: <Calendar className="h-8 w-8" />,
//       color: "from-green-500 to-emerald-600",
//       bgClass: "bg-gradient-to-r from-green-50 to-emerald-50",
//       textClass: "text-emerald-600",
//       image:
//         "https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
//     },
//   };

//   const { title, description, icon, color, bgClass, textClass, image } =
//     seasonData[currentSeason];

//   return (
//     <section className={`py-16 ${bgClass}`}>
//       <div className="container mx-auto px-4">
//         <div className="flex flex-col lg:flex-row items-center gap-8">
//           {/* Left image */}
//           <div className="w-full lg:w-1/2 mb-8 lg:mb-0">
//             <div className="relative">
//               <div className="absolute -inset-4 bg-white/50 rounded-3xl blur-lg -z-10"></div>
//               <div className="relative overflow-hidden rounded-2xl shadow-elevated">
//                 <img
//                   src={image}
//                   alt={`${currentSeason} promotion`}
//                   className="w-full h-[400px] object-cover transition-transform duration-700 hover:scale-105"
//                 />
//                 <div
//                   className={`absolute top-4 left-4 bg-gradient-to-r ${color} text-white px-4 py-2 rounded-full flex items-center`}
//                 >
//                   {icon}
//                   <span className="ml-2 font-medium">
//                     {currentSeason.charAt(0).toUpperCase() +
//                       currentSeason.slice(1)}{" "}
//                     Special
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right content */}
//           <div className="w-full lg:w-1/2">
//             <div className="max-w-lg">
//               <div className="flex items-center mb-4">
//                 <div className={`p-3 rounded-full ${textClass} bg-white`}>
//                   {icon}
//                 </div>
//                 <button
//                   onClick={rotateSeason}
//                   className="ml-4 text-sm text-gray-500 flex items-center border border-gray-200 rounded-full px-3 py-1 hover:bg-gray-50"
//                 >
//                   <span>Change Season</span>
//                   <ArrowRight className="ml-1 h-3 w-3" />
//                 </button>
//               </div>

//               <h2 className="section-title mb-4">{title}</h2>
//               <p className="text-lg text-gray-600 mb-8">{description}</p>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
//                 <div className="bg-white p-5 rounded-xl shadow-soft">
//                   <div className="flex items-center mb-3">
//                     <div
//                       className={`w-8 h-8 rounded-full flex items-center justify-center ${textClass} bg-gray-100`}
//                     >
//                       <span className="text-sm font-bold">1</span>
//                     </div>
//                     <h3 className="ml-3 font-semibold">Limited-Time Pricing</h3>
//                   </div>
//                   <p className="text-gray-600">
//                     Up to 25% off on seasonal properties during this promotional
//                     period.
//                   </p>
//                 </div>

//                 <div className="bg-white p-5 rounded-xl shadow-soft">
//                   <div className="flex items-center mb-3">
//                     <div
//                       className={`w-8 h-8 rounded-full flex items-center justify-center ${textClass} bg-gray-100`}
//                     >
//                       <span className="text-sm font-bold">2</span>
//                     </div>
//                     <h3 className="ml-3 font-semibold">Exclusive Amenities</h3>
//                   </div>
//                   <p className="text-gray-600">
//                     Special seasonal amenities included with featured
//                     properties.
//                   </p>
//                 </div>

//                 <div className="bg-white p-5 rounded-xl shadow-soft">
//                   <div className="flex items-center mb-3">
//                     <div
//                       className={`w-8 h-8 rounded-full flex items-center justify-center ${textClass} bg-gray-100`}
//                     >
//                       <span className="text-sm font-bold">3</span>
//                     </div>
//                     <h3 className="ml-3 font-semibold">Flexible Cancelation</h3>
//                   </div>
//                   <p className="text-gray-600">
//                     More generous cancelation policies for seasonal bookings.
//                   </p>
//                 </div>

//                 <div className="bg-white p-5 rounded-xl shadow-soft">
//                   <div className="flex items-center mb-3">
//                     <div
//                       className={`w-8 h-8 rounded-full flex items-center justify-center ${textClass} bg-gray-100`}
//                     >
//                       <span className="text-sm font-bold">4</span>
//                     </div>
//                     <h3 className="ml-3 font-semibold">Local Experiences</h3>
//                   </div>
//                   <p className="text-gray-600">
//                     Curated seasonal activities and local experiences included
//                     with your stay.
//                   </p>
//                 </div>
//               </div>

//               <Button
//                 className={`bg-gradient-to-r ${color} hover:opacity-90 text-white rounded-full px-6 py-6`}
//               >
//                 Explore{" "}
//                 {currentSeason.charAt(0).toUpperCase() + currentSeason.slice(1)}{" "}
//                 Promotions
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default SeasonalPromotions;
