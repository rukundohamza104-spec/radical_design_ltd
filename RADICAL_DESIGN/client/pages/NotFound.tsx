import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <Layout>
      <section className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-20 bg-background">
        <div className="text-center max-w-2xl">
          <div className="text-8xl font-bold text-accent mb-4">404</div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Page Not Found
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-amber-500 text-accent-foreground px-8 py-3 rounded-lg font-semibold transition-all"
            >
              Back to Home
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-card border border-border hover:border-accent text-foreground px-8 py-3 rounded-lg font-semibold transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default NotFound;
