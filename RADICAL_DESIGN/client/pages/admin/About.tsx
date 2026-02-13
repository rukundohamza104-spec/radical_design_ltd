import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { useAdmin } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Check } from "lucide-react";

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

export default function AdminAbout() {
  const { sessionId } = useAdmin();
  const { toast } = useToast();

  const [content, setContent] = useState<AboutContent>({
    heroTitle: "",
    heroSubtitle: "",
    storyTitle: "",
    storyContent: "",
    mission: "",
    vision: "",
    values: [
      { title: "", description: "" },
      { title: "", description: "" },
      { title: "", description: "" },
    ],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Fetch about content
  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/about", {
        headers: {
          "x-admin-session": sessionId || "",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setContent(data);
      } else {
        toast({
          title: "Error",
          description: "Failed to load about content",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to fetch about:", error);
      toast({
        title: "Error",
        description: "Failed to load about content",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Save content
  const handleSave = async () => {
    try {
      setSaving(true);

      const response = await fetch("/api/admin/about", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-session": sessionId || "",
        },
        body: JSON.stringify(content),
      });

      if (response.ok) {
        setHasChanges(false);
        setLastSaved(new Date());
        toast({
          title: "Success",
          description: "About content saved successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to save about content",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to save:", error);
      toast({
        title: "Error",
        description: "Failed to save about content",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Handle discard changes
  const handleDiscard = () => {
    if (confirm("Are you sure you want to discard all changes?")) {
      fetchContent();
      setHasChanges(false);
    }
  };

  // Track changes
  const handleChange = (key: string, value: any) => {
    setContent({ ...content, [key]: value });
    setHasChanges(true);
  };

  // Handle value change
  const handleValueChange = (index: number, field: "title" | "description", value: string) => {
    const newValues = [...content.values];
    newValues[index] = { ...newValues[index], [field]: value };
    setContent({ ...content, values: newValues });
    setHasChanges(true);
  };

  useEffect(() => {
    if (sessionId) {
      fetchContent();
    }
  }, [sessionId]);

  return (
    <AdminLayout>
      <div className="space-y-6 px-2 sm:px-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">About Page</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Manage your about page content
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              onClick={handleDiscard}
              variant="outline"
              disabled={!hasChanges || saving}
              className="flex-1 sm:flex-none text-xs sm:text-sm"
            >
              Discard
            </Button>
            <Button
              onClick={handleSave}
              disabled={!hasChanges || saving}
              className="flex-1 sm:flex-none gap-2 text-xs sm:text-sm"
            >
              {saving ? "Saving..." : (
                <>
                  <Check className="w-4 h-4" />
                  Save
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Unsaved Changes Alert */}
        {hasChanges && (
          <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                You have unsaved changes
              </p>
              <p className="text-xs text-amber-800 dark:text-amber-300">
                Click Save to apply your changes to the website
              </p>
            </div>
          </div>
        )}

        {/* Last Saved */}
        {lastSaved && !hasChanges && (
          <div className="text-xs text-muted-foreground">
            Last saved: {lastSaved.toLocaleTimeString()}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Loading content...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="bg-card rounded-lg border border-border p-4 sm:p-6 space-y-4">
              <h2 className="text-lg sm:text-xl font-bold text-foreground">Hero Section</h2>

              <div className="space-y-2">
                <Label htmlFor="heroTitle">Hero Title</Label>
                <Input
                  id="heroTitle"
                  value={content.heroTitle}
                  onChange={(e) => handleChange("heroTitle", e.target.value)}
                  placeholder="e.g., About RADICAL DESIGN"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
                <Input
                  id="heroSubtitle"
                  value={content.heroSubtitle}
                  onChange={(e) => handleChange("heroSubtitle", e.target.value)}
                  placeholder="e.g., Your trusted partner in printing and media solutions"
                />
              </div>
            </div>

            {/* Story Section */}
            <div className="bg-card rounded-lg border border-border p-4 sm:p-6 space-y-4">
              <h2 className="text-lg sm:text-xl font-bold text-foreground">Our Story</h2>

              <div className="space-y-2">
                <Label htmlFor="storyTitle">Story Title</Label>
                <Input
                  id="storyTitle"
                  value={content.storyTitle}
                  onChange={(e) => handleChange("storyTitle", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="storyContent">Story Content</Label>
                <Textarea
                  id="storyContent"
                  value={content.storyContent}
                  onChange={(e) => handleChange("storyContent", e.target.value)}
                  rows={4}
                  className="text-sm"
                />
              </div>
            </div>

            {/* Mission & Vision */}
            <div className="bg-card rounded-lg border border-border p-4 sm:p-6 space-y-4">
              <h2 className="text-lg sm:text-xl font-bold text-foreground">Mission & Vision</h2>

              <div className="space-y-2">
                <Label htmlFor="mission">Mission</Label>
                <Textarea
                  id="mission"
                  value={content.mission}
                  onChange={(e) => handleChange("mission", e.target.value)}
                  rows={3}
                  className="text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vision">Vision</Label>
                <Textarea
                  id="vision"
                  value={content.vision}
                  onChange={(e) => handleChange("vision", e.target.value)}
                  rows={3}
                  className="text-sm"
                />
              </div>
            </div>

            {/* Values */}
            <div className="bg-card rounded-lg border border-border p-4 sm:p-6 space-y-4">
              <h2 className="text-lg sm:text-xl font-bold text-foreground">Our Values</h2>

              {content.values.map((value, index) => (
                <div key={index} className="p-4 bg-muted/50 rounded-lg space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor={`value-title-${index}`}>Value {index + 1} Title</Label>
                    <Input
                      id={`value-title-${index}`}
                      value={value.title}
                      onChange={(e) =>
                        handleValueChange(index, "title", e.target.value)
                      }
                      placeholder="e.g., Quality Excellence"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`value-desc-${index}`}>Value {index + 1} Description</Label>
                    <Textarea
                      id={`value-desc-${index}`}
                      value={value.description}
                      onChange={(e) =>
                        handleValueChange(index, "description", e.target.value)
                      }
                      rows={2}
                      placeholder="e.g., Premium materials and professional techniques for every project"
                      className="text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
