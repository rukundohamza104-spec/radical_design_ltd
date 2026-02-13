import { ReactNode, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Moon, Sun, Menu, X, Phone } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isDark, setIsDark] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldBeDark = savedTheme === "dark" || (savedTheme === null && prefersDark);

    setIsDark(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    localStorage.setItem("theme", newIsDark ? "dark" : "light");

    if (newIsDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Services", path: "/services" },
    { label: "Gallery", path: "/gallery" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background border-b border-border shadow-sm transition-colors duration-300">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center hover:opacity-80 transition-opacity"
            >
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F4890b49a9ba247bcad934e561cfa834f%2F1000bc9bb8174b8cbf158a41d040999e?format=webp&width=800"
                alt="RADICAL DESIGN Ltd"
                className="h-16 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-sm font-medium hover:text-accent transition-colors relative after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-0.5 after:bg-accent after:transition-all hover:after:w-full"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right side actions */}
            <div className="flex items-center gap-4">
              {/* Call button - visible on larger screens */}
              <a
                href="https://wa.me/250788470294"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-lg hover:bg-amber-500 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span className="text-sm font-medium">0788 470 294</span>
              </a>

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-muted transition-colors text-foreground"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <Sun className="w-5 h-5 text-amber-400" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <nav className="md:hidden mt-4 pt-4 border-t border-border flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-sm font-medium hover:text-accent transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <a
                href="https://wa.me/250788470294"
                target="_blank"
                rel="noopener noreferrer"
                className="lg:hidden flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-lg hover:bg-amber-500 transition-colors mt-2"
              >
                <Phone className="w-4 h-4" />
                <span className="text-sm font-medium">0788 470 294</span>
              </a>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-secondary text-secondary-foreground border-t border-border transition-colors duration-300">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div>
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F4890b49a9ba247bcad934e561cfa834f%2F1000bc9bb8174b8cbf158a41d040999e?format=webp&width=800"
                alt="RADICAL DESIGN Ltd"
                className="h-12 w-auto mb-4"
              />
              <p className="text-sm opacity-75">
                Your Partners in Printing Material and Media Services
              </p>
            </div>

            {/* Services */}
            <div>
              <h3 className="font-bold text-sm mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm opacity-75">
                <li>
                  <Link to="/services" className="hover:text-accent transition-colors">
                    Services
                  </Link>
                </li>
                <li>
                  <Link to="/gallery" className="hover:text-accent transition-colors">
                    Gallery
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-accent transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-accent transition-colors">
                    Contact
                  </Link>
                </li>
                <li className="pt-2 border-t border-foreground/20">
                  <Link to="/admin/login" className="hover:text-accent transition-colors font-semibold">
                    Admin Login
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-bold text-sm mb-4">Contact</h3>
              <ul className="space-y-2 text-sm opacity-75">
                <li>
                  <a
                    href="https://wa.me/250788470294"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-accent transition-colors"
                  >
                    WhatsApp: 0788 470 294
                  </a>
                </li>
                <li className="text-sm">
                  Chic Building, 2nd Floor
                  <br />
                  Room F019C
                </li>
              </ul>
            </div>

            {/* Social */}
            <div>
              <h3 className="font-bold text-sm mb-4">Follow Us</h3>
              <div className="flex flex-col gap-2 text-sm opacity-75">
                <a
                  href="https://instagram.com/radical_design_250"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors"
                >
                  Instagram: @radical_design_250
                </a>
                <a
                  href="https://snapchat.com/add/radicaldesign12"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors"
                >
                  Snapchat: radicaldesign12
                </a>
                <a
                  href="https://tiktok.com/@radical.design5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors"
                >
                  TikTok: @radical.design5
                </a>
                <a
                  href="https://facebook.com/Radical-design-Rw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors"
                >
                  Facebook: Radical design Rw
                </a>
                <a
                  href="https://x.com/radicaldesign13"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors"
                >
                  X: @radicaldesign13
                </a>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-foreground/10 pt-8 mt-8">
            <p className="text-center text-xs opacity-60">
              © 2026 RADICAL DESIGN Ltd. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
