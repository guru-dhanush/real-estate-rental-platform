"use client";

import {
  Home,
  Mail,
  Phone,
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
} from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center mb-4">
              <Link href="/" className="flex items-center text-3xl font-bold text-[#004B93]">
                Dwelt <span className="text-[#c9002b]">in</span>
              </Link>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Find your perfect rental property with our premium platform.
              We connect you with the finest verified properties worldwide.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-emerald-600 transition-colors p-2 rounded-full hover:bg-emerald-50"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-emerald-600 transition-colors p-2 rounded-full hover:bg-emerald-50"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-emerald-600 transition-colors p-2 rounded-full hover:bg-emerald-50"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-emerald-600 transition-colors p-2 rounded-full hover:bg-emerald-50"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-900">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-emerald-600 transition-colors font-medium"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  className="text-gray-600 hover:text-emerald-600 transition-colors font-medium"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#discover"
                  className="text-gray-600 hover:text-emerald-600 transition-colors font-medium"
                >
                  Discover
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-gray-600 hover:text-emerald-600 transition-colors font-medium"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-900">
              Property Types
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-emerald-600 transition-colors font-medium"
                >
                  Apartments
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-emerald-600 transition-colors font-medium"
                >
                  Houses
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-emerald-600 transition-colors font-medium"
                >
                  Villas
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-emerald-600 transition-colors font-medium"
                >
                  Commercial
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-900">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Mail className="w-5 h-5 text-emerald-600 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-600">
                  support@emeraldestates.com
                </span>
              </li>
              <li className="flex items-start">
                <Phone className="w-5 h-5 text-emerald-600 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-600">+1 (555) 123-4567</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Emerald Estates. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-500 hover:text-emerald-600 transition-colors font-medium">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-500 hover:text-emerald-600 transition-colors font-medium">
                Terms of Service
              </a>
              <a href="#" className="text-gray-500 hover:text-emerald-600 transition-colors font-medium">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;