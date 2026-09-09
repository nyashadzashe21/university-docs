"use client";

import { QRCodeSVG } from "qrcode.react";
import { UNIVERSITY, type Student } from "@/lib/utils";

interface IDCardProps {
  student: Student;
  issueDate: string;
  expirationDate: string;
  docId: string;
}

export default function IDCard({ student, issueDate, expirationDate, docId }: IDCardProps) {
  const verificationUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/verify/${docId}`;

  return (
    <div className="relative w-[3.375in] h-[2.125in] overflow-hidden rounded-lg document-shadow">
      {/* Card Background */}
      <div className="absolute inset-0 id-card-gradient" />

      {/* Holographic Overlay */}
      <div className="absolute inset-0 holographic opacity-30" />

      {/* Gold Border */}
      <div className="absolute inset-1 border border-gold/40 rounded-md" />

      {/* Watermark */}
      <div className="watermark text-white/5">{UNIVERSITY.shortName}</div>

      {/* Content */}
      <div className="relative z-10 flex h-full p-3">
        {/* Left Side - Photo and QR */}
        <div className="flex flex-col items-center gap-2 pr-3 border-r border-gold/30">
          <div className="w-16 h-16 rounded-md overflow-hidden border-2 border-gold/60 bg-white">
            {student.photo ? (
              <img
                src={student.photo}
                alt={`${student.firstName} ${student.lastName}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                No Photo
              </div>
            )}
          </div>
          <div className="w-12 h-12 bg-white p-1 rounded">
            <QRCodeSVG
              value={verificationUrl}
              size={40}
              level="M"
              bgColor="white"
              fgColor="#1a1a6e"
            />
          </div>
        </div>

        {/* Right Side - Info */}
        <div className="flex-1 pl-3 flex flex-col justify-between">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-full gold-bg flex items-center justify-center">
                <span className="text-navy text-[8px] font-bold">{UNIVERSITY.shortName[0]}</span>
              </div>
              <div>
                <h3 className="text-white text-[10px] font-bold tracking-wide">{UNIVERSITY.name}</h3>
                <p className="text-gold/80 text-[6px] tracking-widest">{UNIVERSITY.motto.toUpperCase()}</p>
              </div>
            </div>
            <p className="text-gold text-[8px] font-semibold tracking-wider mt-0.5">STUDENT IDENTIFICATION</p>
          </div>

          {/* Student Info */}
          <div className="space-y-0.5">
            <div>
              <p className="text-gold text-[7px] uppercase tracking-wider">Name</p>
              <p className="text-white text-[11px] font-semibold">
                {student.lastName}, {student.firstName}
              </p>
            </div>
            <div className="flex gap-4">
              <div>
                <p className="text-gold text-[7px] uppercase tracking-wider">Student ID</p>
                <p className="text-white text-[10px] font-mono font-bold">{student.studentId}</p>
              </div>
              <div>
                <p className="text-gold text-[7px] uppercase tracking-wider">Year</p>
                <p className="text-white text-[10px]">{student.year}</p>
              </div>
            </div>
            <div>
              <p className="text-gold text-[7px] uppercase tracking-wider">Department</p>
              <p className="text-white text-[9px]">{student.department}</p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-end">
            <div>
              <p className="text-gold/70 text-[6px]">ISSUED: {issueDate}</p>
              <p className="text-gold/70 text-[6px]">EXPIRES: {expirationDate}</p>
            </div>
            <div className="text-right">
              <p className="text-white text-[6px] font-semibold">PACIFIC RIDGE</p>
              <p className="text-gold text-[7px] font-bold">UNIVERSITY</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
