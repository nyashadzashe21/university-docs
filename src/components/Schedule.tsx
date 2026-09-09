"use client";

import { QRCodeSVG } from "qrcode.react";
import { UNIVERSITY, type Schedule as ScheduleType } from "@/lib/utils";

interface ScheduleProps {
  schedule: ScheduleType;
  studentName: string;
  studentId: string;
  issueDate: string;
  docId: string;
}

export default function ClassSchedule({
  schedule,
  studentName,
  studentId,
  issueDate,
  docId,
}: ScheduleProps) {
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
            <p className="text-gold text-sm font-semibold">ACADEMIC SCHEDULE</p>
            <p className="text-xs text-gold/70">{schedule.term} {schedule.academicYear}</p>
          </div>
        </div>
      </div>

      {/* Gold Divider */}
      <div className="h-1 gold-bg" />

      {/* Student Info */}
      <div className="p-6 border-b-2 border-navy/10">
        <div className="grid grid-cols-4 gap-4">
          <div>
            <p className="text-[10px] text-navy/60 uppercase tracking-wider">Student Name</p>
            <p className="text-sm font-semibold text-navy">{studentName}</p>
          </div>
          <div>
            <p className="text-[10px] text-navy/60 uppercase tracking-wider">Student ID</p>
            <p className="text-sm font-mono font-semibold text-navy">{studentId}</p>
          </div>
          <div>
            <p className="text-[10px] text-navy/60 uppercase tracking-wider">Academic Term</p>
            <p className="text-sm font-semibold text-navy">{schedule.term} {schedule.academicYear}</p>
          </div>
          <div>
            <p className="text-[10px] text-navy/60 uppercase tracking-wider">Issue Date</p>
            <p className="text-sm font-semibold text-navy">{issueDate}</p>
          </div>
        </div>
      </div>

      {/* Course Table */}
      <div className="p-6">
        <h2 className="text-lg font-bold text-navy mb-4">Enrolled Courses</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="university-gradient text-white">
              <th className="p-2 text-left text-xs font-semibold">Course Code</th>
              <th className="p-2 text-left text-xs font-semibold">Course Name</th>
              <th className="p-2 text-left text-xs font-semibold">Instructor</th>
              <th className="p-2 text-left text-xs font-semibold">Schedule</th>
              <th className="p-2 text-left text-xs font-semibold">Room</th>
              <th className="p-2 text-center text-xs font-semibold">Credits</th>
            </tr>
          </thead>
          <tbody>
            {schedule.courses.map((course, index) => (
              <tr
                key={course.code}
                className={index % 2 === 0 ? "bg-navy/5" : "bg-white"}
              >
                <td className="p-2 text-xs font-mono font-semibold text-navy">{course.code}</td>
                <td className="p-2 text-xs text-navy">{course.name}</td>
                <td className="p-2 text-xs text-navy/80">{course.instructor}</td>
                <td className="p-2 text-xs text-navy/80">{course.schedule}</td>
                <td className="p-2 text-xs text-navy/80">{course.room}</td>
                <td className="p-2 text-xs text-center font-semibold text-navy">{course.credits}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-navy/20">
              <td colSpan={5} className="p-2 text-xs font-bold text-navy text-right">Total Credits:</td>
              <td className="p-2 text-xs font-bold text-navy text-center">
                {schedule.courses.reduce((sum, c) => sum + c.credits, 0)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-6 border-t-2 border-navy/10 bg-gray-50">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-[10px] text-navy/60">{UNIVERSITY.address}</p>
            <p className="text-[10px] text-navy/60">{UNIVERSITY.phone} | {UNIVERSITY.website}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[8px] text-navy/40">Scan to verify authenticity</p>
              <p className="text-[8px] text-navy/40">Document ID: {docId.slice(0, 8)}...</p>
            </div>
            <div className="w-16 h-16 bg-white p-1 rounded border border-navy/20">
              <QRCodeSVG
                value={verificationUrl}
                size={56}
                level="M"
                bgColor="white"
                fgColor="#1a1a6e"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
