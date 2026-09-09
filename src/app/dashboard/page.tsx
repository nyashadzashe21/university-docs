"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { DEFAULT_UNIVERSITY, generateStudentId, generateDocId, getIssueDate, getExpirationDate, generateReceiptNumber, type Student, type Course, type UniversityInfo } from "@/lib/utils";
import { saveDocument, getUserDocuments, type DocumentRecord } from "@/lib/documents";
import IDCard from "@/components/IDCard";
import ClassSchedule from "@/components/Schedule";
import Receipt from "@/components/Receipt";
import DocumentPreview from "@/components/DocumentPreview";
import AIAssistant from "@/components/AIAssistant";
import CameraModal from "@/components/CameraModal";
import { LogOut, CreditCard, Calendar, Plus, Trash2, User, FileText, Loader2, Camera, Building2 } from "lucide-react";
import { Timestamp } from "firebase/firestore";

type DocumentType = "id-card" | "schedule" | "receipt" | "university";

const DEMO_COURSES: Course[] = [
  { code: "CS 101", name: "Introduction to Computer Science", instructor: "Dr. Sarah Chen", schedule: "MWF 9:00-9:50 AM", room: "Science Hall 201", credits: 3 },
  { code: "MATH 201", name: "Linear Algebra", instructor: "Prof. James Miller", schedule: "TTh 10:30-11:45 AM", room: "Math Building 105", credits: 4 },
  { code: "ENG 102", name: "Academic Writing", instructor: "Dr. Emily Roberts", schedule: "MWF 11:00-11:50 AM", room: "Liberal Arts 302", credits: 3 },
  { code: "PHYS 101", name: "General Physics I", instructor: "Prof. Michael Zhang", schedule: "TTh 1:00-2:15 PM", room: "Physics Lab 110", credits: 4 },
];

export default function Dashboard() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<DocumentType>("university");
  const [generatedDocs, setGeneratedDocs] = useState<DocumentRecord[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(true);

  // University Info
  const [university, setUniversity] = useState<UniversityInfo>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("universityInfo");
      return saved ? JSON.parse(saved) : DEFAULT_UNIVERSITY;
    }
    return DEFAULT_UNIVERSITY;
  });
  const [showLogoModal, setShowLogoModal] = useState(false);

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
  const [showPhotoModal, setShowPhotoModal] = useState(false);

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

  // Save university info to localStorage
  useEffect(() => {
    localStorage.setItem("universityInfo", JSON.stringify(university));
  }, [university]);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Load user documents
  useEffect(() => {
    if (user) {
      loadDocuments();
    }
  }, [user]);

  const loadDocuments = async () => {
    if (!user) return;
    setLoadingDocs(true);
    try {
      const docs = await getUserDocuments(user.uid);
      setGeneratedDocs(docs);
    } catch (error) {
      console.error("Failed to load documents:", error);
    }
    setLoadingDocs(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const saveToFirestore = async (type: DocumentType, studentName: string, studentId: string, docId: string, data: Record<string, unknown>) => {
    if (!user) return;
    try {
      await saveDocument({
        type,
        studentName,
        studentId,
        docId,
        data,
        generatedBy: user.uid,
        generatedAt: Timestamp.now(),
        status: "active",
      });
      loadDocuments();
    } catch (error) {
      console.error("Failed to save document:", error);
    }
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

  const generateIDCard = async () => {
    setShowIDPreview(true);
    await saveToFirestore("id-card", `${student.firstName} ${student.lastName}`, student.studentId, idDocId, student as unknown as Record<string, unknown>);
  };

  const generateSchedule = async () => {
    setShowSchedulePreview(true);
    await saveToFirestore("schedule", scheduleStudent.name, scheduleStudent.studentId, scheduleDocId, { courses, term: scheduleTerm, year: scheduleYear });
  };

  const generateReceipt = async () => {
    setShowReceiptPreview(true);
    await saveToFirestore("receipt", receiptStudent.name, receiptStudent.studentId, receiptDocId, { term: receiptTerm, year: receiptYear, amount: receiptAmount });
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-navy animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const initials = university.shortName?.[0] || university.name?.[0] || "?";
  const uniName = university.name || "Your University";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="text-white shadow-lg" style={{ background: `linear-gradient(135deg, ${university.colors.primary}, ${university.colors.primary}dd)` }}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {university.logo ? (
                <img src={university.logo} alt="Logo" className="w-10 h-10 rounded-full object-cover border-2" style={{ borderColor: university.colors.secondary }} />
              ) : (
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: university.colors.secondary }}>
                  <span className="text-sm font-bold" style={{ color: university.colors.primary }}>{initials}</span>
                </div>
              )}
              <div>
                <h1 className="text-lg font-bold">{uniName}</h1>
                <p className="text-xs" style={{ color: university.colors.secondary }}>Document Management System</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-semibold">{user.email}</p>
                <p className="text-xs text-white/70">Staff Account</p>
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
                Settings & Documents
              </h2>
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab("university")}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === "university"
                      ? "navy-bg text-white"
                      : "text-navy hover:bg-navy/5"
                  }`}
                >
                  <Building2 className="w-5 h-5" />
                  <span className="font-medium">University Details</span>
                </button>
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
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-navy/60 uppercase tracking-wider mb-3 px-3">
                  Recent Documents
                </h3>
                {loadingDocs ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="w-4 h-4 text-navy animate-spin" />
                  </div>
                ) : generatedDocs.length === 0 ? (
                  <p className="text-xs text-gray-400 px-3">No documents yet</p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {generatedDocs.slice(0, 10).map((doc) => (
                      <div key={doc.id} className="px-3 py-2 bg-gray-50 rounded-lg text-xs">
                        <div className="flex items-center gap-2">
                          <FileText className="w-3 h-3 text-navy" />
                          <p className="font-semibold text-navy capitalize">{doc.type.replace("-", " ")}</p>
                        </div>
                        <p className="text-gray-500 truncate mt-1">{doc.studentName}</p>
                        <p className="text-gray-400 text-[10px]">
                          {doc.generatedAt?.toDate?.()?.toLocaleDateString() || "Just now"}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* University Details Form */}
            {activeTab === "university" && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-navy mb-6">University Details</h2>
                <p className="text-sm text-gray-500 mb-6">Enter your institution details. These will appear on all generated documents.</p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-navy mb-1">University Name *</label>
                      <input
                        type="text"
                        value={university.name}
                        onChange={(e) => setUniversity({ ...university, name: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-navy focus:outline-none"
                        placeholder="e.g. Harvard University"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy mb-1">Short Name / Abbreviation *</label>
                      <input
                        type="text"
                        value={university.shortName}
                        onChange={(e) => setUniversity({ ...university, shortName: e.target.value.toUpperCase() })}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-navy focus:outline-none"
                        placeholder="e.g. HU"
                        maxLength={6}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy mb-1">Motto</label>
                      <input
                        type="text"
                        value={university.motto}
                        onChange={(e) => setUniversity({ ...university, motto: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-navy focus:outline-none"
                        placeholder="e.g. Veritas"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy mb-1">Established Year</label>
                      <input
                        type="text"
                        value={university.established}
                        onChange={(e) => setUniversity({ ...university, established: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-navy focus:outline-none"
                        placeholder="e.g. 1636"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy mb-1">Address</label>
                      <input
                        type="text"
                        value={university.address}
                        onChange={(e) => setUniversity({ ...university, address: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-navy focus:outline-none"
                        placeholder="e.g. 1200 Academic Drive, Cambridge, MA 02138"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-navy mb-1">Phone</label>
                      <input
                        type="text"
                        value={university.phone}
                        onChange={(e) => setUniversity({ ...university, phone: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-navy focus:outline-none"
                        placeholder="e.g. (617) 555-0100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy mb-1">Website</label>
                      <input
                        type="text"
                        value={university.website}
                        onChange={(e) => setUniversity({ ...university, website: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-navy focus:outline-none"
                        placeholder="e.g. www.harvard.edu"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy mb-1">Primary Color</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={university.colors.primary}
                          onChange={(e) => setUniversity({ ...university, colors: { ...university.colors, primary: e.target.value } })}
                          className="w-12 h-10 rounded cursor-pointer border-2 border-gray-200"
                        />
                        <input
                          type="text"
                          value={university.colors.primary}
                          onChange={(e) => setUniversity({ ...university, colors: { ...university.colors, primary: e.target.value } })}
                          className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-navy focus:outline-none font-mono text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy mb-1">Secondary Color</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={university.colors.secondary}
                          onChange={(e) => setUniversity({ ...university, colors: { ...university.colors, secondary: e.target.value } })}
                          className="w-12 h-10 rounded cursor-pointer border-2 border-gray-200"
                        />
                        <input
                          type="text"
                          value={university.colors.secondary}
                          onChange={(e) => setUniversity({ ...university, colors: { ...university.colors, secondary: e.target.value } })}
                          className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-navy focus:outline-none font-mono text-sm"
                        />
                      </div>
                    </div>

                    {/* Logo Upload */}
                    <div>
                      <label className="block text-sm font-medium text-navy mb-1">Logo / Emblem</label>
                      <div className="flex items-center gap-4">
                        {university.logo && (
                          <img src={university.logo} alt="Logo" className="w-16 h-16 rounded-full object-cover border-2 border-gray-200" />
                        )}
                        <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-navy hover:bg-navy/5 transition-colors">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (ev) => {
                                  setUniversity({ ...university, logo: ev.target?.result as string });
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                          <Camera className="w-5 h-5 text-gray-400" />
                          <span className="text-sm text-gray-500">{university.logo ? "Change Logo" : "Upload Logo"}</span>
                        </label>
                        {university.logo && (
                          <button
                            onClick={() => setUniversity({ ...university, logo: "" })}
                            className="text-xs text-red-500 hover:text-red-700"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preview */}
                <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
                  <h3 className="text-sm font-semibold text-navy mb-4">Preview</h3>
                  <div className="flex items-center gap-4">
                    {university.logo ? (
                      <img src={university.logo} alt="Logo" className="w-14 h-14 rounded-full object-cover border-2" style={{ borderColor: university.colors.secondary }} />
                    ) : (
                      <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: university.colors.secondary }}>
                        <span className="text-lg font-bold" style={{ color: university.colors.primary }}>{initials}</span>
                      </div>
                    )}
                    <div>
                      <p className="text-lg font-bold" style={{ color: university.colors.primary }}>{uniName}</p>
                      <p className="text-sm" style={{ color: university.colors.secondary }}>{university.motto || "Your motto here"}</p>
                      <p className="text-xs text-gray-500">{university.address || "Address"} | {university.phone || "Phone"} | {university.website || "Website"}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ID Card Form */}
            {activeTab === "id-card" && (
              <div className="space-y-6">
                {!showIDPreview ? (
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-navy">Generate Student ID Card</h2>
                      <AIAssistant
                        documentType="id-card"
                        currentData={student as unknown as Record<string, string>}
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
                            placeholder="john.doe@university.edu"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-navy mb-1">Student Photo</label>
                          <button
                            type="button"
                            onClick={() => setShowPhotoModal(true)}
                            className="w-full flex items-center gap-3 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-navy hover:bg-navy/5 transition-colors"
                          >
                            {student.photo ? (
                              <>
                                <img
                                  src={student.photo}
                                  alt="Preview"
                                  className="w-12 h-12 rounded-lg object-cover border-2 border-navy/20"
                                />
                                <div className="text-left">
                                  <p className="text-sm font-semibold text-navy">Change Photo</p>
                                  <p className="text-xs text-gray-400">Click to upload or take a new photo</p>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                  <Camera className="w-6 h-6 text-gray-400" />
                                </div>
                                <div className="text-left">
                                  <p className="text-sm font-semibold text-navy">Add Student Photo</p>
                                  <p className="text-xs text-gray-400">Upload from file or use camera</p>
                                </div>
                              </>
                            )}
                          </button>
                          {student.photo && (
                            <button
                              type="button"
                              onClick={() => setStudent({ ...student, photo: "" })}
                              className="mt-2 text-xs text-red-500 hover:text-red-700"
                            >
                              Remove photo
                            </button>
                          )}
                        </div>
                        {showPhotoModal && (
                          <CameraModal
                            onCapture={(photo) => {
                              setStudent({ ...student, photo });
                              setShowPhotoModal(false);
                            }}
                            onClose={() => setShowPhotoModal(false)}
                          />
                        )}
                      </div>
                    </div>
                    <div className="mt-6 flex gap-4">
                      <button
                        onClick={generateIDCard}
                        disabled={!student.firstName || !student.lastName || !university.name}
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
                        university={university}
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
                          placeholder="HU2600001"
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
                        disabled={!scheduleStudent.name || !university.name}
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
                          university={university}
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
                            placeholder="HU2600001"
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
                        disabled={!receiptStudent.name || !university.name}
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
                          university={university}
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
