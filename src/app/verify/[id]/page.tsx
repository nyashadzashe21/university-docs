"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { UNIVERSITY } from "@/lib/utils";
import { getDocumentByDocId, type DocumentRecord } from "@/lib/documents";
import { CheckCircle, XCircle, Shield, Clock, Loader2, FileText } from "lucide-react";

export function generateStaticParams() {
  return [{ id: "demo" }];
}

interface VerifyPageProps {
  params: Promise<{ id: string }>;
}

export default function VerifyPage({ params }: VerifyPageProps) {
  const { id } = use(params);
  const [document, setDocument] = useState<DocumentRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    verifyDocument();
  }, [id]);

  const verifyDocument = async () => {
    setLoading(true);
    try {
      const doc = await getDocumentByDocId(id);
      if (doc) {
        setDocument(doc);
      } else {
        setNotFound(true);
      }
    } catch {
      setNotFound(true);
    }
    setLoading(false);
  };

  const isValid = document && document.status === "active";

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
        {loading ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Loader2 className="w-12 h-12 text-navy animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Verifying document...</p>
          </div>
        ) : notFound ? (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-8 text-center bg-red-50">
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-red-800 mb-2">Document Not Found</h2>
              <p className="text-sm text-red-600">
                This document could not be found in our system. It may be invalid or have been deleted.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Verification Status */}
            <div className={`p-8 text-center ${isValid ? "bg-green-50" : "bg-red-50"}`}>
              {isValid ? (
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              ) : (
                <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              )}
              <h2 className={`text-2xl font-bold mb-2 ${isValid ? "text-green-800" : "text-red-800"}`}>
                {isValid ? "Document Verified" : "Document Revoked"}
              </h2>
              <p className={`text-sm ${isValid ? "text-green-600" : "text-red-600"}`}>
                {isValid
                  ? "This document is authentic and has been verified by Pacific Ridge University."
                  : "This document has been revoked and is no longer valid."}
              </p>
            </div>

            {/* Document Details */}
            <div className="p-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-navy mb-4">Document Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Document Type</span>
                  <span className="font-semibold text-navy capitalize">
                    {document?.type?.replace("-", " ")}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Student Name</span>
                  <span className="font-semibold text-navy">{document?.studentName}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Student ID</span>
                  <span className="font-mono text-sm text-navy">{document?.studentId}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Document ID</span>
                  <span className="font-mono text-sm text-navy">{id}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Institution</span>
                  <span className="font-semibold text-navy">{UNIVERSITY.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Generated At</span>
                  <span className="text-sm text-navy">
                    {document?.generatedAt?.toDate?.()?.toLocaleString() || "Unknown"}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Status</span>
                  <span className={`font-semibold ${isValid ? "text-green-600" : "text-red-600"}`}>
                    {document?.status === "active" ? "Active" : "Revoked"}
                  </span>
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
                  Document verified against database
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Issued by authorized staff member
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-green-500" />
                  Timestamp recorded and immutable
                </li>
              </ul>
            </div>
          </div>
        )}

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
