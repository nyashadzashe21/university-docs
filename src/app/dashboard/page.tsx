"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UNIVERSITY, generateStudentId, generateDocId, getIssueDate, getExpirationDate, generateReceiptNumber, type Student, type Course, type Schedule, type TuitionPayment } from "@/lib/utils";
import IDCard from "@/components/IDCard";
import ClassSchedule from "@/components/Schedule";
import Receipt from "@/components/Receipt";
import DocumentPreview from "@/components/DocumentPreview";
import AIAssistant from "@/components/AIAssistant";
import { LogOut, CreditCard, Calendar, FileText, Plus, Trash2, User } from "lucide-react";

type DocumentType = "id-card" | "schedule" | "receipt";

const DEMO_COURSES: Course[] = [
  { code: "CS 101", name: "Introduction to Computer Science", instructor: "Dr. Sarah Chen", schedule: "MWF 9:00-9:50 AM", room: "Science Hall 201", credits: 3 },
  { code: "MATH 201", name: "Linear Algebra", instructor: "Prof. James Miller", schedule: "TTh 10:30-11:45 AM", room: "Math Building 105", credits: 4 },
  { code: "ENG 102", name: "Academic Writing", instructor: "Dr. Emily Roberts", schedule: "MWF 11:00-11:50 AM", room: "Liberal Arts 302", credits: 3 },
  { code: "PHYS 101", name: "General Physics I", instructor: "Prof. Michael Zhang", schedule: "TTh 1:00-2:15 PM", room: "Physics Lab 110", credits: 4 },
];

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{ user: string; role: string } | null>(null);
  const [activeTab, setActiveTab] = useState<DocumentType>("id-card");
  const [generatedDocs, setGeneratedDocs] = useState<Array<{ id: string; type: string; name: string; date: string }>>([]);

  // ID Card Form
  const [student, setStudent] = useState<Student>({
    id: "",
    firstName: "",
    lastName: "",
    studentId: generateStudentId(),
    dateOfBirth: "",
    photo: "",
    department: "Computer Science",
    year: "Sophomore",
    email: "",
  });
  const [idDocId, setIdDocId] = useState(generateDocId());
  const [idIssueDate, setIdIssueDate] = useState(getIssueDate());
  const [showIDPreview, setShowIDPreview] = useState(false);

  // Schedule Form
  const [scheduleStudent, setScheduleStudent] = useState({ name: "", studentId: "" });
  const [scheduleTerm, setScheduleTerm] = useState("Fall");
  const [scheduleYear, setScheduleYear] = useState("2026");
  const [courses, setCourses] = useState<Course[]>(DEMO_COURSES);
  const [scheduleDocId, setScheduleDocId] = useState(generateDocId());
  const [showSchedulePreview, setShowSchedulePreview] = useState(false);

  // Receipt Form
  const [receiptStudent, setReceiptStudent] = useState({ name: "", studentId: "" });
  const [receiptTerm, setReceiptTerm] = useState("Fall");
  const [receiptYear, setReceiptYear] = useState("2026");
  const [receiptAmount, setReceiptAmount] = useState("5000.00");
  const [receiptDocId, setReceiptDocId] = useState(generateDocId());
  const [showReceiptPreview, setShowReceiptPreview] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("auth");
    if (!auth) {
      router.push("/login");
    } else {
      setUser(JSON.parse(auth));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("auth");
    router.push("/login");
  };

  const addCourse = () => {
    setCourses([...courses, {
      code: "",
      name: "",
      instructor: "",
      schedule: "",
      room: "",
      credits: 3,
    }]);
  };

  const removeCourse = (index: number) => {
    setCourses(courses.filter((_, i) => i !== index));
  };

  const updateCourse = (index: number, field: keyof Course, value: string | number) => {
    const updated = [...courses];
    updated[index] = { ...updated[index], [field]: value };
    setCourses(updated);
  };

  const generateIDCard = () => {
    setShowIDPreview(true);
    setGeneratedDocs(prev => [...prev, {
      id: idDocId,
      type: "ID Card",
      name: `${student.firstName} ${student.lastName}`,
      date: new Date().toLocaleString(),
    }]);
  };

  const generateSchedule = () => {
    setShowSchedulePreview(true);
    setGeneratedDocs(prev => [...prev, {
      id: scheduleDocId,
      type: "Schedule",
      name: scheduleStudent.name,
      date: new Date().toLocaleString(),
    }]);
  };

  const generateReceipt = () => {
    setShowReceiptPreview(true);
    setGeneratedDocs(prev => [...prev, {
      id: receiptDocId,
      type: "Receipt",
      name: receiptStudent.name,
      date: new Date().toLocaleString(),
    }]);
  };

  const resetIDForm = () => {
    setStudent({
      id: "",
      firstName: "",
      lastName: "",
      studentId: generateStudentId(),
      dateOfBirth: "",
      photo: "",
      department: "Computer Science",
      year: "Sophomore",
      email: "",
    });
    setIdDocId(generateDocId());
    setIdIssueDate(getIssueDate());
    setShowIDPreview(false);
  };

  const resetScheduleForm = () => {
    setScheduleStudent({ name: "", studentId: "" });
    setCourses(DEMO_COURSES);
    setScheduleDocId(generateDocId());
    setShowSchedulePreview(false);
  };

  const resetReceiptForm = () => {
    setReceiptStudent({ name: "", studentId: "" });
    setReceiptDocId(generateDocId());
    setShowReceiptPreview(false);
  };

  // AI Handlers
  const handleAIFillIDCard = (data: Record<string, string>) => {
    setStudent(prev => ({
      ...prev,
      firstName: data.firstName || prev.firstName,
      lastName: data.lastName || prev.lastName,
      studentId: data.studentId || prev.studentId,
      dateOfBirth: data.dateOfBirth || prev.dateOfBirth,
      department: data.department || prev.department,
      year: data.year || prev.year,
      email: data.email || prev.email,
      photo: data.photo || prev.photo,
    }));
  };

  const handleAIFillSchedule = (data: Record<string, string>) => {
    setScheduleStudent({
      name: data.name || scheduleStudent.name,
      studentId: data.studentId || scheduleStudent.studentId,
    });
    if (data.term) setScheduleTerm(data.term);
    if (data.year) setScheduleYear(data.year);
  };

  const handleAIFillCourses = (newCourses: Array<{ code: string; name: string; instructor: string; schedule: string; room: string; credits: number }>) => {
    setCourses(newCourses);
  };

  const handleAIFillReceipt = (data: Record<string, string>) => {
    setReceiptStudent({
      name: data.name || receiptStudent.name,
      studentId: data.studentId || receiptStudent.studentId,
    });
    if (data.term) setReceiptTerm(data.term);
    if (data.year) setReceiptYear(data.year);
    if (data.amount) setReceiptAmount(data.amount);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="university-gradient text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full gold-bg flex items-center justify-center">
                <span className="text-navy text-sm font-bold">{UNIVERSITY.shortName[0]}</span>
              </div>
              <div>
                <h1 className="text-lg font-bold">{UNIVERSITY.name}</h1>
                <p className="text-gold text-xs">Document Management System</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-semibold">{user.user}</p>
                <p className="text-gold/70 text-xs capitalize">{user.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-4 sticky top-8">
              <h2 className="text-sm font-semibold text-navy/60 uppercase tracking-wider mb-4 px-3">
                Generate Document
              </h2>
              <nav className="space-y-1">
                <button
                  onClick={() => { setActiveTab("id-card"); setShowIDPreview(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === "id-card"
                      ? "navy-bg text-white"
                      : "text-navy hover:bg-navy/5"
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">Student ID Card</span>
                </button>
                <button
                  onClick={() => { setActiveTab("schedule"); setShowSchedulePreview(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === "schedule"
                      ? "navy-bg text-white"
                      : "text-navy hover:bg-navy/5"
                  }`}
                >
                  <Calendar className="w-5 h-5" />
                  <span className="font-medium">Class Schedule</span>
                </button>
                <button
                  onClick={() => { setActiveTab("receipt"); setShowReceiptPreview(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === "receipt"
                      ? "navy-bg text-white"
                      : "text-navy hover:bg-navy/5"
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span className="font-medium">Tuition Receipt</span>
                </button>
              </nav>

              {/* Recent Documents */}
              {generatedDocs.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-navy/60 uppercase tracking-wider mb-3 px-3">
                    Recent
                  </h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {generatedDocs.slice(-5).reverse().map((doc) => (
                      <div key={doc.id} className="px-3 py-2 bg-gray-50 rounded-lg text-xs">
                        <p className="font-semibold text-navy">{doc.type}</p>
                        <p className="text-gray-500 truncate">{doc.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* ID Card Form */}
            {activeTab === "id-card" && (
              <div className="space-y-6">
                {!showIDPreview ? (
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-navy">Generate Student ID Card</h2>
                      <AIAssistant
                        documentType="id-card"
                        currentData={student}
                        onFillData={handleAIFillIDCard}
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-navy mb-1">First Name</label>
                          <input
                            type="text"
                            value={student.firstName}
                            onChange={(e) => setStudent({ ...student, firstName: e.target.value })}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-navy focus:outline-none"
                            placeholder="John"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-navy mb-1">Last Name</label>
                          <input
                            type="text"
                            value={student.lastName}
                            onChange={(e) => setStudent({ ...student, lastName: e.target.value })}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-navy focus:outline-none"
                            placeholder="Doe"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-navy mb-1">Student ID</label>
                          <input
                            type="text"
                            value={student.studentId}
                            onChange={(e) => setStudent({ ...student, studentId: e.target.value })}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-navy focus:outline-none font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-navy mb-1">Date of Birth</label>
                          <input
                            type="date"
                            value={student.dateOfBirth}
                            onChange={(e) => setStudent({ ...student, dateOfBirth: e.target.value })}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-navy focus:outline-none"
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-navy mb-1">Department</label>
                          <select
                            value={student.department}
                            onChange={(e) => setStudent({ ...student, department: e.target.value })}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-navy focus:outline-none"
                          >
                            <option>Computer Science</option>
                            <option>Engineering</option>
                            <option>Business</option>
                            <option>Liberal Arts</option>
                            <option>Sciences</option>
                            <option>Medicine</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-navy mb-1">Year</label>
                          <select
                            value={student.year}
                            onChange={(e) => setStudent({ ...student, year: e.target.value })}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-navy focus:outline-none"
                          >
                            <option>Freshman</option>
                            <option>Sophomore</option>
                            <option>Junior</option>
                            <option>Senior</option>
                            <option>Graduate</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-navy mb-1">Email</label>
                          <input
                            type="email"
                            value={student.email}
                            onChange={(e) => setStudent({ ...student, email: e.target.value })}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-navy focus:outline-none"
                            placeholder="john.doe@pacificridge.edu"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-navy mb-1">Photo URL (optional)</label>
                          <input
                            type="url"
                            value={student.photo}
                            onChange={(e) => setStudent({ ...student, photo: e.target.value })}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-navy focus:outline-none"
                            placeholder="https://..."
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 flex gap-4">
                      <button
                        onClick={generateIDCard}
                        disabled={!student.firstName || !student.lastName}
                        className="px-6 py-3 navy-bg text-white font-semibold rounded-lg hover:bg-dark-navy transition-colors disabled:opacity-50"
                      >
                        Generate ID Card
                      </button>
                      <button
                        onClick={resetIDForm}
                        className="px-6 py-3 border-2 border-navy text-navy font-semibold rounded-lg hover:bg-navy/5 transition-colors"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-navy">ID Card Preview</h2>
                      <button
                        onClick={() => setShowIDPreview(false)}
                        className="text-navy hover:text-dark-navy transition-colors"
                      >
                        ← Edit
                      </button>
                    </div>
                    <DocumentPreview
                      documentName={`IDCard-${student.firstName}-${student.lastName}`}
                      documentType="id-card"
                    >
                      <IDCard
                        student={student}
                        issueDate={idIssueDate}
                        expirationDate={getExpirationDate(idIssueDate)}
                        docId={idDocId}
                      />
                    </DocumentPreview>
                  </div>
                )}
              </div>
            )}

            {/* Schedule Form */}
            {activeTab === "schedule" && (
              <div className="space-y-6">
                {!showSchedulePreview ? (
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-navy">Generate Class Schedule</h2>
                      <AIAssistant
                        documentType="schedule"
                        currentData={{ ...scheduleStudent, department: "Computer Science", year: "Sophomore" }}
                        onFillData={handleAIFillSchedule}
                        onFillCourses={handleAIFillCourses}
                      />
                    </div>
                    <div className="grid md:grid-cols-3 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-navy mb-1">Student Name</label>
                        <input
                          type="text"
                          value={scheduleStudent.name}
                          onChange={(e) => setScheduleStudent({ ...scheduleStudent, name: e.target.value })}
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-navy focus:outline-none"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-navy mb-1">Student ID</label>
                        <input
                          type="text"
                          value={scheduleStudent.studentId}
                          onChange={(e) => setScheduleStudent({ ...scheduleStudent, studentId: e.target.value })}
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-navy focus:outline-none font-mono"
                          placeholder="PRU2600001"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-sm font-medium text-navy mb-1">Term</label>
                          <select
                            value={scheduleTerm}
                            onChange={(e) => setScheduleTerm(e.target.value)}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-navy focus:outline-none"
                          >
                            <option>Fall</option>
                            <option>Spring</option>
                            <option>Summer</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-navy mb-1">Year</label>
                          <input
                            type="text"
                            value={scheduleYear}
                            onChange={(e) => setScheduleYear(e.target.value)}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-navy focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Courses */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-navy">Courses</h3>
                        <button
                          onClick={addCourse}
                          className="flex items-center gap-2 px-3 py-1 text-sm bg-navy/5 text-navy rounded-lg hover:bg-navy/10 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          Add Course
                        </button>
                      </div>
                      <div className="space-y-3">
                        {courses.map((course, index) => (
                          <div key={index} className="grid grid-cols-6 gap-2 items-end p-3 bg-gray-50 rounded-lg">
                            <input
                              type="text"
                              value={course.code}
                              onChange={(e) => updateCourse(index, "code", e.target.value)}
                              className="px-3 py-1.5 border border-gray-200 rounded text-sm font-mono"
                              placeholder="CS 101"
                            />
                            <input
                              type="text"
                              value={course.name}
                              onChange={(e) => updateCourse(index, "name", e.target.value)}
                              className="px-3 py-1.5 border border-gray-200 rounded text-sm"
                              placeholder="Course Name"
                            />
                            <input
                              type="text"
                              value={course.instructor}
                              onChange={(e) => updateCourse(index, "instructor", e.target.value)}
                              className="px-3 py-1.5 border border-gray-200 rounded text-sm"
                              placeholder="Instructor"
                            />
                            <input
                              type="text"
                              value={course.schedule}
                              onChange={(e) => updateCourse(index, "schedule", e.target.value)}
                              className="px-3 py-1.5 border border-gray-200 rounded text-sm"
                              placeholder="MWF 9:00 AM"
                            />
                            <input
                              type="text"
                              value={course.room}
                              onChange={(e) => updateCourse(index, "room", e.target.value)}
                              className="px-3 py-1.5 border border-gray-200 rounded text-sm"
                              placeholder="Room 101"
                            />
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                value={course.credits}
                                onChange={(e) => updateCourse(index, "credits", parseInt(e.target.value) || 0)}
                                className="w-16 px-3 py-1.5 border border-gray-200 rounded text-sm text-center"
                              />
                              <button
                                onClick={() => removeCourse(index)}
                                className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={generateSchedule}
                        disabled={!scheduleStudent.name}
                        className="px-6 py-3 navy-bg text-white font-semibold rounded-lg hover:bg-dark-navy transition-colors disabled:opacity-50"
                      >
                        Generate Schedule
                      </button>
                      <button
                        onClick={resetScheduleForm}
                        className="px-6 py-3 border-2 border-navy text-navy font-semibold rounded-lg hover:bg-navy/5 transition-colors"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-navy">Schedule Preview</h2>
                      <button
                        onClick={() => setShowSchedulePreview(false)}
                        className="text-navy hover:text-dark-navy transition-colors"
                      >
                        ← Edit
                      </button>
                    </div>
                    <div className="overflow-auto">
                      <DocumentPreview
                        documentName={`Schedule-${scheduleStudent.name.replace(/\s+/g, "-")}`}
                        documentType="schedule"
                      >
                        <ClassSchedule
                          schedule={{
                            term: scheduleTerm,
                            academicYear: scheduleYear,
                            courses,
                          }}
                          studentName={scheduleStudent.name}
                          studentId={scheduleStudent.studentId}
                          issueDate={getIssueDate()}
                          docId={scheduleDocId}
                        />
                      </DocumentPreview>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Receipt Form */}
            {activeTab === "receipt" && (
              <div className="space-y-6">
                {!showReceiptPreview ? (
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-navy">Generate Tuition Receipt</h2>
                      <AIAssistant
                        documentType="receipt"
                        currentData={{ ...receiptStudent, term: receiptTerm, year: receiptYear, amount: receiptAmount }}
                        onFillData={handleAIFillReceipt}
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-navy mb-1">Student Name</label>
                          <input
                            type="text"
                            value={receiptStudent.name}
                            onChange={(e) => setReceiptStudent({ ...receiptStudent, name: e.target.value })}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-navy focus:outline-none"
                            placeholder="John Doe"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-navy mb-1">Student ID</label>
                          <input
                            type="text"
                            value={receiptStudent.studentId}
                            onChange={(e) => setReceiptStudent({ ...receiptStudent, studentId: e.target.value })}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-navy focus:outline-none font-mono"
                            placeholder="PRU2600001"
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-navy mb-1">Term</label>
                            <select
                              value={receiptTerm}
                              onChange={(e) => setReceiptTerm(e.target.value)}
                              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-navy focus:outline-none"
                            >
                              <option>Fall</option>
                              <option>Spring</option>
                              <option>Summer</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-navy mb-1">Year</label>
                            <input
                              type="text"
                              value={receiptYear}
                              onChange={(e) => setReceiptYear(e.target.value)}
                              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-navy focus:outline-none"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-navy mb-1">Amount Paid ($)</label>
                          <input
                            type="number"
                            value={receiptAmount}
                            onChange={(e) => setReceiptAmount(e.target.value)}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-navy focus:outline-none"
                            step="0.01"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={generateReceipt}
                        disabled={!receiptStudent.name}
                        className="px-6 py-3 navy-bg text-white font-semibold rounded-lg hover:bg-dark-navy transition-colors disabled:opacity-50"
                      >
                        Generate Receipt
                      </button>
                      <button
                        onClick={resetReceiptForm}
                        className="px-6 py-3 border-2 border-navy text-navy font-semibold rounded-lg hover:bg-navy/5 transition-colors"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-navy">Receipt Preview</h2>
                      <button
                        onClick={() => setShowReceiptPreview(false)}
                        className="text-navy hover:text-dark-navy transition-colors"
                      >
                        ← Edit
                      </button>
                    </div>
                    <div className="overflow-auto">
                      <DocumentPreview
                        documentName={`Receipt-${receiptStudent.name.replace(/\s+/g, "-")}-${receiptTerm}${receiptYear}`}
                        documentType="receipt"
                      >
                        <Receipt
                          payment={{
                            receiptNumber: generateReceiptNumber(),
                            term: receiptTerm,
                            academicYear: receiptYear,
                            amountPaid: parseFloat(receiptAmount) || 0,
                            paymentDate: getIssueDate(),
                            paymentMethod: "Credit Card",
                            balance: 0,
                            totalDue: parseFloat(receiptAmount) || 0,
                          }}
                          studentName={receiptStudent.name}
                          studentId={receiptStudent.studentId}
                          docId={receiptDocId}
                        />
                      </DocumentPreview>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
