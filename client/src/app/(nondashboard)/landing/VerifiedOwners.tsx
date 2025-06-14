// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Check, Shield, FileCheck, UserCheck } from "lucide-react";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from "@/components/ui/carousel";

// const TESTIMONIALS = [
//   {
//     id: 1,
//     name: "Emma Rodriguez",
//     role: "Property Owner",
//     avatar: "https://randomuser.me/api/portraits/women/32.jpg",
//     testimonial:
//       "As a verified owner, I've been able to find reliable tenants quickly. The verification process was thorough but straightforward.",
//     verifiedSince: "April 2022",
//     properties: 3,
//   },
//   {
//     id: 2,
//     name: "Michael Chen",
//     role: "Real Estate Agent",
//     avatar: "https://randomuser.me/api/portraits/men/53.jpg",
//     testimonial:
//       "The verification system gives my clients confidence when viewing properties. It's been a game-changer for my business.",
//     verifiedSince: "January 2021",
//     properties: 12,
//   },
//   {
//     id: 3,
//     name: "Sarah Johnson",
//     role: "Property Manager",
//     avatar: "https://randomuser.me/api/portraits/women/71.jpg",
//     testimonial:
//       "Managing multiple properties is easier when tenants trust you from the start. The verification badge has made a huge difference.",
//     verifiedSince: "October 2022",
//     properties: 8,
//   },
//   {
//     id: 4,
//     name: "David Thompson",
//     role: "Property Owner",
//     avatar: "https://randomuser.me/api/portraits/men/22.jpg",
//     testimonial:
//       "The verification process was comprehensive and gave me credibility with potential renters. Highly recommend for serious owners.",
//     verifiedSince: "March 2023",
//     properties: 2,
//   },
// ];

// const VerifiedOwners = () => {
//   return (
//     <section className="py-16 bg-white" id="verified-owners">
//       <div className="container px-4 mx-auto">
//         <div className="flex flex-col items-start justify-between gap-12">
//           <div className="md:w-1/3">
//             <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
//               Verified Owners & Agents
//             </h2>
//             <p className="text-lg text-gray-600 mb-6">
//               Every premium listing is backed by trusted owners and verified
//               documentation — ensuring peace of mind when renting.
//             </p>

//             <div className="space-y-4 mb-8">
//               <div className="flex items-start">
//                 <div className="p-2 bg-emerald-100 rounded-full mr-4 mt-1">
//                   <Shield className="h-5 w-5 text-emerald-700" />
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-lg mb-1">
//                     Identity Verification
//                   </h3>
//                   <p className="text-gray-600">
//                     All owners undergo thorough identity checks before listing
//                     properties.
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-start">
//                 <div className="p-2 bg-emerald-100 rounded-full mr-4 mt-1">
//                   <FileCheck className="h-5 w-5 text-emerald-700" />
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-lg mb-1">
//                     Document Authentication
//                   </h3>
//                   <p className="text-gray-600">
//                     Property ownership documents are verified by our legal team.
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-start">
//                 <div className="p-2 bg-emerald-100 rounded-full mr-4 mt-1">
//                   <UserCheck className="h-5 w-5 text-emerald-700" />
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-lg mb-1">Tenant Reviews</h3>
//                   <p className="text-gray-600">
//                     Feedback from previous tenants helps maintain high
//                     standards.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="md:w-2/3">
//             <Carousel
//               opts={{
//                 align: "start",
//                 loop: true,
//               }}
//               className="w-full"
//             >
//               <CarouselContent>
//                 {TESTIMONIALS.map((testimonial) => (
//                   <CarouselItem
//                     key={testimonial.id}
//                     className="md:basis-1/2 lg:basis-1/2"
//                   >
//                     <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 h-full">
//                       <div className="flex items-center mb-4">
//                         <Avatar className="h-12 w-12 border-2 border-emerald-200">
//                           <AvatarImage
//                             src={testimonial.avatar}
//                             alt={testimonial.name}
//                           />
//                           <AvatarFallback>
//                             {testimonial.name.slice(0, 2)}
//                           </AvatarFallback>
//                         </Avatar>
//                         <div className="ml-4">
//                           <div className="flex items-center">
//                             <h3 className="font-semibold text-lg">
//                               {testimonial.name}
//                             </h3>
//                             <div className="ml-2 flex items-center bg-emerald-100 px-2 py-0.5 rounded-full">
//                               <Check className="h-3 w-3 text-emerald-700 mr-1" />
//                               <span className="text-xs font-medium text-emerald-700">
//                                 Verified
//                               </span>
//                             </div>
//                           </div>
//                           <p className="text-gray-600 text-sm">
//                             {testimonial.role}
//                           </p>
//                         </div>
//                       </div>

//                       <p className="text-gray-700 mb-4 italic">
//                         "{testimonial.testimonial}"
//                       </p>

//                       <div className="flex items-center justify-between text-sm text-gray-600 border-t border-gray-200 pt-4">
//                         <span>Verified since {testimonial.verifiedSince}</span>
//                         <span>{testimonial.properties} properties</span>
//                       </div>
//                     </div>
//                   </CarouselItem>
//                 ))}
//               </CarouselContent>
//               <div className="flex justify-end mt-4 space-x-2">
//                 <CarouselPrevious className="h-8 w-8 rounded-full border border-emerald-200 bg-white text-emerald-800 hover:bg-emerald-50" />
//                 <CarouselNext className="h-8 w-8 rounded-full border border-emerald-200 bg-white text-emerald-800 hover:bg-emerald-50" />
//               </div>
//             </Carousel>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default VerifiedOwners;
