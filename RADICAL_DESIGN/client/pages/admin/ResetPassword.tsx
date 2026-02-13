import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Lock, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [resetEmail, setResetEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{
    general?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  // Get reset email from localStorage
  useEffect(() => {
    const storedEmail = localStorage.getItem("resetEmail");
    if (storedEmail) {
      setResetEmail(storedEmail);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    // Validate
    if (!formData.newPassword) {
      newErrors.newPassword = "Password is required";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      const response = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newPassword: formData.newPassword,
          email: resetEmail,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        // Clear stored email from localStorage
        localStorage.removeItem("resetEmail");
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/admin/login");
        }, 3000);
      } else {
        const error = await response.json();
        setErrors({ general: error.error || "Failed to reset password" });
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      setErrors({ general: "An error occurred. Please try again." });
    } finally {
      setLoading(false);
    }
  };


  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted px-3 sm:px-4 py-6 sm:py-0">
        <div className="w-full max-w-md">
          <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 sm:mb-4">Password Reset Successful</h1>
            <p className="text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base">
              Your password has been reset successfully. You will be redirected to the login page shortly.
            </p>

            <Link
              to="/admin/login"
              className="inline-flex items-center justify-center w-full bg-accent hover:bg-amber-500 text-accent-foreground px-4 py-2 sm:py-3 rounded-lg font-semibold transition-all text-sm sm:text-base"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted px-3 sm:px-4 py-6 sm:py-0">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <div className="mb-4">
          <Link
            to="/admin/verify-otp"
            className="inline-flex items-center gap-2 text-accent hover:text-amber-500 text-xs sm:text-sm font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>

        {/* Logo/Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-accent rounded-lg flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-accent-foreground" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Create New Password</h1>
          <p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base">RADICAL DESIGN Ltd</p>
        </div>

        {/* Reset Password Card */}
        <div className="bg-card border border-border rounded-lg p-6 sm:p-8 shadow-lg">
          <h2 className="text-lg sm:text-xl font-bold text-foreground mb-4 sm:mb-6">Reset your admin password</h2>

          {errors.general && (
            <Alert className="mb-6 border-red-200 bg-red-50 dark:bg-red-950/20">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700 dark:text-red-400">
                {errors.general}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* New Password */}
            <div className="space-y-2">
              <label className="block text-xs sm:text-sm font-semibold text-foreground">
                New Password
              </label>
              <input
                type="password"
                value={formData.newPassword}
                onChange={(e) => {
                  setFormData({ ...formData, newPassword: e.target.value });
                  if (errors.newPassword) {
                    setErrors({ ...errors, newPassword: undefined });
                  }
                }}
                required
                disabled={loading}
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all disabled:opacity-50 text-sm ${
                  errors.newPassword ? "border-red-500" : "border-border"
                }`}
                placeholder="••••••••"
                minLength={6}
              />
              {errors.newPassword && (
                <p className="text-xs text-red-600 dark:text-red-400">
                  {errors.newPassword}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="block text-xs sm:text-sm font-semibold text-foreground">
                Confirm Password
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => {
                  setFormData({ ...formData, confirmPassword: e.target.value });
                  if (errors.confirmPassword) {
                    setErrors({ ...errors, confirmPassword: undefined });
                  }
                }}
                required
                disabled={loading}
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all disabled:opacity-50 text-sm ${
                  errors.confirmPassword ? "border-red-500" : "border-border"
                }`}
                placeholder="••••••••"
                minLength={6}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-600 dark:text-red-400">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent hover:bg-amber-500 disabled:bg-muted disabled:cursor-not-allowed text-accent-foreground px-4 py-2 sm:py-3 rounded-lg font-semibold transition-all mt-6 text-sm sm:text-base"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-4">
            <Link to="/admin/login" className="text-accent hover:text-amber-500 font-semibold">
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
