import Layout from "@/components/Layout";
import { Check, Award, Users, Zap } from "lucide-react";
import { useEffect, useState } from "react";

interface AboutContent {
  heroTitle: string;
  heroSubtitle: string;
  storyTitle: string;
  storyContent: string;
  mission: string;
  vision: string;
  values: Array<{
    title: string;
    description: string;
  }>;
}

export default function About() {
  const [content, setContent] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);

  const defaultValues = [
    {
      icon: Award,
      title: "Quality Excellence",
      description: "Premium materials and professional techniques for every project",
    },
    {
      icon: Users,
      title: "Customer Focus",
      description: "Your satisfaction is our top priority in every interaction",
    },
    {
      icon: Zap,
      title: "Fast Service",
      description: "Quick turnaround without compromising on quality standards",
    },
  ];

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch("/api/about");
        if (response.ok) {
          const data = await response.json();
          setContent(data);
        }
      } catch (error) {
        console.error("Failed to fetch about content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const values = content?.values || defaultValues;

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 bg-gradient-to-b from-accent/10 to-background">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3 sm:mb-4">
            {content?.heroTitle || "About RADICAL DESIGN"}
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            {content?.heroSubtitle || "Your trusted partner in printing and media solutions"}
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 bg-background">
        <div className="container mx-auto max-w-3xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center mb-8 md:mb-12">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 sm:mb-6">
                {content?.storyTitle || "Our Story"}
              </h2>
              <p className="text-sm sm:text-base text-foreground/80 mb-3 sm:mb-4">
                {content?.storyContent || "RADICAL DESIGN Ltd has been serving businesses and organizations with premium printing and media solutions. We combine modern technology with traditional craftsmanship to deliver exceptional results."}
              </p>
              <p className="text-sm sm:text-base text-foreground/80">
                Our commitment to quality, affordability, and fast turnaround has made
                us the preferred choice for printing and branding solutions across the region.
              </p>
            </div>

            <div className="bg-gradient-to-br from-accent/20 to-accent/5 rounded-lg h-48 sm:h-64 flex items-center justify-center">
              <img
                src="https://images.pexels.com/photos/20042067/pexels-photo-20042067.jpeg"
                alt="Our workspace"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 bg-secondary text-secondary-foreground">
        <div className="container mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 md:mb-12">Our Values</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {values.map((value, index) => {
              const icons = [Award, Users, Zap];
              const IconComponent = (value as any).icon || icons[index % icons.length];
              return (
                <div key={index} className="text-center">
                  <div className="w-14 sm:w-16 h-14 sm:h-16 bg-accent text-accent-foreground rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <IconComponent className="w-7 sm:w-8 h-7 sm:h-8" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2">{value.title}</h3>
                  <p className="text-sm sm:text-base opacity-75">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      {content && (content.mission || content.vision) && (
      <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 bg-muted">
        <div className="container mx-auto max-w-3xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {content.mission && (
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4">Our Mission</h3>
              <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">{content.mission}</p>
            </div>
            )}
            {content.vision && (
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4">Our Vision</h3>
              <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">{content.vision}</p>
            </div>
            )}
          </div>
        </div>
      </section>
      )}

      {/* Stats Section */}
      <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 bg-background">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 text-center">
            <div className="p-6 sm:p-8 bg-card rounded-lg border border-border">
              <div className="text-3xl sm:text-4xl font-bold text-accent mb-2">500+</div>
              <p className="text-sm sm:text-base text-foreground/80">Happy Clients</p>
            </div>

            <div className="p-6 sm:p-8 bg-card rounded-lg border border-border">
              <div className="text-3xl sm:text-4xl font-bold text-accent mb-2">1000+</div>
              <p className="text-sm sm:text-base text-foreground/80">Projects Completed</p>
            </div>

            <div className="p-6 sm:p-8 bg-card rounded-lg border border-border">
              <div className="text-3xl sm:text-4xl font-bold text-accent mb-2">10+</div>
              <p className="text-sm sm:text-base text-foreground/80">Years Experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-12 sm:py-16 md:py-24 px-3 sm:px-4 bg-accent/10">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-8 md:mb-12">
            Why Choose Us?
          </h2>

          <div className="space-y-3 sm:space-y-4">
            {[
              "Best quality prints using premium materials",
              "Affordable prices without quality compromise",
              "Fast turnaround on all projects",
              "Professional team with years of experience",
              "Custom solutions tailored to your needs",
              "Excellent customer service and support",
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4">
                <Check className="w-5 sm:w-6 h-5 sm:h-6 text-accent flex-shrink-0 mt-0.5 sm:mt-1" />
                <p className="text-sm sm:text-base text-foreground/80">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
