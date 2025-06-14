// "use client";

// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Shield, Coffee, Clock, Calendar, MapPin, Star } from "lucide-react";

// const NEIGHBORHOODS = [
//   {
//     id: 1,
//     name: "Mission District",
//     city: "San Francisco, CA",
//     image:
//       "https://images.unsplash.com/photo-1521747116042-5a810fda9664?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
//     safetyRating: 4.2,
//     cafes: 28,
//     commuteTime: "15 min",
//     upcomingEvents: 12,
//   },
//   {
//     id: 2,
//     name: "Williamsburg",
//     city: "Brooklyn, NY",
//     image:
//       "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
//     safetyRating: 4.5,
//     cafes: 42,
//     commuteTime: "20 min",
//     upcomingEvents: 18,
//   },
//   {
//     id: 3,
//     name: "Arts District",
//     city: "Los Angeles, CA",
//     image:
//       "https://images.unsplash.com/photo-1617688319108-cb3bdc88f587?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
//     safetyRating: 4.0,
//     cafes: 35,
//     commuteTime: "18 min",
//     upcomingEvents: 15,
//   },
//   {
//     id: 4,
//     name: "Wynwood",
//     city: "Miami, FL",
//     image:
//       "https://images.unsplash.com/photo-1580541631971-c7f8c6f863f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
//     safetyRating: 4.3,
//     cafes: 31,
//     commuteTime: "12 min",
//     upcomingEvents: 22,
//   },
// ];

// const NeighborhoodHighlights = () => {
//   return (
//     <section className="py-16 bg-gray-50" id="neighborhood-highlights">
//       <div className="container px-4 mx-auto">
//         <div className="max-w-3xl mx-auto text-center mb-12">
//           <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
//             Neighborhood Highlights
//           </h2>
//           <p className="text-lg text-gray-600">
//             Explore communities before you commit. Get to know the areas with
//             the highest quality of life.
//           </p>
//         </div>

//         <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {NEIGHBORHOODS.map((neighborhood) => (
//             <Card
//               key={neighborhood.id}
//               className="overflow-hidden border-0 shadow-md rounded-2xl transition-all duration-300 hover:shadow-lg group"
//             >
//               <div className="relative h-48 overflow-hidden">
//                 <img
//                   src={neighborhood.image}
//                   alt={neighborhood.name}
//                   className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
//                 <div className="absolute bottom-0 left-0 p-4 text-white">
//                   <Badge className="bg-emerald-600 hover:bg-emerald-700 mb-2">
//                     Trending
//                   </Badge>
//                   <h3 className="text-xl font-bold">{neighborhood.name}</h3>
//                   <div className="flex items-center">
//                     <MapPin className="h-4 w-4 mr-1" />
//                     <span className="text-sm text-white/90">
//                       {neighborhood.city}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//               <CardContent className="p-5">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="flex flex-col items-center p-3 rounded-lg bg-white shadow-sm">
//                     <Shield className="h-5 w-5 text-emerald-600 mb-1" />
//                     <span className="text-sm text-gray-600">Safety</span>
//                     <div className="flex items-center mt-1">
//                       <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
//                       <span className="text-sm font-semibold ml-1">
//                         {neighborhood.safetyRating}
//                       </span>
//                     </div>
//                   </div>

//                   <div className="flex flex-col items-center p-3 rounded-lg bg-white shadow-sm">
//                     <Coffee className="h-5 w-5 text-emerald-600 mb-1" />
//                     <span className="text-sm text-gray-600">Cafes</span>
//                     <span className="text-sm font-semibold mt-1">
//                       {neighborhood.cafes}
//                     </span>
//                   </div>

//                   <div className="flex flex-col items-center p-3 rounded-lg bg-white shadow-sm">
//                     <Clock className="h-5 w-5 text-emerald-600 mb-1" />
//                     <span className="text-sm text-gray-600">Commute</span>
//                     <span className="text-sm font-semibold mt-1">
//                       {neighborhood.commuteTime}
//                     </span>
//                   </div>

//                   <div className="flex flex-col items-center p-3 rounded-lg bg-white shadow-sm">
//                     <Calendar className="h-5 w-5 text-emerald-600 mb-1" />
//                     <span className="text-sm text-gray-600">Events</span>
//                     <span className="text-sm font-semibold mt-1">
//                       {neighborhood.upcomingEvents}
//                     </span>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default NeighborhoodHighlights;
