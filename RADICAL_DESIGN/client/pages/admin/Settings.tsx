import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { useAdmin } from "@/contexts/AdminContext";
import { Save, Lock, Phone, MapPin, Mail, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface Settings {
  phone: string;
  address: string;
  email: string;
  maintenanceMode: boolean;
}

export default function AdminSettings() {
  const { sessionId } = useAdmin();
  const { toast } = useToast();

  const [settings, setSettings] = useState<Settings>({
    phone: "",
    address: "",
    email: "",
    maintenanceMode: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // Password change states
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
    general?: string;
  }>({});

  // Load settings
  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/settings", {
        headers: {
          "x-admin-session": sessionId || "",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(data);
        setHasChanges(false);
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Save settings
  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      const response = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-session": sessionId || "",
        },
        body: JSON.stringify({
          phone: settings.phone,
          address: settings.address,
          email: settings.email,
          maintenanceMode: settings.maintenanceMode,
        }),
      });

      if (response.ok) {
        setHasChanges(false);
        setLastSaved(new Date().toLocaleTimeString());
        toast({
          title: "Success",
          description: "Settings updated successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to save settings",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Handle password change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof passwordErrors = {};

    // Validate fields
    if (!passwordForm.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!passwordForm.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (passwordForm.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }

    if (!passwordForm.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setPasswordErrors(newErrors);
      return;
    }

    try {
      setChangingPassword(true);
      setPasswordErrors({});

      const response = await fetch("/api/admin/settings/password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-session": sessionId || "",
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      if (response.ok) {
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setPasswordErrors({});
        setShowPasswordDialog(false);
        toast({
          title: "Success",
          description: "Password changed successfully",
        });
      } else {
        const error = await response.json();
        if (error.error?.includes("incorrect")) {
          setPasswordErrors({ currentPassword: error.error });
        } else {
          setPasswordErrors({ general: error.error || "Failed to change password" });
        }
      }
    } catch (error) {
      console.error("Failed to change password:", error);
      setPasswordErrors({ general: "Failed to change password. Please try again." });
    } finally {
      setChangingPassword(false);
    }
  };

  // Handle field changes
  const handleFieldChange = (field: keyof Settings, value: string | boolean) => {
    setSettings({ ...settings, [field]: value });
    setHasChanges(true);
  };

  useEffect(() => {
    if (sessionId) {
      loadSettings();
    }
  }, [sessionId]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your admin account and website settings
          </p>
        </div>

        {/* Alerts */}
        {hasChanges && (
          <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-700 dark:text-amber-400">
              You have unsaved changes. Click "Save Changes" to update your settings.
            </AlertDescription>
          </Alert>
        )}

        {lastSaved && (
          <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700 dark:text-green-400">
              Last saved: {lastSaved}
            </AlertDescription>
          </Alert>
        )}

        {/* Tabs */}
        <Tabs defaultValue="contact" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="contact" className="gap-2">
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">Contact Info</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Lock className="w-4 h-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="maintenance" className="gap-2">
              <AlertCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Maintenance</span>
            </TabsTrigger>
          </TabsList>

          {/* Contact Info Tab */}
          <TabsContent value="contact" className="space-y-6 mt-6">
            <div className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base font-semibold">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.email}
                  onChange={(e) =>
                    handleFieldChange("email", e.target.value)
                  }
                  placeholder="info@radicaldesign.com"
                />
                <p className="text-sm text-muted-foreground">
                  Primary email address for customer inquiries
                </p>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-base font-semibold">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  value={settings.phone}
                  onChange={(e) =>
                    handleFieldChange("phone", e.target.value)
                  }
                  placeholder="+250 788 470 294"
                />
                <p className="text-sm text-muted-foreground">
                  Main contact phone number
                </p>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address" className="text-base font-semibold">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Business Address
                </Label>
                <Input
                  id="address"
                  value={settings.address}
                  onChange={(e) =>
                    handleFieldChange("address", e.target.value)
                  }
                  placeholder="Chic Building, 2nd Floor, Room F019C, Kigali, Rwanda"
                />
                <p className="text-sm text-muted-foreground">
                  Physical location of your business
                </p>
              </div>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6 mt-6">
            <div className="space-y-4">
              <div className="border rounded-lg p-6 bg-muted/50">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg text-foreground mb-2">
                      Admin Password
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Change your admin login password. You'll need to enter your
                      current password to set a new one.
                    </p>
                  </div>
                  <Button
                    onClick={() => setShowPasswordDialog(true)}
                    className="gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    Change Password
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Maintenance Mode Tab */}
          <TabsContent value="maintenance" className="space-y-6 mt-6">
            <div className="border rounded-lg p-6 bg-muted/50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-foreground mb-2">
                    Maintenance Mode
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Enable this to show a maintenance page to visitors while you make
                    updates to your website. Only you (logged in as admin) will see
                    the normal website.
                  </p>
                </div>
                <Button
                  variant={settings.maintenanceMode ? "default" : "outline"}
                  onClick={() =>
                    handleFieldChange(
                      "maintenanceMode",
                      !settings.maintenanceMode
                    )
                  }
                  className="gap-2"
                >
                  {settings.maintenanceMode ? "Enabled" : "Disabled"}
                </Button>
              </div>

              {settings.maintenanceMode && (
                <Alert className="mt-4 border-amber-200 bg-amber-50 dark:bg-amber-950/20">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-700 dark:text-amber-400">
                    Maintenance mode is currently enabled. Your website is showing a
                    maintenance page to visitors.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="flex justify-end gap-2 pt-6 border-t">
          <Button
            variant="outline"
            onClick={() => {
              loadSettings();
              setHasChanges(false);
            }}
            disabled={saving}
          >
            Discard Changes
          </Button>
          <Button
            onClick={handleSaveSettings}
            disabled={!hasChanges || saving}
            className="gap-2"
            size="lg"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Password Change Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Change Admin Password</DialogTitle>
            <DialogDescription>
              Enter your current password and then choose a new password. The new
              password must be at least 6 characters long.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleChangePassword} className="space-y-4">
            {/* General Error Alert */}
            {passwordErrors.general && (
              <Alert className="border-red-200 bg-red-50 dark:bg-red-950/20">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700 dark:text-red-400">
                  {passwordErrors.general}
                </AlertDescription>
              </Alert>
            )}

            {/* Current Password */}
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => {
                  setPasswordForm({
                    ...passwordForm,
                    currentPassword: e.target.value,
                  });
                  if (passwordErrors.currentPassword) {
                    setPasswordErrors({ ...passwordErrors, currentPassword: undefined });
                  }
                }}
                placeholder="••••••••"
                className={passwordErrors.currentPassword ? "border-red-500" : ""}
                required
              />
              {passwordErrors.currentPassword && (
                <p className="text-xs text-red-600 dark:text-red-400">
                  {passwordErrors.currentPassword}
                </p>
              )}
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => {
                  setPasswordForm({
                    ...passwordForm,
                    newPassword: e.target.value,
                  });
                  if (passwordErrors.newPassword) {
                    setPasswordErrors({ ...passwordErrors, newPassword: undefined });
                  }
                }}
                placeholder="••••••••"
                className={passwordErrors.newPassword ? "border-red-500" : ""}
                required
              />
              {passwordErrors.newPassword && (
                <p className="text-xs text-red-600 dark:text-red-400">
                  {passwordErrors.newPassword}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => {
                  setPasswordForm({
                    ...passwordForm,
                    confirmPassword: e.target.value,
                  });
                  if (passwordErrors.confirmPassword) {
                    setPasswordErrors({ ...passwordErrors, confirmPassword: undefined });
                  }
                }}
                placeholder="••••••••"
                className={passwordErrors.confirmPassword ? "border-red-500" : ""}
                required
              />
              {passwordErrors.confirmPassword && (
                <p className="text-xs text-red-600 dark:text-red-400">
                  {passwordErrors.confirmPassword}
                </p>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowPasswordDialog(false);
                  setPasswordForm({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  });
                  setPasswordErrors({});
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={changingPassword}>
                {changingPassword ? "Changing..." : "Change Password"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
