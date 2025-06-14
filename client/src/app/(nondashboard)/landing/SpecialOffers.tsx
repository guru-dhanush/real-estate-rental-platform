// import { BadgePercent, ArrowRight } from "lucide-react";
// import { Button } from "@/components/ui/button";

// const SpecialOffers = () => {
//   return (
//     <section className="py-16 bg-gradient-to-br from-emerald-50 to-white">
//       <div className="container mx-auto px-4">
//         <div className="flex flex-col md:flex-row items-center justify-between gap-8">
//           {/* Left content */}
//           <div className="max-w-xl">
//             <h2 className="section-title text-gray-800">
//               Special Offers for{" "}
//               <span className="text-emerald-600">New Hosts</span>
//             </h2>
//             <p className="text-lg text-gray-600 mb-6">
//               Join our growing community of property owners and unlock exclusive
//               benefits when you list with us.
//             </p>

//             <div className="space-y-6">
//               <div className="feature-card p-6 flex items-start">
//                 <div className="mr-4 bg-emerald-100 p-3 rounded-full">
//                   <BadgePercent className="h-6 w-6 text-emerald-600" />
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-xl mb-2">
//                     Zero Commission for 30 Days
//                   </h3>
//                   <p className="text-gray-600">
//                     List your first property with us and pay absolutely no
//                     commission for the first 30 days. Keep 100% of your earnings
//                     while you get started.
//                   </p>
//                 </div>
//               </div>

//               <div className="feature-card p-6 flex items-start">
//                 <div className="mr-4 bg-emerald-100 p-3 rounded-full">
//                   <svg
//                     className="h-6 w-6 text-emerald-600"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path
//                       d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                   </svg>
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-xl mb-2">
//                     Premium Listing Upgrade
//                   </h3>
//                   <p className="text-gray-600">
//                     Get your property featured in our Premium Listings section
//                     for 14 days, increasing visibility by up to 3x compared to
//                     standard listings.
//                   </p>
//                 </div>
//               </div>

//               <div className="feature-card p-6 flex items-start">
//                 <div className="mr-4 bg-emerald-100 p-3 rounded-full">
//                   <svg
//                     className="h-6 w-6 text-emerald-600"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path
//                       d="M21 5L12 12L3 5"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M3 5H21V19H3V5Z"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M3 19L8.5 13.5"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M21 19L15.5 13.5"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                   </svg>
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-xl mb-2">
//                     Dedicated Support Team
//                   </h3>
//                   <p className="text-gray-600">
//                     Access our specialized onboarding team who will help
//                     optimize your listing and provide tips to maximize your
//                     rental income.
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <Button className="mt-8 bg-emerald-600 hover:bg-emerald-500 rounded-full px-6 py-6 text-white flex items-center">
//               <span className="mr-2">Become a Host Today</span>
//               <ArrowRight className="h-5 w-5" />
//             </Button>
//           </div>

//           {/* Right image */}
//           <div className="w-full md:w-2/5 lg:w-1/3">
//             <div className="glass-card p-6 rounded-2xl overflow-hidden">
//               <div className="bg-white rounded-xl p-6 shadow-soft">
//                 <div className="flex items-center mb-6">
//                   <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mr-4">
//                     <span className="text-emerald-600 font-bold">JD</span>
//                   </div>
//                   <div>
//                     <h4 className="font-medium text-gray-800">John Davis</h4>
//                     <p className="text-sm text-gray-500">Host since 2024</p>
//                   </div>
//                 </div>

//                 <blockquote className="text-gray-600 italic mb-6">
//                   "I was hesitant to list my property online, but the zero
//                   commission offer convinced me to try. Within a week, I had my
//                   first booking, and the support team was incredible!"
//                 </blockquote>

//                 <div className="flex items-center">
//                   <div className="flex">
//                     {[...Array(5)].map((_, i) => (
//                       <svg
//                         key={i}
//                         className="h-5 w-5 text-yellow-400"
//                         fill="currentColor"
//                         viewBox="0 0 20 20"
//                       >
//                         <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                       </svg>
//                     ))}
//                   </div>
//                   <span className="ml-2 text-gray-600">
//                     Earned $4,200 in first month
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default SpecialOffers;
