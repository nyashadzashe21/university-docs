import Link from "next/link";
import { UNIVERSITY } from "@/lib/utils";
import { Shield } from "lucide-react";

export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
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
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <Shield className="w-16 h-16 text-navy mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-navy mb-4">Document Verification</h2>
          <p className="text-gray-600 mb-6">
            Scan the QR code on any document to verify its authenticity.
            Each document contains a unique QR code that links to our verification system.
          </p>
          <div className="p-4 bg-navy/5 rounded-lg mb-6">
            <p className="text-sm text-navy">
              Verification is available for documents generated through our official system.
              Contact the university registrar for assistance.
            </p>
          </div>
          <Link
            href="/"
            className="inline-block px-6 py-3 navy-bg text-white font-semibold rounded-lg hover:bg-dark-navy transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
