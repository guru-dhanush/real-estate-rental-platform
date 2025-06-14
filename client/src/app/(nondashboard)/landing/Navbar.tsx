import { useState, useEffect } from "react";
import { Menu, X, Home, User, Globe } from "lucide-react";
import Button from "@/components/ui/button/Button";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? "bg-white/90 backdrop-blur-md shadow-md py-3"
          : "bg-transparent py-5"
        }`}
    >
      <div className="container mx-auto flex justify-between items-center px-4 md:px-8">
        <div className="flex items-center">
          <Home className="w-8 h-8 text-emerald-700 mr-2" />
          <h1 className="text-xl font-bold text-gray-900">
            <span className="text-emerald-700">Emerald</span> Estates
          </h1>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <a
            href="#"
            className="text-gray-700 hover:text-emerald-700 transition-colors duration-200"
          >
            Home
          </a>
          <a
            href="#features"
            className="text-gray-700 hover:text-emerald-700 transition-colors duration-200"
          >
            Features
          </a>
          <a
            href="#discover"
            className="text-gray-700 hover:text-emerald-700 transition-colors duration-200"
          >
            Discover
          </a>
          <a
            href="#contact"
            className="text-gray-700 hover:text-emerald-700 transition-colors duration-200"
          >
            Contact
          </a>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <Button
            variant="outline"
            className="rounded-full flex items-center gap-2 hover:bg-emerald-50 border-emerald-700 text-emerald-700"
          >
            <Globe className="w-4 h-4" />
            <span>Explore</span>
          </Button>
          <Button className="rounded-full bg-emerald-700 hover:bg-emerald-600 flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>Sign In</span>
          </Button>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="w-6 h-6 text-gray-700" />
          ) : (
            <Menu className="w-6 h-6 text-gray-700" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white absolute top-full left-0 right-0 shadow-lg animate-fade-in">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <a
              href="#"
              className="text-gray-700 hover:text-emerald-700 py-2 transition-colors duration-200"
            >
              Home
            </a>
            <a
              href="#features"
              className="text-gray-700 hover:text-emerald-700 py-2 transition-colors duration-200"
            >
              Features
            </a>
            <a
              href="#discover"
              className="text-gray-700 hover:text-emerald-700 py-2 transition-colors duration-200"
            >
              Discover
            </a>
            <a
              href="#contact"
              className="text-gray-700 hover:text-emerald-700 py-2 transition-colors duration-200"
            >
              Contact
            </a>
            <div className="flex flex-col space-y-2 pt-2">
              <Button
                variant="outline"
                className="rounded-full justify-center flex items-center gap-2 border-emerald-700 text-emerald-700"
              >
                <Globe className="w-4 h-4" />
                <span>Explore</span>
              </Button>
              <Button className="rounded-full justify-center bg-emerald-700 hover:bg-emerald-600 flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
