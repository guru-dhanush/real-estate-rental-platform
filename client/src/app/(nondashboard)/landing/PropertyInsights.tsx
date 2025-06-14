// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   LineChart,
//   Line,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   Legend,
// } from "recharts";
// import { TrendingUp, Eye, Map } from "lucide-react";

// const PRICE_TREND_DATA = [
//   { month: "Jan", nyc: 3150, sf: 3500, miami: 2700, la: 3200 },
//   { month: "Feb", nyc: 3200, sf: 3450, miami: 2750, la: 3250 },
//   { month: "Mar", nyc: 3250, sf: 3600, miami: 2800, la: 3300 },
//   { month: "Apr", nyc: 3300, sf: 3700, miami: 2900, la: 3350 },
//   { month: "May", nyc: 3320, sf: 3800, miami: 2950, la: 3400 },
//   { month: "Jun", nyc: 3400, sf: 3850, miami: 3100, la: 3500 },
// ];

// const VIEWED_PROPERTIES_DATA = [
//   { name: "Luxury Apartments", views: 4200 },
//   { name: "Beachfront Homes", views: 3800 },
//   { name: "Downtown Condos", views: 3500 },
//   { name: "Suburban Houses", views: 2900 },
//   { name: "Mountain Cabins", views: 2200 },
// ];

// const HIGH_DEMAND_AREAS = [
//   {
//     name: "Downtown Manhattan",
//     city: "New York, NY",
//     demandScore: 92,
//     changeDirection: "up",
//     changePercent: 8,
//   },
//   {
//     name: "Pacific Heights",
//     city: "San Francisco, CA",
//     demandScore: 89,
//     changeDirection: "up",
//     changePercent: 5,
//   },
//   {
//     name: "South Beach",
//     city: "Miami, FL",
//     demandScore: 86,
//     changeDirection: "up",
//     changePercent: 12,
//   },
//   {
//     name: "Santa Monica",
//     city: "Los Angeles, CA",
//     demandScore: 84,
//     changeDirection: "up",
//     changePercent: 7,
//   },
// ];

// const PropertyInsights = () => {
//   return (
//     <section className="py-16 bg-gray-50" id="property-insights">
//       <div className="container px-4 mx-auto">
//         <div className="text-center mb-12">
//           <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
//             Property Insights
//           </h2>
//           <p className="text-lg text-gray-600 max-w-3xl mx-auto">
//             Track what's trending — we analyze price shifts, popularity, and
//             availability to help you make informed decisions.
//           </p>
//         </div>

//         <Tabs defaultValue="trends" className="w-full">
//           <TabsList className="grid w-full max-w-md mx-auto mb-8 grid-cols-3">
//             <TabsTrigger
//               value="trends"
//               className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700"
//             >
//               <TrendingUp className="h-4 w-4 mr-2" />
//               Price Trends
//             </TabsTrigger>
//             <TabsTrigger
//               value="popular"
//               className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700"
//             >
//               <Eye className="h-4 w-4 mr-2" />
//               Most Viewed
//             </TabsTrigger>
//             <TabsTrigger
//               value="demand"
//               className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700"
//             >
//               <Map className="h-4 w-4 mr-2" />
//               Hot Areas
//             </TabsTrigger>
//           </TabsList>

//           <TabsContent value="trends" className="mt-0">
//             <Card className="border-0 shadow-sm">
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-xl">
//                   Average Rental Prices by City ($/month)
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="h-80 w-full">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <LineChart data={PRICE_TREND_DATA}>
//                       <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                       <XAxis dataKey="month" />
//                       <YAxis />
//                       <Tooltip
//                         contentStyle={{
//                           backgroundColor: "white",
//                           borderRadius: "0.5rem",
//                           boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
//                           border: "none",
//                         }}
//                       />
//                       <Legend />
//                       <Line
//                         type="monotone"
//                         dataKey="nyc"
//                         stroke="#047857"
//                         strokeWidth={2}
//                         activeDot={{ r: 6 }}
//                         name="New York"
//                       />
//                       <Line
//                         type="monotone"
//                         dataKey="sf"
//                         stroke="#0ea5e9"
//                         strokeWidth={2}
//                         activeDot={{ r: 6 }}
//                         name="San Francisco"
//                       />
//                       <Line
//                         type="monotone"
//                         dataKey="miami"
//                         stroke="#f59e0b"
//                         strokeWidth={2}
//                         activeDot={{ r: 6 }}
//                         name="Miami"
//                       />
//                       <Line
//                         type="monotone"
//                         dataKey="la"
//                         stroke="#8b5cf6"
//                         strokeWidth={2}
//                         activeDot={{ r: 6 }}
//                         name="Los Angeles"
//                       />
//                     </LineChart>
//                   </ResponsiveContainer>
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="popular" className="mt-0">
//             <Card className="border-0 shadow-sm">
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-xl">
//                   Most Viewed Properties This Week
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="h-80 w-full">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <BarChart data={VIEWED_PROPERTIES_DATA}>
//                       <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                       <XAxis dataKey="name" />
//                       <YAxis />
//                       <Tooltip
//                         contentStyle={{
//                           backgroundColor: "white",
//                           borderRadius: "0.5rem",
//                           boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
//                           border: "none",
//                         }}
//                       />
//                       <Bar
//                         dataKey="views"
//                         fill="#047857"
//                         radius={[4, 4, 0, 0]}
//                         name="Views"
//                       />
//                     </BarChart>
//                   </ResponsiveContainer>
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="demand" className="mt-0">
//             <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
//               {HIGH_DEMAND_AREAS.map((area, index) => (
//                 <Card key={index} className="border-0 shadow-sm">
//                   <CardContent className="p-6">
//                     <div className="mb-2">
//                       <span className="inline-block px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-medium rounded-full">
//                         High Demand
//                       </span>
//                     </div>
//                     <h3 className="text-lg font-semibold mb-1">{area.name}</h3>
//                     <p className="text-sm text-gray-500 mb-4">{area.city}</p>

//                     <div className="flex items-center justify-between">
//                       <div className="bg-gray-100 h-2 rounded-full flex-grow mr-3">
//                         <div
//                           className="bg-emerald-600 h-2 rounded-full"
//                           style={{ width: `${area.demandScore}%` }}
//                         ></div>
//                       </div>
//                       <span className="font-semibold">{area.demandScore}%</span>
//                     </div>

//                     <div className="mt-4 flex items-center text-sm">
//                       <TrendingUp
//                         className={`h-4 w-4 mr-1 ${
//                           area.changeDirection === "up"
//                             ? "text-emerald-600"
//                             : "text-red-600"
//                         }`}
//                       />
//                       <span
//                         className={`${
//                           area.changeDirection === "up"
//                             ? "text-emerald-600"
//                             : "text-red-600"
//                         } font-medium`}
//                       >
//                         {area.changePercent}% increase
//                       </span>
//                       <span className="text-gray-500 ml-1">this month</span>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </section>
//   );
// };

// export default PropertyInsights;
