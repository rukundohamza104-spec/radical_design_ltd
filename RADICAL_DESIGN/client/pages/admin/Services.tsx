import { useEffect, useState, useRef } from "react";
import AdminLayout from "@/components/AdminLayout";
import { useAdmin } from "@/contexts/AdminContext";
import { Trash2, Plus, Edit2, Eye, EyeOff, Briefcase, Upload, X } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  imageUrl: string;
  visible: boolean;
  createdAt: string;
}

export default function AdminServices() {
  const { sessionId } = useAdmin();
  const { toast } = useToast();

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    imageUrl: "",
    imageFile: null as File | null,
    visible: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [togglingVisibility, setTogglingVisibility] = useState<string | null>(
    null
  );
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
        description: "File size must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    // Read file and create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setImagePreview(base64);
      setFormData((prev) => ({
        ...prev,
        imageFile: file,
        imageUrl: base64, // Store base64 as imageUrl for now
      }));
    };
    reader.readAsDataURL(file);
  };

  // Fetch services
  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/services", {
        headers: {
          "x-admin-session": sessionId || "",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setServices(data);
      } else {
        toast({
          title: "Error",
          description: "Failed to load services",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to fetch services:", error);
      toast({
        title: "Error",
        description: "Failed to load services",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission (add or edit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.description.trim() ||
      !formData.category.trim() ||
      !formData.imageUrl.trim()
    ) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);

      if (editingId) {
        // Update existing service
        const response = await fetch(`/api/admin/services/${editingId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-admin-session": sessionId || "",
          },
          body: JSON.stringify({
            name: formData.name,
            description: formData.description,
            category: formData.category,
            imageUrl: formData.imageUrl,
            visible: formData.visible,
          }),
        });

        if (response.ok) {
          const updated = await response.json();
          setServices(
            services.map((svc) => (svc.id === editingId ? updated : svc))
          );
          toast({
            title: "Success",
            description: "Service updated successfully",
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to update service",
            variant: "destructive",
          });
        }
      } else {
        // Create new service
        const response = await fetch("/api/admin/services", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-admin-session": sessionId || "",
          },
          body: JSON.stringify({
            name: formData.name,
            description: formData.description,
            category: formData.category,
            imageUrl: formData.imageUrl,
            visible: formData.visible,
          }),
        });

        if (response.ok) {
          const newService = await response.json();
          setServices([newService, ...services]);
          toast({
            title: "Success",
            description: "Service added successfully",
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to add service",
            variant: "destructive",
          });
        }
      }

      // Reset form
      setFormData({
        name: "",
        description: "",
        category: "",
        imageUrl: "",
        imageFile: null,
        visible: true,
      });
      setImagePreview("");
      setEditingId(null);
      setShowDialog(false);
    } catch (error) {
      console.error("Failed to submit form:", error);
      toast({
        title: "Error",
        description: "Failed to save service",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Open edit dialog
  const handleEdit = (service: Service) => {
    setFormData({
      name: service.name,
      description: service.description,
      category: service.category,
      imageUrl: service.imageUrl,
      imageFile: null,
      visible: service.visible,
    });
    setImagePreview(service.imageUrl);
    setEditingId(service.id);
    setShowDialog(true);
  };

  // Toggle visibility
  const handleToggleVisibility = async (service: Service) => {
    try {
      setTogglingVisibility(service.id);
      const response = await fetch(`/api/admin/services/${service.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-session": sessionId || "",
        },
        body: JSON.stringify({ visible: !service.visible }),
      });

      if (response.ok) {
        const updated = await response.json();
        setServices(
          services.map((svc) => (svc.id === service.id ? updated : svc))
        );
        toast({
          title: "Success",
          description: `Service ${updated.visible ? "shown" : "hidden"} on website`,
        });
      }
    } catch (error) {
      console.error("Failed to toggle visibility:", error);
      toast({
        title: "Error",
        description: "Failed to update service visibility",
        variant: "destructive",
      });
    } finally {
      setTogglingVisibility(null);
    }
  };

  // Delete service
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    try {
      setDeleting(id);
      const response = await fetch(`/api/admin/services/${id}`, {
        method: "DELETE",
        headers: {
          "x-admin-session": sessionId || "",
        },
      });

      if (response.ok) {
        setServices(services.filter((svc) => svc.id !== id));
        toast({
          title: "Success",
          description: "Service deleted successfully",
        });
      }
    } catch (error) {
      console.error("Failed to delete service:", error);
      toast({
        title: "Error",
        description: "Failed to delete service",
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
    setFormData({
      name: "",
      description: "",
      category: "",
      imageUrl: "",
      imageFile: null,
      visible: true,
    });
    setImagePreview("");
  };

  useEffect(() => {
    if (sessionId) {
      fetchServices();
    }
  }, [sessionId]);

  const visibleCount = services.filter((s) => s.visible).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Services</h1>
            <p className="text-muted-foreground mt-1">
              Manage your service offerings
            </p>
          </div>
          <Button onClick={() => setShowDialog(true)} className="gap-2" size="lg">
            <Plus className="w-4 h-4" />
            Add Service
          </Button>
        </div>

        {/* Stats */}
        {services.length > 0 && (
          <div className="grid grid-cols-2 gap-4">
            <div className="border rounded-lg p-4 bg-muted/50">
              <p className="text-sm text-muted-foreground mb-1">Total Services</p>
              <p className="text-2xl font-bold text-foreground">
                {services.length}
              </p>
            </div>
            <div className="border rounded-lg p-4 bg-muted/50">
              <p className="text-sm text-muted-foreground mb-1">Visible</p>
              <p className="text-2xl font-bold text-green-600">{visibleCount}</p>
            </div>
          </div>
        )}

        {/* Services Table */}
        <div className="border rounded-lg overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Loading services...</p>
            </div>
          ) : services.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="font-semibold text-lg mb-2">No services yet</h3>
                <p className="text-muted-foreground mb-6">
                  Add your first service to get started
                </p>
                <Button onClick={() => setShowDialog(true)} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add First Service
                </Button>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-b bg-muted/50">
                  <TableHead>Service Name</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Category
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Description
                  </TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{service.name}</TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                      {service.category}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground max-w-xs truncate">
                      {service.description}
                    </TableCell>
                    <TableCell className="text-center">
                      {service.visible ? (
                        <Badge className="bg-green-600">Visible</Badge>
                      ) : (
                        <Badge variant="secondary">Hidden</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleVisibility(service)}
                          disabled={togglingVisibility === service.id}
                          title={
                            service.visible ? "Hide service" : "Show service"
                          }
                        >
                          {service.visible ? (
                            <Eye className="w-4 h-4 text-green-600" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-muted-foreground" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(service)}
                          className="gap-2"
                        >
                          <Edit2 className="w-4 h-4" />
                          <span className="hidden sm:inline">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(service.id)}
                          disabled={deleting === service.id}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Service" : "Add Service"}</DialogTitle>
            <DialogDescription>
              {editingId
                ? "Update the service details"
                : "Add a new service to your offerings"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Service Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Service Name</Label>
              <Input
                id="name"
                placeholder="e.g., Graphic Design"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                placeholder="e.g., Design"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your service..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
                required
              />
            </div>

            {/* Image Upload/URL */}
            <div className="space-y-2">
              <Label>Service Image</Label>
              <div className="flex gap-2">
                <Input
                  type="url"
                  placeholder="https://example.com/service.jpg"
                  value={formData.imageUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, imageUrl: e.target.value })
                  }
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="gap-2"
                >
                  <Upload className="w-4 h-4" />
                  <span className="hidden sm:inline">Browse</span>
                </Button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <p className="text-xs text-muted-foreground">
                Upload an image or paste a URL. Max 5MB.
              </p>
            </div>

            {/* Image Preview */}
            {(imagePreview || formData.imageUrl) && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Preview</Label>
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview("");
                        setFormData({ ...formData, imageFile: null, imageUrl: "" });
                      }}
                      className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                    >
                      <X className="w-3 h-3" />
                      Clear
                    </button>
                  )}
                </div>
                <div className="aspect-video rounded-lg overflow-hidden bg-muted border">
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

            {/* Visibility Toggle */}
            <div className="flex items-center justify-between border rounded-lg p-3 bg-muted/50">
              <div>
                <p className="font-medium text-sm">Visible on Website</p>
                <p className="text-xs text-muted-foreground">
                  Show this service to your customers
                </p>
              </div>
              <Button
                type="button"
                variant={formData.visible ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  setFormData({ ...formData, visible: !formData.visible })
                }
              >
                {formData.visible ? "Yes" : "No"}
              </Button>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Saving..." : editingId ? "Update" : "Add"} Service
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
