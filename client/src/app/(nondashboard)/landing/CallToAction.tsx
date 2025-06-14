"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const CallToAction = () => {
  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-emerald-700 bg-opacity-90">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-800 to-emerald-600 opacity-90 animate-gradient-shift"></div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-white opacity-5 transform -skew-y-6"></div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-white opacity-5 transform skew-y-6"></div>
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Find Your Perfect Home?
          </h2>
          <p className="text-xl text-white text-opacity-90 mb-10 max-w-2xl mx-auto">
            Join thousands of satisfied customers who found their dream
            properties through our platform. Your perfect home is just a few
            clicks away.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-emerald-700 hover:bg-gray-100 rounded-full px-8 py-6 text-lg font-medium flex items-center gap-2">
              <span>Start Your Search</span>
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white/10 rounded-full px-8 py-6 text-lg font-medium"
            >
              Learn More
            </Button>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-4xl font-bold text-white mb-2">10k+</div>
              <p className="text-white/80">Properties Listed</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-4xl font-bold text-white mb-2">8.5k+</div>
              <p className="text-white/80">Happy Customers</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-4xl font-bold text-white mb-2">250+</div>
              <p className="text-white/80">Cities Covered</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
