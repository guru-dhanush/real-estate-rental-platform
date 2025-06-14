// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { MapPin, Bed, Bath, Home, PawPrint, Video } from "lucide-react";

// const RECOMMENDATIONS = [
//   {
//     id: 1,
//     title: "Cozy 1BHK near Downtown",
//     location: "Mission District, San Francisco",
//     image:
//       "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
//     price: "$2,100",
//     period: "month",
//     bedrooms: 1,
//     bathrooms: 1,
//     sqft: 650,
//     tags: ["Near Downtown", "Public Transit", "Furnished"],
//   },
//   {
//     id: 2,
//     title: "Pet-friendly Townhouse",
//     location: "Capitol Hill, Seattle",
//     image:
//       "https://images.unsplash.com/photo-1560448204-61dc36dc98c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
//     price: "$2,800",
//     period: "month",
//     bedrooms: 2,
//     bathrooms: 1.5,
//     sqft: 1200,
//     tags: ["Pet Friendly", "Near Park", "Backyard"],
//   },
//   {
//     id: 3,
//     title: "Modern Studio with Virtual Tour",
//     location: "Downtown, Austin",
//     image:
//       "https://images.unsplash.com/photo-1505691938895-1758d7feb511?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
//     price: "$1,850",
//     period: "month",
//     bedrooms: 0,
//     bathrooms: 1,
//     sqft: 500,
//     tags: ["Virtual Tour", "City View", "Gym Access"],
//   },
// ];

// const RecommendationCard = ({
//   recommendation,
// }: {
//   recommendation: (typeof RECOMMENDATIONS)[0];
// }) => {
//   const getTagIcon = (tag: string) => {
//     if (tag.includes("Pet")) return <PawPrint className="h-3 w-3" />;
//     if (tag.includes("Virtual")) return <Video className="h-3 w-3" />;
//     return null;
//   };

//   return (
//     <Card className="overflow-hidden border-0 shadow-md rounded-2xl transition-all duration-300 hover:shadow-lg">
//       <div className="relative overflow-hidden aspect-[4/3]">
//         <img
//           src={recommendation.image}
//           alt={recommendation.title}
//           className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
//         />
//       </div>
//       <CardContent className="p-5">
//         <h3 className="font-semibold text-lg mb-1">{recommendation.title}</h3>
//         <div className="flex items-center text-gray-600 mb-3">
//           <MapPin className="h-4 w-4 mr-1 text-emerald-600" />
//           <span className="text-sm">{recommendation.location}</span>
//         </div>

//         <div className="flex items-center gap-3 text-gray-600 text-sm mb-3">
//           <div className="flex items-center">
//             <Bed className="h-4 w-4 mr-1" />
//             <span>
//               {recommendation.bedrooms}{" "}
//               {recommendation.bedrooms === 1 ? "bed" : "beds"}
//             </span>
//           </div>
//           <div className="flex items-center">
//             <Bath className="h-4 w-4 mr-1" />
//             <span>
//               {recommendation.bathrooms}{" "}
//               {recommendation.bathrooms === 1 ? "bath" : "baths"}
//             </span>
//           </div>
//           <div className="flex items-center">
//             <Home className="h-4 w-4 mr-1" />
//             <span>{recommendation.sqft} sqft</span>
//           </div>
//         </div>

//         <div className="flex flex-wrap gap-2 mb-4">
//           {recommendation.tags.map((tag, index) => (
//             <Badge
//               key={index}
//               variant="secondary"
//               className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-800"
//             >
//               {getTagIcon(tag)}
//               {tag}
//             </Badge>
//           ))}
//         </div>

//         <div className="flex items-center justify-between">
//           <div>
//             <span className="text-lg font-bold">{recommendation.price}</span>
//             <span className="text-gray-600">/{recommendation.period}</span>
//           </div>
//           <Button
//             variant="outline"
//             className="border-emerald-600 text-emerald-700 hover:bg-emerald-50"
//           >
//             View Details
//           </Button>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// const SmartRecommendations = () => {
//   return (
//     <section className="py-16 bg-white" id="smart-recommendations">
//       <div className="container px-4 mx-auto">
//         <div className="max-w-3xl mx-auto text-center mb-12">
//           <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
//             Smart Recommendations
//           </h2>
//           <p className="text-lg text-gray-600">
//             Based on your search history and preferences, we think you'll love
//             these properties.
//           </p>
//         </div>

//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {RECOMMENDATIONS.map((recommendation) => (
//             <RecommendationCard
//               key={recommendation.id}
//               recommendation={recommendation}
//             />
//           ))}
//         </div>

//         <div className="mt-10 text-center">
//           <Button className="bg-emerald-700 hover:bg-emerald-600">
//             See More Recommendations
//           </Button>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default SmartRecommendations;
