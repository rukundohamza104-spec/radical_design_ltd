import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  imageUrl: string;
  visible: boolean;
  createdAt: string;
}

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Individual service images mapping (fallback for hardcoded services)
  const serviceImages: Record<string, string> = {
    "Glossy Stickers": "https://cdn.builder.io/api/v1/image/assets%2F4890b49a9ba247bcad934e561cfa834f%2Fa245e588537f48478fb7705a5ace0a79?format=webp&width=800&height=1200",
    "Matt Stickers": "https://cdn.builder.io/api/v1/image/assets%2F4890b49a9ba247bcad934e561cfa834f%2F99b404b98d7d4aa79d9ea370854af61a?format=webp&width=800&height=1200",
    "One Way Vision Stickers": "https://cdn.builder.io/api/v1/image/assets%2F4890b49a9ba247bcad934e561cfa834f%2Fa59a59ba383044e2bbc8bc27c8dfd8ae?format=webp&width=800&height=1200",
    "Frost Stickers": "https://cdn.builder.io/api/v1/image/assets%2F4890b49a9ba247bcad934e561cfa834f%2F8bca78a8833745ed95113219e7cc8d4f?format=webp&width=800&height=1200",
    "Pull Up Materials": "https://cdn.builder.io/api/v1/image/assets%2F4890b49a9ba247bcad934e561cfa834f%2Fee2317202c3a46098988b9c3f36f923b?format=webp&width=800&height=1200",
    "Backlit Printing": "https://cdn.builder.io/api/v1/image/assets%2F4890b49a9ba247bcad934e561cfa834f%2F862b1ba6ef244574bb3eb5ed072c5380?format=webp&width=800&height=1200",
    "White & White Banner Rolls": "https://cdn.builder.io/api/v1/image/assets%2F4890b49a9ba247bcad934e561cfa834f%2Fdceef13c916b47d5a6aedcfa642d30e1?format=webp&width=800&height=1200",
    "Wide Base & Small Base Pull-Up Stands": "https://cdn.builder.io/api/v1/image/assets%2F4890b49a9ba247bcad934e561cfa834f%2F20cf6078da3b4df19a458ff184872630?format=webp&width=800&height=1200",
    "Mini Pull Ups (A4, A3)": "https://cdn.builder.io/api/v1/image/assets%2F4890b49a9ba247bcad934e561cfa834f%2F3963e70b7ec74123834500ac3701bd91?format=webp&width=800&height=1200",
    "Teardrop Stands (1.8m, 2.5m, 5.5m)": "https://cdn.builder.io/api/v1/image/assets%2F4890b49a9ba247bcad934e561cfa834f%2F95b95f8a64f44d8788153d03b37f9869?format=webp&width=800&height=1200",
    "Square Flags": "https://cdn.builder.io/api/v1/image/assets%2F4890b49a9ba247bcad934e561cfa834f%2Ffb76e529d4ec425292caba34389c8001?format=webp&width=800&height=1200",
    "Feather Stands": "https://cdn.builder.io/api/v1/image/assets%2F4890b49a9ba247bcad934e561cfa834f%2F999e2d597ce743888d64d819464d69b3?format=webp&width=800&height=1200",
    "Snapper Frames (A1, A2, A0)": "https://cdn.builder.io/api/v1/image/assets%2F4890b49a9ba247bcad934e561cfa834f%2Fc2ce117a57084e2aa8fba0887938d999?format=webp&width=800&height=1200",
    "Custom Mugs": "https://cdn.builder.io/api/v1/image/assets%2F4890b49a9ba247bcad934e561cfa834f%2Fab74f4d1e34f492d86ccb7e8a5b58b23?format=webp&width=800&height=1200",
    "Mini Flag Stands": "https://cdn.builder.io/api/v1/image/assets%2F4890b49a9ba247bcad934e561cfa834f%2F89376f1a8d594f73b68b90a5de3ec862?format=webp&width=800&height=1200",
    "Acrylic Menu Stands (A5, A6)": "https://cdn.builder.io/api/v1/image/assets%2F4890b49a9ba247bcad934e561cfa834f%2F3a02d7f5bd1f4b3bacf1ecfedaf41ab4?format=webp&width=800&height=1200",
  };

  // Fallback hardcoded services (used if API fails)
  const fallbackServices = [
    { name: "Glossy Stickers", category: "Stickers" },
    { name: "Matt Stickers", category: "Stickers" },
    { name: "One Way Vision Stickers", category: "Stickers" },
    { name: "Frost Stickers", category: "Stickers" },
    { name: "Pull Up Materials", category: "Banners" },
    { name: "Backlit Printing", category: "Banners" },
    { name: "White & White Banner Rolls", category: "Banners" },
    { name: "Wide Base & Small Base Pull-Up Stands", category: "Stands" },
    { name: "Mini Pull Ups (A4, A3)", category: "Stands" },
    { name: "Teardrop Stands (1.8m, 2.5m, 5.5m)", category: "Stands" },
    { name: "Square Flags", category: "Flags" },
    { name: "Feather Stands", category: "Flags" },
    { name: "Snapper Frames (A1, A2, A0)", category: "Frames" },
    { name: "Custom Mugs", category: "Merchandise" },
    { name: "Mini Flag Stands", category: "Stands" },
    { name: "Acrylic Menu Stands (A5, A6)", category: "Stands" },
  ];

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/services");

        if (response.ok) {
          const data = await response.json();
          setServices(data);
          setError(null);
        } else {
          throw new Error("Failed to fetch services");
        }
      } catch (err) {
        console.error("Error fetching services:", err);
        setError("Unable to load services from database");
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-accent/10 to-background">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Our Services
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Complete range of professional printing and media solutions
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Loading services...</p>
            </div>
          ) : error && services.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">{error}</p>
              <p className="text-muted-foreground text-sm">Please try again later</p>
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No services available at the moment</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="bg-card rounded-lg overflow-hidden border border-border hover:border-accent hover:shadow-lg transition-all flex flex-col"
                >
                  {/* Service Image */}
                  <div className="h-48 bg-muted overflow-hidden">
                    <img
                      src={service.imageUrl}
                      alt={service.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        // Fallback to placeholder if image fails to load
                        e.currentTarget.src = "https://via.placeholder.com/400x300?text=" + encodeURIComponent(service.name);
                      }}
                    />
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    <span className="inline-block text-xs font-semibold text-accent bg-accent/10 px-3 py-1 rounded-full mb-3 w-fit">
                      {service.category}
                    </span>
                    <h3 className="text-lg font-bold text-foreground mb-2">
                      {service.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 flex-grow">
                      {service.description}
                    </p>
                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-2 text-accent hover:text-amber-500 text-sm font-semibold transition-colors"
                    >
                      Get Quote <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-16 p-8 bg-accent/10 rounded-xl border border-accent/20 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Ready to discuss your project?
            </h2>
            <p className="text-muted-foreground mb-6">
              Contact us for detailed pricing and custom solutions
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-amber-500 text-accent-foreground px-8 py-3 rounded-lg font-semibold transition-all"
            >
              Get in Touch
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
