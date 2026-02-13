import { useEffect, useState, useRef } from "react";
import AdminLayout from "@/components/AdminLayout";
import { useAdmin } from "@/contexts/AdminContext";
import { Trash2, Plus, Upload, Edit2, Image, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface GalleryImage {
  id: string;
  title: string;
  category: "Stickers" | "Banners" | "Mugs" | "Branding" | "Events";
  imageUrl: string;
  visible: boolean;
  createdAt: string;
}

const CATEGORIES: Array<"Stickers" | "Banners" | "Mugs" | "Branding" | "Events"> = [
  "Stickers",
  "Banners",
  "Mugs",
  "Branding",
  "Events",
];

export default function AdminGallery() {
  const { sessionId } = useAdmin();
  const { toast } = useToast();

  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    title: string;
    category: "Stickers" | "Banners" | "Mugs" | "Branding" | "Events";
    imageUrl: string;
    imageFile: File | null;
    visible: boolean;
  }>({
    title: "",
    category: "Stickers",
    imageUrl: "",
    imageFile: null,
    visible: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Error",
        description: "Please select a valid image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      setImagePreview(base64String);
      setFormData({ ...formData, imageUrl: base64String, imageFile: file });
    };
    reader.readAsDataURL(file);
  };

  // Clear selected file
  const handleClearFile = () => {
    setFormData({ ...formData, imageUrl: "", imageFile: null });
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Fetch gallery images
  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/gallery", {
        headers: {
          "x-admin-session": sessionId || "",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setImages(data);
      } else {
        toast({
          title: "Error",
          description: "Failed to load gallery images",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to fetch gallery:", error);
      toast({
        title: "Error",
        description: "Failed to load gallery images",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission (add or edit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter an image title",
        variant: "destructive",
      });
      return;
    }

    if (!formData.imageUrl.trim()) {
      toast({
        title: "Error",
        description: "Please select an image or provide a URL",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);

      if (editingId) {
        // Update existing image
        const response = await fetch(`/api/admin/gallery/${editingId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-admin-session": sessionId || "",
          },
          body: JSON.stringify({
            title: formData.title,
            category: formData.category,
            imageUrl: formData.imageUrl,
            visible: formData.visible,
          }),
        });

        if (response.ok) {
          const updated = await response.json();
          setImages(
            images.map((img) =>
              img.id === editingId ? updated : img
            )
          );
          toast({
            title: "Success",
            description: "Image updated successfully",
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to update image",
            variant: "destructive",
          });
        }
      } else {
        // Create new image
        const response = await fetch("/api/admin/gallery", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-admin-session": sessionId || "",
          },
          body: JSON.stringify({
            title: formData.title,
            category: formData.category,
            imageUrl: formData.imageUrl,
            visible: formData.visible,
          }),
        });

        if (response.ok) {
          const newImage = await response.json();
          setImages([newImage, ...images]);
          toast({
            title: "Success",
            description: "Image added successfully",
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to add image",
            variant: "destructive",
          });
        }
      }

      // Reset form
      setFormData({ title: "", category: "Stickers", imageUrl: "", imageFile: null, visible: true });
      setEditingId(null);
      setShowDialog(false);
    } catch (error) {
      console.error("Failed to submit form:", error);
      toast({
        title: "Error",
        description: "Failed to save image",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Open edit dialog
  const handleEdit = (image: GalleryImage) => {
    setFormData({
      title: image.title,
      category: image.category,
      imageUrl: image.imageUrl,
      imageFile: null,
      visible: image.visible,
    });
    setImagePreview(image.imageUrl);
    setEditingId(image.id);
    setShowDialog(true);
  };

  // Delete image
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      setDeleting(id);
      const response = await fetch(`/api/admin/gallery/${id}`, {
        method: "DELETE",
        headers: {
          "x-admin-session": sessionId || "",
        },
      });

      if (response.ok) {
        setImages(images.filter((img) => img.id !== id));
        toast({
          title: "Success",
          description: "Image deleted successfully",
        });
      }
    } catch (error) {
      console.error("Failed to delete image:", error);
      toast({
        title: "Error",
        description: "Failed to delete image",
        variant: "destructive",
      });
    } finally {
      setDeleting(null);
    }
  };

  // Close dialog
  const handleCloseDialog = () => {
    setShowDialog(false);
    setEditingId(null);
    setFormData({ title: "", category: "Stickers", imageUrl: "", imageFile: null, visible: true });
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Pre-populate gallery with product images on first load
  const initializeGallery = async () => {
    if (images.length === 0 && sessionId) {
      const productImages = [
        {
          title: "Glossy Stickers",
          category: "Stickers" as const,
          imageUrl: "https://cdn.builder.io/api/v1/image/assets%2F4890b49a9ba247bcad934e561cfa834f%2Fa245e588537f48478fb7705a5ace0a79?format=webp&width=800&height=1200",
          visible: true,
        },
        {
          title: "Matt Stickers",
          category: "Stickers" as const,
          imageUrl: "https://cdn.builder.io/api/v1/image/assets%2F4890b49a9ba247bcad934e561cfa834f%2F99b404b98d7d4aa79d9ea370854af61a?format=webp&width=800&height=1200",
        },
        {
          title: "One Way Vision Stickers",
          category: "Stickers" as const,
          imageUrl: "https://cdn.builder.io/api/v1/image/assets%2F4890b49a9ba247bcad934e561cfa834f%2Fa59a59ba383044e2bbc8bc27c8dfd8ae?format=webp&width=800&height=1200",
        },
        {
          title: "Frost Stickers",
          category: "Stickers" as const,
          imageUrl: "https://cdn.builder.io/api/v1/image/assets%2F4890b49a9ba247bcad934e561cfa834f%2F8bca78a8833745ed95113219e7cc8d4f?format=webp&width=800&height=1200",
        },
        {
          title: "Pull Up Materials",
          category: "Banners" as const,
          imageUrl: "https://cdn.builder.io/api/v1/image/assets%2F4890b49a9ba247bcad934e561cfa834f%2Fee2317202c3a46098988b9c3f36f923b?format=webp&width=800&height=1200",
        },
        {
          title: "Backlit Printing",
          category: "Banners" as const,
          imageUrl: "https://cdn.builder.io/api/v1/image/assets%2F4890b49a9ba247bcad934e561cfa834f%2F862b1ba6ef244574bb3eb5ed072c5380?format=webp&width=800&height=1200",
        },
        {
          title: "White & White Banner Rolls",
          category: "Banners" as const,
          imageUrl: "https://cdn.builder.io/api/v1/image/assets%2F4890b49a9ba247bcad934e561cfa834f%2Fdceef13c916b47d5a6aedcfa642d30e1?format=webp&width=800&height=1200",
        },
        {
          title: "Wide Base & Small Base Pull-Up Stands",
          category: "Branding" as const,
          imageUrl: "https://cdn.builder.io/api/v1/image/assets%2F4890b49a9ba247bcad934e561cfa834f%2F20cf6078da3b4df19a458ff184872630?format=webp&width=800&height=1200",
        },
        {
          title: "Mini Pull Ups (A4, A3)",
          category: "Branding" as const,
          imageUrl: "https://cdn.builder.io/api/v1/image/assets%2F4890b49a9ba247bcad934e561cfa834f%2F3963e70b7ec74123834500ac3701bd91?format=webp&width=800&height=1200",
        },
        {
          title: "Teardrop Stands (1.8m, 2.5m, 5.5m)",
          category: "Events" as const,
          imageUrl: "https://cdn.builder.io/api/v1/image/assets%2F4890b49a9ba247bcad934e561cfa834f%2F95b95f8a64f44d8788153d03b37f9869?format=webp&width=800&height=1200",
        },
        {
          title: "Square Flags",
          category: "Events" as const,
          imageUrl: "https://cdn.builder.io/api/v1/image/assets%2F4890b49a9ba247bcad934e561cfa834f%2Ffb76e529d4ec425292caba34389c8001?format=webp&width=800&height=1200",
        },
        {
          title: "Feather Stands",
          category: "Events" as const,
          imageUrl: "https://cdn.builder.io/api/v1/image/assets%2F4890b49a9ba247bcad934e561cfa834f%2F999e2d597ce743888d64d819464d69b3?format=webp&width=800&height=1200",
        },
        {
          title: "Snapper Frames (A1, A2, A0)",
          category: "Branding" as const,
          imageUrl: "https://cdn.builder.io/api/v1/image/assets%2F4890b49a9ba247bcad934e561cfa834f%2Fc2ce117a57084e2aa8fba0887938d999?format=webp&width=800&height=1200",
        },
        {
          title: "Custom Mugs",
          category: "Mugs" as const,
          imageUrl: "https://cdn.builder.io/api/v1/image/assets%2F4890b49a9ba247bcad934e561cfa834f%2Fab74f4d1e34f492d86ccb7e8a5b58b23?format=webp&width=800&height=1200",
        },
        {
          title: "Mini Flag Stands",
          category: "Events" as const,
          imageUrl: "https://cdn.builder.io/api/v1/image/assets%2F4890b49a9ba247bcad934e561cfa834f%2F89376f1a8d594f73b68b90a5de3ec862?format=webp&width=800&height=1200",
        },
        {
          title: "Acrylic Menu Stands (A5, A6)",
          category: "Branding" as const,
          imageUrl: "https://cdn.builder.io/api/v1/image/assets%2F4890b49a9ba247bcad934e561cfa834f%2F3a02d7f5bd1f4b3bacf1ecfedaf41ab4?format=webp&width=800&height=1200",
        },
      ];

      // Add all product images to the gallery
      for (const image of productImages) {
        try {
          await fetch("/api/admin/gallery", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-admin-session": sessionId,
            },
            body: JSON.stringify(image),
          });
        } catch (error) {
          console.error("Failed to add image:", error);
        }
      }

      // Refresh the gallery after initialization
      fetchImages();
    }
  };

  useEffect(() => {
    if (sessionId) {
      fetchImages();
    }
  }, [sessionId]);

  // Initialize gallery on first load
  useEffect(() => {
    if (loading === false && images.length === 0 && sessionId) {
      initializeGallery();
    }
  }, [loading, sessionId]);

  return (
    <AdminLayout>
      <div className="space-y-6 px-2 sm:px-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Gallery</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Manage your portfolio and gallery images
            </p>
          </div>
          <Button
            onClick={() => setShowDialog(true)}
            className="gap-2 w-full sm:w-auto"
            size="sm"
          >
            <Plus className="w-4 h-4" />
            Add Image
          </Button>
        </div>

        {/* Gallery Grid */}
        <div>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Loading gallery...</p>
            </div>
          ) : images.length === 0 ? (
            <div className="border-2 border-dashed rounded-lg p-12 text-center">
              <Image className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="font-semibold text-lg mb-2">No images yet</h3>
              <p className="text-muted-foreground mb-6">
                Add your first gallery image to get started
              </p>
              <Button onClick={() => setShowDialog(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Add First Image
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="border rounded-lg overflow-hidden bg-muted/50 hover:shadow-lg transition-shadow"
                >
                  {/* Image */}
                  <div className="aspect-square overflow-hidden bg-muted">
                    <img
                      src={image.imageUrl}
                      alt={image.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-3 sm:p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground line-clamp-2 text-sm sm:text-base">
                          {image.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {image.category}
                        </p>
                      </div>
                      {image.visible && (
                        <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded whitespace-nowrap">
                          Live
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(image)}
                        className="flex-1 min-w-[60px] gap-1 text-xs sm:text-sm"
                      >
                        <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Edit</span>
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(image.id)}
                        disabled={deleting === image.id}
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                    </div>

                    {/* Metadata */}
                    <p className="text-xs text-muted-foreground">
                      {new Date(image.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Results count */}
        {images.length > 0 && (
          <div className="text-sm text-muted-foreground">
            Total images: {images.length}
          </div>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-lg w-[95vw] sm:w-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Image" : "Add Gallery Image"}
            </DialogTitle>
            <DialogDescription>
              {editingId
                ? "Update the gallery image details"
                : "Add a new image to your gallery"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Image Title</Label>
              <Input
                id="title"
                placeholder="e.g., Product Photography"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    category: value as typeof formData.category,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Visibility Toggle */}
            <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
              <div>
                <Label htmlFor="visible" className="text-base font-semibold">
                  Visible on Website
                </Label>
                <p className="text-sm text-muted-foreground">
                  Show this image to visitors
                </p>
              </div>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, visible: !formData.visible })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  formData.visible ? "bg-green-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.visible ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Image Upload / URL */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Image Source</Label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="imageFile"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full gap-2 justify-start"
                    >
                      <Upload className="w-4 h-4" />
                      {formData.imageFile
                        ? formData.imageFile.name
                        : "Choose File from Device"}
                    </Button>
                  </div>
                  {formData.imageFile && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleClearFile}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* OR Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-background text-muted-foreground">
                    OR
                  </span>
                </div>
              </div>

              {/* Image URL as alternative */}
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={
                    formData.imageFile ? "" : formData.imageUrl
                  }
                  onChange={(e) =>
                    setFormData({ ...formData, imageUrl: e.target.value, imageFile: null })
                  }
                  disabled={!!formData.imageFile}
                />
                <p className="text-sm text-muted-foreground">
                  Or provide a direct link to an image
                </p>
              </div>
            </div>

            {/* Image Preview */}
            {(imagePreview || (formData.imageUrl && !formData.imageFile)) && (
              <div className="space-y-2">
                <Label>Preview</Label>
                <div className="aspect-square rounded-lg overflow-hidden bg-muted border">
                  <img
                    src={imagePreview || formData.imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={() => {
                      console.error("Failed to load image preview");
                    }}
                  />
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Saving..." : editingId ? "Update" : "Add"} Image
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
