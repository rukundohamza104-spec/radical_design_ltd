import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { useAdmin } from "@/contexts/AdminContext";
import { Save, FileText, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

interface ContentData {
  homeTitle: string;
  homeSubtitle: string;
  homeDescription: string;
  aboutTitle: string;
  aboutContent: string;
  aboutMission: string;
  aboutVision: string;
  aboutValues: string;
}

export default function AdminContent() {
  const { sessionId } = useAdmin();
  const { toast } = useToast();

  const [content, setContent] = useState<ContentData>({
    homeTitle: "",
    homeSubtitle: "",
    homeDescription: "",
    aboutTitle: "",
    aboutContent: "",
    aboutMission: "",
    aboutVision: "",
    aboutValues: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // Load content from settings
  const loadContent = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/settings", {
        headers: {
          "x-admin-session": sessionId || "",
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Load from settings or use defaults
        setContent({
          homeTitle: data.homeTitle || "Professional Design & Media Services",
          homeSubtitle: data.homeSubtitle || "Creative Solutions for Your Brand",
          homeDescription: data.homeDescription || "We deliver high-quality printing and media services tailored to your business needs.",
          aboutTitle: data.aboutTitle || "About RADICAL DESIGN",
          aboutContent: data.aboutContent || "We are a creative agency specializing in printing and media solutions.",
          aboutMission: data.aboutMission || "To deliver exceptional creative solutions that transform businesses.",
          aboutVision: data.aboutVision || "To be the leading creative agency in East Africa.",
          aboutValues: data.aboutValues || "Innovation, Quality, Integrity, Client Focus",
        });
        setHasChanges(false);
      }
    } catch (error) {
      console.error("Failed to load content:", error);
      toast({
        title: "Error",
        description: "Failed to load content settings",
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
      const response = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-session": sessionId || "",
        },
        body: JSON.stringify(content),
      });

      if (response.ok) {
        setHasChanges(false);
        setLastSaved(new Date().toLocaleTimeString());
        toast({
          title: "Success",
          description: "Content updated successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to save content",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to save content:", error);
      toast({
        title: "Error",
        description: "Failed to save content",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Handle field changes
  const handleFieldChange = (field: keyof ContentData, value: string) => {
    setContent({ ...content, [field]: value });
    setHasChanges(true);
  };

  useEffect(() => {
    if (sessionId) {
      loadContent();
    }
  }, [sessionId]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading content...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Content Management</h1>
          <p className="text-muted-foreground mt-1">
            Edit your website's homepage and about page content
          </p>
        </div>

        {/* Alerts */}
        {hasChanges && (
          <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-700 dark:text-amber-400">
              You have unsaved changes. Click "Save Changes" to update your content.
            </AlertDescription>
          </Alert>
        )}

        {lastSaved && (
          <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20">
            <AlertDescription className="text-green-700 dark:text-green-400">
              Last saved: {lastSaved}
            </AlertDescription>
          </Alert>
        )}

        {/* Tabs */}
        <Tabs defaultValue="homepage" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="homepage" className="gap-2">
              <FileText className="w-4 h-4" />
              Homepage
            </TabsTrigger>
            <TabsTrigger value="about" className="gap-2">
              <FileText className="w-4 h-4" />
              About Us
            </TabsTrigger>
          </TabsList>

          {/* Homepage Tab */}
          <TabsContent value="homepage" className="space-y-6 mt-6">
            <div className="space-y-4">
              {/* Hero Title */}
              <div className="space-y-2">
                <Label htmlFor="homeTitle" className="text-base font-semibold">
                  Hero Title
                </Label>
                <Input
                  id="homeTitle"
                  value={content.homeTitle}
                  onChange={(e) =>
                    handleFieldChange("homeTitle", e.target.value)
                  }
                  placeholder="Main heading for your homepage"
                  className="text-lg"
                />
                <p className="text-sm text-muted-foreground">
                  This is the main heading displayed on your homepage hero section
                </p>
              </div>

              {/* Hero Subtitle */}
              <div className="space-y-2">
                <Label
                  htmlFor="homeSubtitle"
                  className="text-base font-semibold"
                >
                  Hero Subtitle
                </Label>
                <Input
                  id="homeSubtitle"
                  value={content.homeSubtitle}
                  onChange={(e) =>
                    handleFieldChange("homeSubtitle", e.target.value)
                  }
                  placeholder="Subheading for your homepage"
                />
                <p className="text-sm text-muted-foreground">
                  Secondary heading below the main title
                </p>
              </div>

              {/* Home Description */}
              <div className="space-y-2">
                <Label
                  htmlFor="homeDescription"
                  className="text-base font-semibold"
                >
                  Homepage Description
                </Label>
                <Textarea
                  id="homeDescription"
                  value={content.homeDescription}
                  onChange={(e) =>
                    handleFieldChange("homeDescription", e.target.value)
                  }
                  placeholder="Brief description shown on your homepage"
                  rows={6}
                />
                <p className="text-sm text-muted-foreground">
                  This text appears in your homepage hero section
                </p>
              </div>
            </div>
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about" className="space-y-6 mt-6">
            <div className="space-y-4">
              {/* About Title */}
              <div className="space-y-2">
                <Label htmlFor="aboutTitle" className="text-base font-semibold">
                  Page Title
                </Label>
                <Input
                  id="aboutTitle"
                  value={content.aboutTitle}
                  onChange={(e) =>
                    handleFieldChange("aboutTitle", e.target.value)
                  }
                  placeholder="About page title"
                />
              </div>

              {/* About Content */}
              <div className="space-y-2">
                <Label
                  htmlFor="aboutContent"
                  className="text-base font-semibold"
                >
                  About Content
                </Label>
                <Textarea
                  id="aboutContent"
                  value={content.aboutContent}
                  onChange={(e) =>
                    handleFieldChange("aboutContent", e.target.value)
                  }
                  placeholder="Main content for your about page"
                  rows={6}
                />
                <p className="text-sm text-muted-foreground">
                  Main description about your company
                </p>
              </div>

              {/* Mission */}
              <div className="space-y-2">
                <Label htmlFor="aboutMission" className="text-base font-semibold">
                  Our Mission
                </Label>
                <Textarea
                  id="aboutMission"
                  value={content.aboutMission}
                  onChange={(e) =>
                    handleFieldChange("aboutMission", e.target.value)
                  }
                  placeholder="What is your mission?"
                  rows={4}
                />
              </div>

              {/* Vision */}
              <div className="space-y-2">
                <Label htmlFor="aboutVision" className="text-base font-semibold">
                  Our Vision
                </Label>
                <Textarea
                  id="aboutVision"
                  value={content.aboutVision}
                  onChange={(e) =>
                    handleFieldChange("aboutVision", e.target.value)
                  }
                  placeholder="What is your vision for the future?"
                  rows={4}
                />
              </div>

              {/* Values */}
              <div className="space-y-2">
                <Label htmlFor="aboutValues" className="text-base font-semibold">
                  Our Values
                </Label>
                <Textarea
                  id="aboutValues"
                  value={content.aboutValues}
                  onChange={(e) =>
                    handleFieldChange("aboutValues", e.target.value)
                  }
                  placeholder="Core values (separate with comma)"
                  rows={4}
                />
                <p className="text-sm text-muted-foreground">
                  List your core values separated by commas
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="flex justify-end gap-2 pt-6 border-t">
          <Button
            variant="outline"
            onClick={() => {
              loadContent();
              setHasChanges(false);
            }}
            disabled={saving}
          >
            Discard Changes
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className="gap-2"
            size="lg"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
