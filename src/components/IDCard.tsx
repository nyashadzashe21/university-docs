"use client";

import { QRCodeSVG } from "qrcode.react";
import { type Student, type UniversityInfo } from "@/lib/utils";

interface IDCardProps {
  student: Student;
  issueDate: string;
  expirationDate: string;
  docId: string;
  university: UniversityInfo;
}

export default function IDCard({ student, issueDate, expirationDate, docId, university }: IDCardProps) {
  const verificationUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/verify/${docId}`;
  const initials = university.shortName?.[0] || university.name?.[0] || "?";

  return (
    <div className="relative w-[3.375in] h-[2.125in] overflow-hidden rounded-lg document-shadow">
      {/* Card Background */}
      <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${university.colors.primary}, ${university.colors.primary}dd)` }} />

      {/* Holographic Overlay */}
      <div className="absolute inset-0 holographic opacity-30" />

      {/* Gold Border */}
      <div className="absolute inset-1 border rounded-md" style={{ borderColor: `${university.colors.secondary}66` }} />

      {/* Watermark */}
      <div className="watermark text-white/5">{university.shortName || university.name}</div>

      {/* Content */}
      <div className="relative z-10 flex h-full p-3">
        {/* Left Side - Photo and QR */}
        <div className="flex flex-col items-center gap-2 pr-3 border-r" style={{ borderColor: `${university.colors.secondary}44` }}>
          <div className="w-16 h-16 rounded-md overflow-hidden border-2 bg-white" style={{ borderColor: `${university.colors.secondary}99` }}>
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
              fgColor={university.colors.primary}
            />
          </div>
        </div>

        {/* Right Side - Info */}
        <div className="flex-1 pl-3 flex flex-col justify-between">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              {university.logo ? (
                <img src={university.logo} alt="Logo" className="w-6 h-6 rounded-full object-cover" />
              ) : (
                <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: university.colors.secondary }}>
                  <span className="text-[8px] font-bold" style={{ color: university.colors.primary }}>{initials}</span>
                </div>
              )}
              <div>
                <h3 className="text-white text-[10px] font-bold tracking-wide">{university.name || "University Name"}</h3>
                <p className="text-[6px] tracking-widest" style={{ color: `${university.colors.secondary}cc` }}>{university.motto?.toUpperCase() || "MOTTO"}</p>
              </div>
            </div>
            <p className="text-[8px] font-semibold tracking-wider mt-0.5" style={{ color: university.colors.secondary }}>STUDENT IDENTIFICATION</p>
          </div>

          {/* Student Info */}
          <div className="space-y-0.5">
            <div>
              <p className="text-[7px] uppercase tracking-wider" style={{ color: university.colors.secondary }}>Name</p>
              <p className="text-white text-[11px] font-semibold">
                {student.lastName}, {student.firstName}
              </p>
            </div>
            <div className="flex gap-4">
              <div>
                <p className="text-[7px] uppercase tracking-wider" style={{ color: university.colors.secondary }}>Student ID</p>
                <p className="text-white text-[10px] font-mono font-bold">{student.studentId}</p>
              </div>
              <div>
                <p className="text-[7px] uppercase tracking-wider" style={{ color: university.colors.secondary }}>Year</p>
                <p className="text-white text-[10px]">{student.year}</p>
              </div>
            </div>
            <div>
              <p className="text-[7px] uppercase tracking-wider" style={{ color: university.colors.secondary }}>Department</p>
              <p className="text-white text-[9px]">{student.department}</p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[6px]" style={{ color: `${university.colors.secondary}bb` }}>ISSUED: {issueDate}</p>
              <p className="text-[6px]" style={{ color: `${university.colors.secondary}bb` }}>EXPIRES: {expirationDate}</p>
            </div>
            <div className="text-right">
              <p className="text-white text-[6px] font-semibold">{university.shortName || "SHORT"}</p>
              <p className="text-[7px] font-bold" style={{ color: university.colors.secondary }}>UNIVERSITY</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
