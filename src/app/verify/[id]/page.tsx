import { use } from "react";
import Link from "next/link";
import { UNIVERSITY } from "@/lib/utils";
import { CheckCircle, XCircle, Shield, Clock } from "lucide-react";

export function generateStaticParams() {
  return [{ id: "demo" }];
}

interface VerifyPageProps {
  params: Promise<{ id: string }>;
}

export default function VerifyPage({ params }: VerifyPageProps) {
  const { id } = use(params);

  // In a real app, this would fetch from an API to verify the document
  // For demo purposes, we show a generic verification result
  const isValid = true;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="university-gradient text-white">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full gold-bg flex items-center justify-center">
              <span className="text-navy text-sm font-bold">{UNIVERSITY.shortName[0]}</span>
            </div>
            <div>
              <h1 className="text-lg font-bold">{UNIVERSITY.name}</h1>
              <p className="text-gold text-xs">Document Verification</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Verification Status */}
          <div className={`p-8 text-center ${isValid ? "bg-green-50" : "bg-red-50"}`}>
            {isValid ? (
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            ) : (
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            )}
            <h2 className={`text-2xl font-bold mb-2 ${isValid ? "text-green-800" : "text-red-800"}`}>
              {isValid ? "Document Verified" : "Document Not Found"}
            </h2>
            <p className={`text-sm ${isValid ? "text-green-600" : "text-red-600"}`}>
              {isValid
                ? "This document is authentic and has been verified by Pacific Ridge University."
                : "This document could not be verified. It may be invalid or expired."}
            </p>
          </div>

          {/* Document Details */}
          <div className="p-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-navy mb-4">Document Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Document ID</span>
                <span className="font-mono text-sm text-navy">{id}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Institution</span>
                <span className="font-semibold text-navy">{UNIVERSITY.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Verification Status</span>
                <span className={`font-semibold ${isValid ? "text-green-600" : "text-red-600"}`}>
                  {isValid ? "Valid" : "Invalid"}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Verification Time</span>
                <span className="text-sm text-navy">{new Date().toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Security Features */}
          <div className="p-6 bg-navy/5 border-t border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-navy" />
              <h3 className="font-semibold text-navy">Security Features</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                QR code verification passed
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Document has not been tampered with
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-green-500" />
                Document is within valid date range
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-navy/60 text-sm hover:text-navy transition-colors"
          >
            ← Return to {UNIVERSITY.name}
          </Link>
        </div>
      </div>
    </div>
  );
}
