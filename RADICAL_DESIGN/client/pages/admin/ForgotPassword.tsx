import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Lock, ArrowLeft, Mail, CheckCircle, AlertCircle } from "lucide-react";

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Automatically request password reset when page loads
    requestReset();
  }, []);

  const requestReset = async () => {
    try {
      setLoading(true);
      setError("");
      
      const response = await fetch("/api/admin/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        const data = await response.json();
        setSubmitted(true);

        // In development, if OTP is provided, show it for testing
        if (data.otpCode) {
          setOtpCode(data.otpCode);
        }

        // Auto-redirect to OTP verification after 3 seconds
        setTimeout(() => {
          navigate("/admin/verify-otp");
        }, 3000);
      } else {
        setError("Failed to process password reset request. Please try again.");
      }
    } catch (err) {
      console.error("Error requesting password reset:", err);
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted px-3 sm:px-4 py-6 sm:py-0">
        <div className="w-full max-w-md">
          {error ? (
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 sm:mb-4">Error</h1>
              <p className="text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base">{error}</p>

              <div className="space-y-2 sm:space-y-3">
                <button
                  onClick={() => {
                    setSubmitted(false);
                    requestReset();
                  }}
                  className="inline-flex items-center justify-center w-full bg-accent hover:bg-amber-500 text-accent-foreground px-4 py-2 sm:py-3 rounded-lg font-semibold transition-all text-sm sm:text-base"
                >
                  Try Again
                </button>
                <Link
                  to="/admin/login"
                  className="inline-flex items-center justify-center w-full bg-muted hover:bg-muted/80 text-foreground px-4 py-2 sm:py-3 rounded-lg font-semibold transition-all text-sm sm:text-base"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 sm:mb-4">Check Your Email</h1>
              <p className="text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base">
                We've sent a verification code to your admin email address.
              </p>

              <div className="bg-card border border-border rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
                <h2 className="font-semibold text-foreground mb-3 text-xs sm:text-sm">What happens next?</h2>
                <ul className="text-xs sm:text-sm text-muted-foreground space-y-2 text-left">
                  <li className="flex gap-2">
                    <span className="text-accent font-bold flex-shrink-0">1.</span>
                    <span>Check your email inbox (and spam folder) for the verification code</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent font-bold flex-shrink-0">2.</span>
                    <span>Enter the verification code on the next page</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent font-bold flex-shrink-0">3.</span>
                    <span>Create your new password</span>
                  </li>
                </ul>
              </div>

              {otpCode && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                  <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 mb-2 font-semibold">Development Mode - Test Code:</p>
                  <div className="bg-white dark:bg-slate-900 p-3 rounded border border-blue-300 dark:border-blue-700">
                    <code className="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400 tracking-wider">{otpCode}</code>
                  </div>
                </div>
              )}

              <div className="space-y-2 sm:space-y-3">
                <button
                  onClick={() => navigate("/admin/verify-otp")}
                  className="inline-flex items-center justify-center w-full gap-2 bg-accent hover:bg-amber-500 text-accent-foreground px-4 py-2 sm:py-3 rounded-lg font-semibold transition-all text-sm sm:text-base"
                >
                  Continue to Verification
                </button>
                <Link
                  to="/admin/login"
                  className="inline-flex items-center justify-center w-full bg-muted hover:bg-muted/80 text-foreground px-4 py-2 sm:py-3 rounded-lg font-semibold transition-all text-sm sm:text-base"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          )}
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
            <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-accent-foreground" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Reset Password</h1>
          <p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base">RADICAL DESIGN Ltd</p>
        </div>

        {/* Processing Card */}
        <div className="bg-card border border-border rounded-lg p-6 sm:p-8 shadow-lg text-center">
          {loading ? (
            <>
              <div className="flex justify-center mb-6">
                <div className="relative w-12 h-12">
                  <div className="absolute inset-0 bg-accent rounded-full opacity-25 animate-pulse"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-accent animate-bounce" />
                  </div>
                </div>
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">Sending Verification Code</h2>
              <p className="text-sm text-muted-foreground">
                We're sending a verification code to your admin email address...
              </p>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
