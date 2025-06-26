"use client";

import { motion } from "framer-motion";
import {
    Building,
    Home,
    Key,
    ShieldCheck,
    Users,
    Star,
    MapPin,
    Heart,
    Lock,
    BarChart3,
    Calendar,
    Globe,
    Rocket,
    Target,
    Award,
    Zap,
    CheckCircle,
    ArrowRight,
    Layers,
} from "lucide-react";

const AboutUs = () => {
    const featureSections = [
        {
            icon: <Building className="w-8 h-8 text-slate-600" />,
            title: "Premium Properties",
            features: [
                "Luxury apartments, villas, and studios",
                "Handpicked, verified listings",
                "Unique spaces for every lifestyle",
                "Quality and comfort guaranteed",
            ],
        },
        {
            icon: <ShieldCheck className="w-8 h-8 text-slate-600" />,
            title: "Trust & Security",
            features: [
                "Advanced data protection",
                "Secure transaction processing",
                "Verified property managers",
                "Transparent reviews system",
            ],
        },
        {
            icon: <Key className="w-8 h-8 text-slate-600" />,
            title: "Smart Search",
            features: [
                "AI-powered recommendations",
                "Interactive maps and filters",
                "Instant booking capability",
                "Personalized home alerts",
            ],
        },
        {
            icon: <Users className="w-8 h-8 text-slate-600" />,
            title: "Community Focus",
            features: [
                "Dedicated support team",
                "Tenant resources center",
                "Neighborhood guides",
                "Exclusive member events",
            ],
        },
        {
            icon: <Globe className="w-8 h-8 text-slate-600" />,
            title: "2025 Vision",
            features: [
                "Global expansion plans",
                "Enhanced AI matching",
                "Sustainable living focus",
                "Smart home integration",
            ],
        },
        {
            icon: <Target className="w-8 h-8 text-slate-600" />,
            title: "Industry Leadership",
            features: [
                "Luxury market specialists",
                "Tech-driven solutions",
                "Partnerships with top agencies",
                "Market trend analysis",
            ],
        },
    ];

    return (
        <>

            <div className="relative min-h-screen overflow-x-hidden">
                {/* Animated Gradient Background */}
                <div className="absolute inset-0 -z-10 animate-gradient bg-[linear-gradient(120deg,#f8fafc,60%,#e0e7ef,#c7d2fe)] bg-[length:400%_400%]" />

                {/* Hero Section */}
                <motion.section
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative py-20 lg:py-32 overflow-hidden"
                >
                    {/* Animated Blobs Background */}
                    <motion.div
                        className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-blue-200 opacity-30 blur-3xl"
                        animate={{ scale: [1, 1.2, 1], x: [0, 40, 0], y: [0, 20, 0] }}
                        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
                    />
                    <motion.div
                        className="absolute -bottom-32 -right-32 w-[400px] h-[400px] rounded-full bg-red-200 opacity-30 blur-3xl"
                        animate={{ scale: [1, 1.1, 1], x: [0, -30, 0], y: [0, -20, 0] }}
                        transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
                    />

                    <div className="relative max-w-7xl mx-auto px-6">
                        <div className="max-w-4xl mx-auto text-center">
                            {/* Trust Badge */}
                            <div className="inline-flex items-center bg-white/80 backdrop-blur-sm border border-slate-200 rounded-full px-4 py-2 mb-8">
                                <Award className="w-4 h-4 text-slate-600 mr-2" />
                                <span className="text-sm font-medium text-slate-700">About Dweltin</span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                                Redefining Rental Experiences
                            </h1>

                            <p className="text-lg sm:text-xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
                                Dweltin is the next-generation premium real estate platform connecting discerning tenants with
                                exceptional properties through technology, trust, and unparalleled service.
                            </p>
                        </div>
                    </div>
                </motion.section>

                {/* Stats Section */}
                <motion.section
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="py-16 bg-white/80 backdrop-blur-sm border-y border-slate-200"
                >
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { metric: "10K+", label: "Premium Listings", icon: <Home className="w-6 h-6 text-slate-600" /> },
                                { metric: "95%", label: "Satisfaction Rate", icon: <Heart className="w-6 h-6 text-slate-600" /> },
                                { metric: "24/7", label: "Customer Support", icon: <Users className="w-6 h-6 text-slate-600" /> },
                                { metric: "50+", label: "Cities Worldwide", icon: <MapPin className="w-6 h-6 text-slate-600" /> }
                            ].map((stat, index) => (
                                <div key={index} className="text-center">
                                    <div className="flex justify-center mb-3">{stat.icon}</div>
                                    <div className="text-3xl font-bold text-slate-900 mb-1">{stat.metric}</div>
                                    <div className="text-slate-600 font-medium">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.section>

                {/* Mission & Values Section */}
                <motion.section
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="py-24 bg-gradient-to-b from-white via-white to-slate-50"
                >
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <h2 className="text-4xl font-bold text-slate-900 mb-6">
                                    Our Mission & Values
                                </h2>
                                <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                                    To elevate the rental experience by combining premium properties, cutting-edge technology,
                                    and a human touch that makes finding your perfect home effortless and inspiring.
                                </p>
                                <div className="space-y-4">
                                    {[
                                        "Quality over quantity in every listing",
                                        "Transparency in every transaction",
                                        "Innovation in property search",
                                        "Exceptional service at every step"
                                    ].map((value, index) => (
                                        <div key={index} className="flex items-center">
                                            <CheckCircle className="w-5 h-5 text-slate-600 mr-3" />
                                            <span className="text-slate-700 font-medium">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="relative">
                                <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl p-8 shadow-2xl">
                                    <div className="grid grid-cols-2 gap-6">
                                        {[
                                            { icon: <Building className="w-8 h-8 text-slate-600" />, title: "Premium" },
                                            { icon: <ShieldCheck className="w-8 h-8 text-slate-600" />, title: "Secure" },
                                            { icon: <Key className="w-8 h-8 text-slate-600" />, title: "Convenient" },
                                            { icon: <Heart className="w-8 h-8 text-slate-600" />, title: "Caring" }
                                        ].map((value, index) => (
                                            <div key={index} className="bg-white rounded-xl p-6 text-center transform hover:scale-105 transition-transform">
                                                <div className="flex justify-center mb-3">{value.icon}</div>
                                                <div className="font-semibold text-slate-900">{value.title}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Technology Section */}
                <motion.section
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className="py-24 bg-slate-50"
                >
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-slate-900 mb-4">
                                The Dweltin Difference
                            </h2>
                            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                                Modern technology meets exceptional service to create a rental experience like no other.
                            </p>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: <Zap className="w-8 h-8 text-slate-600" />,
                                    title: "Smart Matching",
                                    description: "AI-powered recommendations tailored to your preferences and lifestyle"
                                },
                                {
                                    icon: <ShieldCheck className="w-8 h-8 text-slate-600" />,
                                    title: "Verified Listings",
                                    description: "Every property personally vetted by our quality assurance team"
                                },
                                {
                                    icon: <Layers className="w-8 h-8 text-slate-600" />,
                                    title: "Seamless Process",
                                    description: "From search to signing - all the tools you need in one platform"
                                }
                            ].map((feature, index) => (
                                <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 hover:shadow-xl transition-all border border-slate-200/50 transform hover:scale-105">
                                    <div className="mb-6">{feature.icon}</div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                                    <p className="text-slate-600">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.section>


                {/* CTA Section */}
                <motion.section
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="py-24 bg-gradient-to-br from-[#004B93] to-[#c9002b]"
                >
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <h2 className="text-4xl font-bold text-white mb-6">
                            Ready to Find Your Perfect Home?
                        </h2>
                        <p className="text-xl text-slate-100 mb-10">
                            Join thousands of happy tenants who found their dream home through Dweltin.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                            <a href="/search" className="bg-white text-slate-900 px-8 py-4 rounded-xl font-semibold hover:bg-slate-100 transition-all flex items-center group">
                                Browse Properties
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </a>
                            <a href="/contact" className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-[#004B93] transition-all">
                                Contact Our Team
                            </a>
                        </div>

                        <p className="text-slate-200 text-sm">
                            Premium listings • Verified properties • Exceptional service
                        </p>
                    </div>
                </motion.section>

                {/* Animation Styles */}
                <style>{`
                @keyframes gradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .animate-gradient {
                    animation: gradient 15s ease infinite;
                    background-size: 400% 400%;
                }
            `}</style>
            </div>
        </>
    );
};

export default AboutUs;