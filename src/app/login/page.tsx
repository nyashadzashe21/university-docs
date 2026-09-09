"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UNIVERSITY } from "@/lib/utils";
import { Lock, User, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Demo authentication - replace with real auth
    if (username === "admin" && password === "admin123") {
      localStorage.setItem("auth", JSON.stringify({
        user: username,
        role: "admin",
        loginTime: new Date().toISOString(),
      }));
      router.push("/dashboard");
    } else if (username === "staff" && password === "staff123") {
      localStorage.setItem("auth", JSON.stringify({
        user: username,
        role: "staff",
        loginTime: new Date().toISOString(),
      }));
      router.push("/dashboard");
    } else {
      setError("Invalid credentials. Try admin/admin123 or staff/staff123");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 university-gradient items-center justify-center p-12">
        <div className="text-center text-white">
          <div className="w-24 h-24 rounded-full gold-bg flex items-center justify-center mx-auto mb-6">
            <span className="text-navy text-4xl font-bold">{UNIVERSITY.shortName[0]}</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">{UNIVERSITY.name}</h1>
          <p className="text-gold text-sm tracking-wider mb-4">{UNIVERSITY.motto}</p>
          <div className="w-16 h-1 gold-bg mx-auto mb-6" />
          <p className="text-white/70 text-sm max-w-xs mx-auto">
            Official document management system for authorized university staff.
            Generate student ID cards, class schedules, and tuition receipts.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4 text-gold/60 text-xs">
            <span>Est. {UNIVERSITY.established}</span>
            <span>•</span>
            <span>{UNIVERSITY.address}</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-16 h-16 rounded-full gold-bg flex items-center justify-center mx-auto mb-4">
              <span className="text-navy text-2xl font-bold">{UNIVERSITY.shortName[0]}</span>
            </div>
            <h1 className="text-xl font-bold text-navy">{UNIVERSITY.name}</h1>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-navy">Staff Portal</h2>
              <p className="text-gray-500 text-sm mt-1">Sign in to access document generation</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-navy mb-1">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-navy focus:outline-none transition-colors"
                    placeholder="Enter username"
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
                {isLoading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 text-center mb-2">Demo Credentials:</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-center p-2 bg-white rounded border border-gray-200">
                  <p className="font-semibold text-navy">Admin</p>
                  <p className="text-gray-500">admin / admin123</p>
                </div>
                <div className="text-center p-2 bg-white rounded border border-gray-200">
                  <p className="font-semibold text-navy">Staff</p>
                  <p className="text-gray-500">staff / staff123</p>
                </div>
              </div>
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
