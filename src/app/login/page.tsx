"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { type UniversityInfo, DEFAULT_UNIVERSITY } from "@/lib/utils";
import { auth } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { Lock, Eye, EyeOff, Mail, AlertCircle, CheckCircle, Phone } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<unknown>(null);
  const [university, setUniversity] = useState<UniversityInfo>(DEFAULT_UNIVERSITY);

  useEffect(() => {
    const saved = localStorage.getItem("universityInfo");
    if (saved) {
      setUniversity(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/dashboard");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
        setSuccess("Account created! Redirecting...");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      const firebaseError = err as { code?: string; message?: string };
      switch (firebaseError.code) {
        case "auth/user-not-found":
          setError("No account found with this email");
          break;
        case "auth/wrong-password":
          setError("Incorrect password");
          break;
        case "auth/email-already-in-use":
          setError("Email already in use");
          break;
        case "auth/weak-password":
          setError("Password must be at least 6 characters");
          break;
        case "auth/invalid-email":
          setError("Invalid email address");
          break;
        default:
          setError(firebaseError.message || "An error occurred");
      }
    }
    setIsLoading(false);
  };

  const handleGoogleLogin = async () => {
    setError("");
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/dashboard");
    } catch (err: unknown) {
      const firebaseError = err as { code?: string; message?: string };
      if (firebaseError.code === "auth/popup-closed-by-user") {
        setError("Sign-in cancelled");
      } else {
        setError(firebaseError.message || "Google sign-in failed");
      }
    }
    setIsLoading(false);
  };

  const handlePhoneSendCode = async () => {
    if (!phoneNumber) {
      setError("Enter your phone number");
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      if (!(window as unknown as { recaptchaVerifier: RecaptchaVerifier }).recaptchaVerifier) {
        (window as unknown as { recaptchaVerifier: RecaptchaVerifier }).recaptchaVerifier = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          { size: "invisible" }
        );
      }
      const confirmation = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        (window as unknown as { recaptchaVerifier: RecaptchaVerifier }).recaptchaVerifier
      );
      setConfirmationResult(confirmation);
      setSuccess("Code sent! Check your phone.");
    } catch (err: unknown) {
      const firebaseError = err as { code?: string; message?: string };
      setError(firebaseError.message || "Failed to send code");
    }
    setIsLoading(false);
  };

  const handlePhoneVerifyCode = async () => {
    if (!verificationCode || !confirmationResult) {
      setError("Enter the verification code");
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      await (confirmationResult as { confirm: (code: string) => Promise<unknown> }).confirm(verificationCode);
      router.push("/dashboard");
    } catch {
      setError("Invalid verification code");
    }
    setIsLoading(false);
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setError("Enter your email first");
      return;
    }
    setError("");
    setSuccess("");
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess("Password reset email sent! Check your inbox.");
    } catch {
      setError("Failed to send reset email");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 university-gradient items-center justify-center p-12">
        <div className="text-center text-white">
          <div className="w-24 h-24 rounded-full gold-bg flex items-center justify-center mx-auto mb-6">
            <span className="text-navy text-4xl font-bold">{university.shortName?.[0] || university.name?.[0] || "U"}</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">{university.name || "University Name"}</h1>
          <p className="text-gold text-sm tracking-wider mb-4">{university.motto || "Your Motto"}</p>
          <div className="w-16 h-1 gold-bg mx-auto mb-6" />
          <p className="text-white/70 text-sm max-w-xs mx-auto">
            Official document management system for authorized university staff.
            Generate student ID cards, class schedules, and tuition receipts.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4 text-gold/60 text-xs">
            {university.established && <span>Est. {university.established}</span>}
            {university.established && university.address && <span>•</span>}
            {university.address && <span>{university.address}</span>}
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-16 h-16 rounded-full gold-bg flex items-center justify-center mx-auto mb-4">
              <span className="text-navy text-2xl font-bold">{university.shortName?.[0] || university.name?.[0] || "U"}</span>
            </div>
            <h1 className="text-xl font-bold text-navy">{university.name || "University Name"}</h1>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-navy">
                {isSignUp ? "Create Account" : "Staff Portal"}
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                {isSignUp
                  ? "Sign up for document access"
                  : "Sign in to access document generation"}
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                {success}
              </div>
            )}

            {/* Auth Method Tabs */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => { setAuthMethod("email"); setError(""); setSuccess(""); }}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                  authMethod === "email"
                    ? "navy-bg text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Mail className="w-4 h-4 inline mr-2" />
                Email
              </button>
              <button
                onClick={() => { setAuthMethod("phone"); setError(""); setSuccess(""); }}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                  authMethod === "phone"
                    ? "navy-bg text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Phone className="w-4 h-4 inline mr-2" />
                Phone
              </button>
            </div>

            {/* Email Auth */}
            {authMethod === "email" && (
              <form onSubmit={handleEmailAuth} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-navy mb-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-navy focus:outline-none transition-colors"
                      placeholder="you@university.edu"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy mb-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-2 border-2 border-gray-200 rounded-lg focus:border-navy focus:outline-none transition-colors"
                      placeholder="Enter password"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 navy-bg text-white font-semibold rounded-lg hover:bg-dark-navy transition-colors disabled:opacity-50"
                >
                  {isLoading ? "Loading..." : isSignUp ? "Create Account" : "Sign In"}
                </button>
              </form>
            )}

            {/* Phone Auth */}
            {authMethod === "phone" && (
              <div className="space-y-4">
                <div id="recaptcha-container"></div>
                {!confirmationResult ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-navy mb-1">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-navy focus:outline-none transition-colors"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>
                    <button
                      onClick={handlePhoneSendCode}
                      disabled={isLoading}
                      className="w-full py-3 navy-bg text-white font-semibold rounded-lg hover:bg-dark-navy transition-colors disabled:opacity-50"
                    >
                      {isLoading ? "Sending..." : "Send Code"}
                    </button>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-navy mb-1">Verification Code</label>
                      <input
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-navy focus:outline-none transition-colors text-center text-lg tracking-widest"
                        placeholder="123456"
                        maxLength={6}
                      />
                    </div>
                    <button
                      onClick={handlePhoneVerifyCode}
                      disabled={isLoading}
                      className="w-full py-3 navy-bg text-white font-semibold rounded-lg hover:bg-dark-navy transition-colors disabled:opacity-50"
                    >
                      {isLoading ? "Verifying..." : "Verify Code"}
                    </button>
                    <button
                      onClick={() => { setConfirmationResult(null); setVerificationCode(""); }}
                      className="w-full py-2 text-sm text-navy/60 hover:text-navy transition-colors"
                    >
                      ← Change phone number
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-xs text-gray-400">OR</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Google Sign In */}
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 py-3 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="font-medium text-gray-700">Continue with Google</span>
            </button>

            {/* Footer Links */}
            <div className="mt-6 text-center space-y-2">
              {authMethod === "email" && (
                <button
                  onClick={handlePasswordReset}
                  className="text-sm text-navy/60 hover:text-navy transition-colors"
                >
                  Forgot password?
                </button>
              )}
              <p className="text-sm text-gray-500">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                <button
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError("");
                    setSuccess("");
                  }}
                  className="text-navy font-semibold hover:underline"
                >
                  {isSignUp ? "Sign In" : "Sign Up"}
                </button>
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link href="/" className="text-navy/60 text-sm hover:text-navy transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
