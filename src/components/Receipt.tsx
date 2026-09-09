"use client";

import { QRCodeSVG } from "qrcode.react";
import { UNIVERSITY, type TuitionPayment, formatCurrency } from "@/lib/utils";

interface ReceiptProps {
  payment: TuitionPayment;
  studentName: string;
  studentId: string;
  docId: string;
}

export default function Receipt({ payment, studentName, studentId, docId }: ReceiptProps) {
  const verificationUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/verify/${docId}`;

  return (
    <div className="relative w-[8.5in] min-h-[11in] bg-white document-shadow">
      {/* Watermark */}
      <div className="watermark">{UNIVERSITY.shortName}</div>

      {/* Header */}
      <div className="university-gradient p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full gold-bg flex items-center justify-center">
              <span className="text-navy text-2xl font-bold">{UNIVERSITY.shortName[0]}</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">{UNIVERSITY.name}</h1>
              <p className="text-gold text-sm tracking-wider">{UNIVERSITY.motto}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-gold text-sm font-semibold">TUITION PAYMENT RECEIPT</p>
            <p className="text-xs text-gold/70">Official Receipt</p>
          </div>
        </div>
      </div>

      {/* Gold Divider */}
      <div className="h-1 gold-bg" />

      {/* Receipt Info */}
      <div className="p-6 border-b-2 border-navy/10">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3">
            <div>
              <p className="text-[10px] text-navy/60 uppercase tracking-wider">Receipt Number</p>
              <p className="text-lg font-mono font-bold text-navy">{payment.receiptNumber}</p>
            </div>
            <div>
              <p className="text-[10px] text-navy/60 uppercase tracking-wider">Student Name</p>
              <p className="text-sm font-semibold text-navy">{studentName}</p>
            </div>
            <div>
              <p className="text-[10px] text-navy/60 uppercase tracking-wider">Student ID</p>
              <p className="text-sm font-mono font-semibold text-navy">{studentId}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-[10px] text-navy/60 uppercase tracking-wider">Academic Term</p>
              <p className="text-sm font-semibold text-navy">{payment.term} {payment.academicYear}</p>
            </div>
            <div>
              <p className="text-[10px] text-navy/60 uppercase tracking-wider">Payment Date</p>
              <p className="text-sm font-semibold text-navy">{payment.paymentDate}</p>
            </div>
            <div>
              <p className="text-[10px] text-navy/60 uppercase tracking-wider">Payment Method</p>
              <p className="text-sm font-semibold text-navy">{payment.paymentMethod}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Details */}
      <div className="p-6">
        <h2 className="text-lg font-bold text-navy mb-4">Payment Details</h2>
        <div className="border-2 border-navy/20 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="university-gradient text-white">
                <th className="p-3 text-left text-xs font-semibold">Description</th>
                <th className="p-3 text-right text-xs font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-navy/5">
                <td className="p-3 text-sm text-navy">
                  Tuition - {payment.term} {payment.academicYear}
                </td>
                <td className="p-3 text-sm font-semibold text-navy text-right">
                  {formatCurrency(payment.totalDue)}
                </td>
              </tr>
              <tr className="bg-white">
                <td className="p-3 text-sm text-navy">Amount Paid</td>
                <td className="p-3 text-sm font-semibold text-green-700 text-right">
                  {formatCurrency(payment.amountPaid)}
                </td>
              </tr>
              <tr className="bg-navy/5">
                <td className="p-3 text-sm font-bold text-navy">Balance Due</td>
                <td className="p-3 text-sm font-bold text-navy text-right">
                  {formatCurrency(payment.balance)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Verification Box */}
      <div className="mx-6 p-4 bg-navy/5 rounded-lg border border-navy/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-navy mb-1">Payment Verification</p>
            <p className="text-[10px] text-navy/60">
              This receipt can be verified at {UNIVERSITY.website}/verify
            </p>
            <p className="text-[10px] text-navy/60">
              Document ID: {docId}
            </p>
          </div>
          <div className="w-20 h-20 bg-white p-1 rounded border border-navy/20">
            <QRCodeSVG
              value={verificationUrl}
              size={72}
              level="M"
              bgColor="white"
              fgColor="#1a1a6e"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-6 border-t-2 border-navy/10 bg-gray-50">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-[10px] text-navy/60">{UNIVERSITY.address}</p>
            <p className="text-[10px] text-navy/60">{UNIVERSITY.phone} | {UNIVERSITY.website}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-navy/60">This is an official receipt of {UNIVERSITY.name}</p>
            <p className="text-[10px] text-navy/40">Generated: {new Date().toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
