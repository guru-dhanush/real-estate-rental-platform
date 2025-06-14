// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { MapPin, Clock, ArrowRight } from "lucide-react";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from "@/components/ui/carousel";

// const RECENTLY_VIEWED = [
//   {
//     id: 1,
//     title: "Luxury Waterfront Villa",
//     location: "Miami Beach, FL",
//     image:
//       "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
//     price: "$4,500",
//     period: "month",
//     viewedAt: "2 hours ago",
//   },
//   {
//     id: 2,
//     title: "Modern Downtown Loft",
//     location: "New York, NY",
//     image:
//       "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
//     price: "$3,200",
//     period: "month",
//     viewedAt: "Yesterday",
//   },
//   {
//     id: 3,
//     title: "Cozy Mountain Retreat",
//     location: "Aspen, CO",
//     image:
//       "https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
//     price: "$2,800",
//     period: "month",
//     viewedAt: "3 days ago",
//   },
//   {
//     id: 4,
//     title: "Oceanview Penthouse",
//     location: "Malibu, CA",
//     image:
//       "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
//     price: "$5,100",
//     period: "month",
//     viewedAt: "5 days ago",
//   },
//   {
//     id: 5,
//     title: "Historic Brownstone",
//     location: "Boston, MA",
//     image:
//       "https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
//     price: "$3,500",
//     period: "month",
//     viewedAt: "Last week",
//   },
// ];

// const RecentlyViewed = () => {
//   return (
//     <section className="py-16 bg-gray-50" id="recently-viewed">
//       <div className="container px-4 mx-auto">
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
//           <div>
//             <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
//               Recently Viewed
//             </h2>
//             <p className="text-lg text-gray-600">
//               Never lose track of properties that caught your eye.
//             </p>
//           </div>
//           <Button
//             variant="ghost"
//             className="group mt-4 md:mt-0 text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50"
//           >
//             <span>View All History</span>
//             <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
//           </Button>
//         </div>

//         <Carousel
//           opts={{
//             align: "start",
//             loop: true,
//           }}
//           className="w-full"
//         >
//           <CarouselContent className="-ml-4">
//             {RECENTLY_VIEWED.map((property) => (
//               <CarouselItem
//                 key={property.id}
//                 className="pl-4 md:basis-1/3 lg:basis-1/4"
//               >
//                 <Card className="overflow-hidden border-0 shadow-md rounded-2xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
//                   <div className="relative">
//                     <div className="overflow-hidden aspect-video">
//                       <img
//                         src={property.image}
//                         alt={property.title}
//                         className="object-cover w-full h-full"
//                       />
//                     </div>
//                     <div className="absolute top-2 right-2">
//                       <div className="flex items-center bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full">
//                         <Clock className="h-3 w-3 text-white mr-1" />
//                         <span className="text-xs text-white">
//                           {property.viewedAt}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                   <CardContent className="p-4">
//                     <h3 className="font-semibold text-base line-clamp-1 mb-1">
//                       {property.title}
//                     </h3>
//                     <div className="flex items-center text-gray-600 text-sm mb-2">
//                       <MapPin className="h-3 w-3 mr-1 text-emerald-600" />
//                       <span>{property.location}</span>
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <span className="text-sm font-semibold">
//                           {property.price}
//                         </span>
//                         <span className="text-xs text-gray-600">
//                           /{property.period}
//                         </span>
//                       </div>
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         className="h-8 text-xs border-emerald-600 text-emerald-700 hover:bg-emerald-50"
//                       >
//                         View Again
//                       </Button>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </CarouselItem>
//             ))}
//           </CarouselContent>
//           <div className="flex justify-center mt-6 space-x-2">
//             <CarouselPrevious className="h-8 w-8 rounded-full border border-emerald-200 bg-white text-emerald-800 hover:bg-emerald-50" />
//             <CarouselNext className="h-8 w-8 rounded-full border border-emerald-200 bg-white text-emerald-800 hover:bg-emerald-50" />
//           </div>
//         </Carousel>
//       </div>
//     </section>
//   );
// };

// export default RecentlyViewed;
