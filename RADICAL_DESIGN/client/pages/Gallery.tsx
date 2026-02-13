import Layout from "@/components/Layout";
import { useState, useEffect } from "react";

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image: string;
}

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch gallery from API on mount
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await fetch("/api/admin/gallery");
        if (response.ok) {
          const data = await response.json();
          // Filter to show only visible images and map to gallery items
          const items = data
            .filter((img: any) => img.visible !== false)
            .map((img: any) => ({
              id: img.id,
              title: img.title,
              category: img.category,
              image: img.imageUrl,
            }));
          setGalleryItems(items);
        }
      } catch (error) {
        console.error("Failed to fetch gallery:", error);
        // Fallback to defaults if API fails
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  // Default items if none are fetched (for backwards compatibility)
  const defaultItems = [
    {
      id: "1",
      image: "https://images.pexels.com/photos/9999871/pexels-photo-9999871.jpeg",
      category: "Stickers",
      title: "Custom Sticker Collection",
    },
    {
      id: "2",
      image: "https://cdn.builder.io/api/v1/image/assets%2F4890b49a9ba247bcad934e561cfa834f%2Fa24a9fb2d3e64fb98ec3d20a395c90b5?format=webp&width=800&height=1200",
      category: "Banners",
      title: "Professional Pull-Up Banner",
    },
    {
      id: "3",
      image: "https://cdn.builder.io/o/assets%2F4890b49a9ba247bcad934e561cfa834f%2Ffa167a2fa9dc40f0a37150ff4755ae36?alt=media&token=da59e727-0c3c-4ebd-9ada-0d6169433e20&apiKey=4890b49a9ba247bcad934e561cfa834f",
      category: "Events",
      title: "Event Signage Setup",
    },
    {
      id: "4",
      image: "https://cdn.builder.io/api/v1/image/assets%2F4890b49a9ba247bcad934e561cfa834f%2F701e94da1f9a4c82a89e8400739ebfb5?format=webp&width=800&height=1200",
      category: "Merchandise",
      title: "Branded Products Display",
    },
    {
      id: "5",
      image: "https://cdn.builder.io/api/v1/image/assets%2F4890b49a9ba247bcad934e561cfa834f%2F4d501dff8822408cb0c4aa7212dc574f?format=webp&width=800&height=1200",
      category: "Flags",
      title: "Outdoor Flag Installation",
    },
    {
      id: "6",
      image: "https://cdn.builder.io/api/v1/image/assets%2F4890b49a9ba247bcad934e561cfa834f%2Fe3f0495c8b264b60ac5ef04dd1d9f104?format=webp&width=800&height=1200",
      category: "Branding",
      title: "Vehicle Wrap Project",
    },
  ];

  const filters = ["All", "Stickers", "Banners", "Flags", "Events", "Branding", "Merchandise"];

  // Use fetched items or defaults if none fetched
  const displayItems = galleryItems.length > 0 ? galleryItems : defaultItems;

  const filteredItems = activeFilter === "All"
    ? displayItems
    : displayItems.filter(item => item.category === activeFilter);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-accent/10 to-background">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Our Gallery
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our recent projects and professional work
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 px-4 bg-background border-b border-border">
        <div className="container mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2 rounded-full font-semibold transition-all text-sm sm:text-base ${
                  activeFilter === filter
                    ? "bg-accent text-accent-foreground"
                    : "bg-card border border-border hover:border-accent text-foreground"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Loading gallery...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-end">
                      <div className="w-full p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <p className="text-sm font-semibold text-accent mb-1">
                          {item.category}
                        </p>
                        <h3 className="text-lg font-bold">{item.title}</h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredItems.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">
                    No projects found in this category. Check back soon!
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </Layout>
  );
}
