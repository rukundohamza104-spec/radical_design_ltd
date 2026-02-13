import { Link } from "react-router-dom";
import { ArrowRight, Check, Phone, Mail } from "lucide-react";
import Layout from "@/components/Layout";

export default function Home() {
  const services = [
    {
      id: 1,
      title: "Glossy Stickers",
      image: "https://images.pexels.com/photos/9999871/pexels-photo-9999871.jpeg",
      description: "Vibrant, durable stickers with glossy finish",
    },
    {
      id: 2,
      title: "Pull-Up Banners",
      image: "https://cdn.builder.io/api/v1/image/assets%2F4890b49a9ba247bcad934e561cfa834f%2F87273f09c20645c18505af99bfc981c5?format=webp&width=800&height=1200",
      description: "Professional retractable banner stands",
    },
    {
      id: 3,
      title: "Banner Printing",
      image: "https://cdn.builder.io/o/assets%2F4890b49a9ba247bcad934e561cfa834f%2F594634fc05184df7b53cc4fd0fe06033?alt=media&token=2f2184c7-7c16-4ab9-940a-0bec36776645&apiKey=4890b49a9ba247bcad934e561cfa834f",
      description: "Custom printed banners and signage",
    },
    {
      id: 4,
      title: "Branded Mugs",
      image: "https://cdn.builder.io/api/v1/image/assets%2F4890b49a9ba247bcad934e561cfa834f%2F0ebd38e32d93425d93581ee1d49066c8?format=webp&width=800&height=1200",
      description: "Customizable branded merchandise",
    },
    {
      id: 5,
      title: "Flags & Stands",
      image: "https://cdn.builder.io/api/v1/image/assets%2F4890b49a9ba247bcad934e561cfa834f%2F1db92451968f4cfcb4252eee915009b4?format=webp&width=800&height=1200",
      description: "Event flags and display stands",
    },
    {
      id: 6,
      title: "Vehicle Wraps",
      image: "https://cdn.builder.io/api/v1/image/assets%2F4890b49a9ba247bcad934e561cfa834f%2Fd1ec6dfa3cef4296a2431010c02c33e8?format=webp&width=800&height=1200",
      description: "Professional vinyl wrap installation",
    },
  ];

  const features = [
    {
      icon: "✓",
      title: "Best Quality Prints",
      description: "Premium materials and professional printing techniques",
    },
    {
      icon: "✓",
      title: "Affordable Prices",
      description: "Competitive rates without compromising quality",
    },
    {
      icon: "✓",
      title: "Fast Turnaround",
      description: "Quick delivery without sacrificing excellence",
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative w-full h-screen min-h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/20042067/pexels-photo-20042067.jpeg"
            alt="Professional printing machine"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 dark:bg-black/50"></div>
        </div>

        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <div className="max-w-2xl animate-fade-in">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Your Trusted Partner in Printing & Media Solutions
            </h1>

            <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-xl mx-auto">
              We provide all types of printing materials with special exclusive rates and the best quality.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-amber-500 text-accent-foreground px-8 py-3 rounded-lg font-semibold transition-all hover:scale-105"
              >
                Get a Quote
                <ArrowRight className="w-5 h-5" />
              </Link>

              <a
                href="https://wa.me/250788470294"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-white px-8 py-3 rounded-lg font-semibold transition-all backdrop-blur-sm border border-white/30"
              >
                <Phone className="w-5 h-5" />
                WhatsApp Now
              </a>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex items-start justify-center pt-2">
            <div className="w-1 h-2 bg-white rounded-full animate-bounce"></div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Services
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our complete range of professional printing and media services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="group bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 animate-slide-up"
              >
                <div className="relative h-48 overflow-hidden bg-muted">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {service.description}
                  </p>
                  <Link
                    to="/services"
                    className="inline-flex items-center gap-2 text-accent hover:text-amber-500 font-semibold text-sm transition-colors"
                  >
                    Learn More
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/services"
              className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-amber-500 text-accent-foreground px-8 py-3 rounded-lg font-semibold transition-all"
            >
              View All Services
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-4 bg-secondary text-secondary-foreground">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose RADICAL DESIGN?
            </h2>
            <p className="text-lg opacity-75 max-w-2xl mx-auto">
              We are committed to delivering excellence in every project
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-8 rounded-xl bg-foreground/5 hover:bg-foreground/10 transition-colors animate-slide-up"
              >
                <div className="w-16 h-16 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="opacity-75">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 px-4 bg-accent">
        <div className="container mx-auto text-center animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-accent-foreground mb-4">
            Ready to Start Your Project?
          </h2>
          <p className="text-lg text-accent-foreground/90 mb-8 max-w-2xl mx-auto">
            Contact us today and let's bring your vision to life with professional printing solutions.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/250788470294"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-accent-foreground hover:bg-white text-accent px-8 py-3 rounded-lg font-semibold transition-all"
            >
              <Phone className="w-5 h-5" />
              WhatsApp: 0788 470 294
            </a>

            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-accent-foreground px-8 py-3 rounded-lg font-semibold transition-all backdrop-blur-sm border border-white/30"
            >
              <Mail className="w-5 h-5" />
              Contact Form
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
