// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Heart, Star, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
// import { useState } from "react";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from "@/components/ui/carousel";

// const PREMIUM_LISTINGS = [
//   {
//     id: 1,
//     title: "Luxury Waterfront Villa",
//     location: "Miami Beach, FL",
//     price: "$4,500",
//     period: "month",
//     image:
//       "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
//     rating: 4.9,
//     reviews: 123,
//     featured: true,
//   },
//   {
//     id: 2,
//     title: "Modern Downtown Loft",
//     location: "New York, NY",
//     price: "$3,200",
//     period: "month",
//     image:
//       "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
//     rating: 4.7,
//     reviews: 89,
//     featured: true,
//   },
//   {
//     id: 3,
//     title: "Cozy Mountain Retreat",
//     location: "Aspen, CO",
//     price: "$2,800",
//     period: "month",
//     image:
//       "https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
//     rating: 4.8,
//     reviews: 65,
//     featured: false,
//   },
//   {
//     id: 4,
//     title: "Oceanview Penthouse",
//     location: "Malibu, CA",
//     price: "$5,100",
//     period: "month",
//     image:
//       "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
//     rating: 5.0,
//     reviews: 42,
//     featured: true,
//   },
//   {
//     id: 5,
//     title: "Historic Brownstone",
//     location: "Boston, MA",
//     price: "$3,500",
//     period: "month",
//     image:
//       "https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
//     rating: 4.6,
//     reviews: 78,
//     featured: false,
//   },
// ];

// const PremiumListings = () => {
//   const [savedProperties, setSavedProperties] = useState<number[]>([]);

//   const toggleSave = (id: number) => {
//     if (savedProperties.includes(id)) {
//       setSavedProperties(
//         savedProperties.filter((propertyId) => propertyId !== id)
//       );
//     } else {
//       setSavedProperties([...savedProperties, id]);
//     }
//   };

//   return (
//     <section className="py-16 bg-white" id="premium-listings">
//       <div className="container px-4 mx-auto">
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
//           <div>
//             <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
//               Featured Premium Properties
//             </h2>
//             <p className="text-lg text-gray-600">
//               Handpicked homes from verified owners with added perks and higher
//               trust scores.
//             </p>
//           </div>
//           <div className="mt-4 md:mt-0">
//             <Button
//               variant="outline"
//               className="border-emerald-600 text-emerald-700 hover:bg-emerald-50"
//             >
//               View All Properties
//             </Button>
//           </div>
//         </div>

//         <Carousel
//           opts={{
//             align: "start",
//             loop: true,
//           }}
//           className="w-full"
//         >
//           <CarouselContent className="-ml-4">
//             {PREMIUM_LISTINGS.map((property) => (
//               <CarouselItem
//                 key={property.id}
//                 className="pl-4 md:basis-1/2 lg:basis-1/3"
//               >
//                 <div className="h-full">
//                   <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg border-0 shadow-md rounded-2xl group">
//                     <div className="relative">
//                       <div className="overflow-hidden rounded-t-2xl aspect-[4/3] bg-gray-100">
//                         <img
//                           src={property.image}
//                           alt={property.title}
//                           className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
//                         />
//                       </div>
//                       <button
//                         onClick={() => toggleSave(property.id)}
//                         className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md transition-colors hover:bg-gray-100"
//                       >
//                         <Heart
//                           className={`h-5 w-5 ${
//                             savedProperties.includes(property.id)
//                               ? "fill-red-500 text-red-500"
//                               : "text-gray-600"
//                           }`}
//                         />
//                       </button>
//                       {property.featured && (
//                         <div className="absolute top-3 left-3">
//                           <Badge className="bg-emerald-600 hover:bg-emerald-700 px-3 py-1">
//                             Premium
//                           </Badge>
//                         </div>
//                       )}
//                     </div>
//                     <CardContent className="p-5">
//                       <div className="flex items-start justify-between mb-1">
//                         <h3 className="font-semibold text-xl line-clamp-1">
//                           {property.title}
//                         </h3>
//                       </div>
//                       <div className="flex items-center text-gray-600 mb-3">
//                         <MapPin className="h-4 w-4 mr-1 text-emerald-600" />
//                         <span className="text-sm">{property.location}</span>
//                       </div>
//                       <div className="flex items-center mb-4">
//                         <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
//                         <span className="text-sm font-medium">
//                           {property.rating}
//                         </span>
//                         <span className="text-sm text-gray-500 ml-1">
//                           ({property.reviews} reviews)
//                         </span>
//                       </div>
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <span className="text-xl font-bold">
//                             {property.price}
//                           </span>
//                           <span className="text-gray-600">
//                             /{property.period}
//                           </span>
//                         </div>
//                         <Button
//                           size="sm"
//                           className="bg-emerald-700 hover:bg-emerald-600"
//                         >
//                           Book Now
//                         </Button>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </div>
//               </CarouselItem>
//             ))}
//           </CarouselContent>
//           <div className="flex justify-center mt-8 space-x-2">
//             <CarouselPrevious className="relative inset-0 -left-0 translate-y-0 h-9 w-9 rounded-full border-2 border-emerald-200 bg-white text-emerald-800 hover:bg-emerald-50" />
//             <CarouselNext className="relative inset-0 -right-0 translate-y-0 h-9 w-9 rounded-full border-2 border-emerald-200 bg-white text-emerald-800 hover:bg-emerald-50" />
//           </div>
//         </Carousel>
//       </div>
//     </section>
//   );
// };

// export default PremiumListings;
