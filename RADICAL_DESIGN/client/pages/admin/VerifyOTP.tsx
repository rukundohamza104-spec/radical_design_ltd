import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Lock, ArrowLeft, AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Get reset email from localStorage
  useEffect(() => {
    const storedEmail = localStorage.getItem("resetEmail");
    if (storedEmail) {
      setResetEmail(storedEmail);
    }
  }, []);

  const handleOTPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit code");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/admin/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otpCode: otp, email: resetEmail }),
      });

      if (response.ok) {
        setSuccess(true);
        // Redirect to reset password page after 2 seconds
        setTimeout(() => {
          navigate("/admin/reset-password");
        }, 2000);
      } else {
        const data = await response.json();
        setError(data.error || "Invalid verification code");
        setOtp("");
      }
    } catch (err) {
      console.error("Error verifying OTP:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted px-3 sm:px-4 py-6 sm:py-0">
        <div className="w-full max-w-md">
          <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 sm:mb-4">
              Verified Successfully
            </h1>
            <p className="text-muted-foreground mb-6 text-sm sm:text-base">
              Your email has been verified. Proceeding to password reset...
            </p>
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
            to="/admin/login"
            className="inline-flex items-center gap-2 text-accent hover:text-amber-500 text-xs sm:text-sm font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </div>

        {/* Logo/Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-accent rounded-lg flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-accent-foreground" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Verify Email</h1>
          <p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base">
            RADICAL DESIGN Ltd
          </p>
        </div>

        {/* OTP Verification Card */}
        <div className="bg-card border border-border rounded-lg p-6 sm:p-8 shadow-lg">
          <h2 className="text-lg sm:text-xl font-bold text-foreground mb-2">
            Enter Verification Code
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            We sent a 6-digit code to your email address. Enter it below to verify your identity.
          </p>

          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50 dark:bg-red-950/20">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700 dark:text-red-400">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP Input */}
            <div className="space-y-2">
              <label className="block text-xs sm:text-sm font-semibold text-foreground">
                Verification Code
              </label>
              <input
                type="text"
                value={otp}
                onChange={handleOTPChange}
                maxLength={6}
                disabled={loading}
                className={`w-full px-4 py-3 rounded-lg border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all disabled:opacity-50 text-center text-3xl tracking-widest font-bold ${
                  error ? "border-red-500" : "border-border"
                }`}
                placeholder="000000"
                autoFocus
                required
              />
              <p className="text-xs text-muted-foreground text-center">
                Enter the 6-digit code from your email
              </p>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300">
                <strong>⏱️ Code expires in 10 minutes</strong>
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                If you don't see the email, check your spam folder or request a new code.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-accent hover:bg-amber-500 disabled:bg-muted disabled:cursor-not-allowed text-accent-foreground px-4 py-2 sm:py-3 rounded-lg font-semibold transition-all text-sm sm:text-base"
            >
              {loading ? "Verifying..." : "Verify Code"}
            </button>

            {/* Resend Option */}
            <div className="text-center">
              <p className="text-xs sm:text-sm text-muted-foreground">
                Didn't receive the code?{" "}
                <Link
                  to="/admin/forgot-password"
                  className="text-accent hover:text-amber-500 font-semibold"
                >
                  Request new code
                </Link>
              </p>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-center text-xs text-muted-foreground">
              <Link to="/admin/login" className="text-accent hover:text-amber-500 font-semibold">
                Back to login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
