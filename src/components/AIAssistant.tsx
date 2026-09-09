"use client";

import { useState } from "react";
import { aiSmartFill, aiAnalyzeDocument, aiSuggestCourses, aiValidateStudent, aiGenerateCompleteDocument } from "@/lib/ai";
import { Sparkles, Brain, CheckCircle, AlertTriangle, Lightbulb, Loader2, Wand2 } from "lucide-react";

interface AIAssistantProps {
  documentType: "id-card" | "schedule" | "receipt";
  currentData: Record<string, string>;
  onFillData: (data: Record<string, string>) => void;
  onFillCourses?: (courses: Array<{ code: string; name: string; instructor: string; schedule: string; room: string; credits: number }>) => void;
}

export default function AIAssistant({ documentType, currentData, onFillData, onFillCourses }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<{ score: number; issues: string[]; suggestions: string[] } | null>(null);
  const [validation, setValidation] = useState<{ valid: boolean; errors: string[]; warnings: string[] } | null>(null);
  const [lastAction, setLastAction] = useState<string>("");

  const handleSmartFill = async () => {
    setIsLoading(true);
    setLastAction("smart-fill");
    try {
      const filled = await aiSmartFill(currentData, documentType);
      onFillData(filled);
    } catch (error) {
      console.error("Smart fill failed:", error);
    }
    setIsLoading(false);
  };

  const handleAnalyze = async () => {
    setIsLoading(true);
    setLastAction("analyze");
    try {
      const result = await aiAnalyzeDocument(currentData, documentType);
      setAnalysis(result);
    } catch (error) {
      console.error("Analysis failed:", error);
    }
    setIsLoading(false);
  };

  const handleValidate = async () => {
    setIsLoading(true);
    setLastAction("validate");
    try {
      const result = await aiValidateStudent(currentData);
      setValidation(result);
    } catch (error) {
      console.error("Validation failed:", error);
    }
    setIsLoading(false);
  };

  const handleSuggestCourses = async () => {
    if (!onFillCourses) return;
    setIsLoading(true);
    setLastAction("suggest-courses");
    try {
      const department = currentData.department || "Computer Science";
      const year = currentData.year || "Sophomore";
      const courses = await aiSuggestCourses(department, year);
      if (courses.length > 0) {
        onFillCourses(courses);
      }
    } catch (error) {
      console.error("Course suggestion failed:", error);
    }
    setIsLoading(false);
  };

  const handleGenerateComplete = async () => {
    setIsLoading(true);
    setLastAction("generate-complete");
    try {
      const complete = await aiGenerateCompleteDocument(documentType, currentData);
      onFillData(complete);
    } catch (error) {
      console.error("Generate complete failed:", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="relative">
      {/* AI Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
          isOpen
            ? "bg-gold text-navy"
            : "bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600"
        }`}
      >
        <Sparkles className="w-4 h-4" />
        <span className="font-medium">AI Assistant</span>
      </button>

      {/* AI Panel */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-4 text-white">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              <h3 className="font-bold">AI Document Assistant</h3>
            </div>
            <p className="text-sm text-white/80 mt-1">
              Powered by Gemini AI • {documentType.replace("-", " ").toUpperCase()}
            </p>
          </div>

          {/* Actions */}
          <div className="p-4 space-y-3">
            {/* Smart Fill */}
            <button
              onClick={handleSmartFill}
              disabled={isLoading}
              className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors text-left disabled:opacity-50"
            >
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                <Wand2 className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-semibold text-navy">Smart Fill</p>
                <p className="text-xs text-gray-500">AI completes empty fields with realistic data</p>
              </div>
              {isLoading && lastAction === "smart-fill" && (
                <Loader2 className="w-4 h-4 text-purple-500 animate-spin ml-auto" />
              )}
            </button>

            {/* Analyze Document */}
            <button
              onClick={handleAnalyze}
              disabled={isLoading}
              className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors text-left disabled:opacity-50"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Brain className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-navy">Analyze Document</p>
                <p className="text-xs text-gray-500">Check completeness and get suggestions</p>
              </div>
              {isLoading && lastAction === "analyze" && (
                <Loader2 className="w-4 h-4 text-blue-500 animate-spin ml-auto" />
              )}
            </button>

            {/* Validate Student */}
            {documentType === "id-card" && (
              <button
                onClick={handleValidate}
                disabled={isLoading}
                className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors text-left disabled:opacity-50"
              >
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-navy">Validate Student</p>
                  <p className="text-xs text-gray-500">Check student data for errors</p>
                </div>
                {isLoading && lastAction === "validate" && (
                  <Loader2 className="w-4 h-4 text-green-500 animate-spin ml-auto" />
                )}
              </button>
            )}

            {/* Suggest Courses */}
            {documentType === "schedule" && onFillCourses && (
              <button
                onClick={handleSuggestCourses}
                disabled={isLoading}
                className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-colors text-left disabled:opacity-50"
              >
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-semibold text-navy">Suggest Courses</p>
                  <p className="text-xs text-gray-500">AI generates courses for department/year</p>
                </div>
                {isLoading && lastAction === "suggest-courses" && (
                  <Loader2 className="w-4 h-4 text-orange-500 animate-spin ml-auto" />
                )}
              </button>
            )}

            {/* Generate Complete */}
            <button
              onClick={handleGenerateComplete}
              disabled={isLoading}
              className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-pink-300 hover:bg-pink-50 transition-colors text-left disabled:opacity-50"
            >
              <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-pink-600" />
              </div>
              <div>
                <p className="font-semibold text-navy">Generate Complete</p>
                <p className="text-xs text-gray-500">AI creates full document from scratch</p>
              </div>
              {isLoading && lastAction === "generate-complete" && (
                <Loader2 className="w-4 h-4 text-pink-500 animate-spin ml-auto" />
              )}
            </button>
          </div>

          {/* Results */}
          {analysis && (
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-navy">Analysis Result</h4>
                <span className={`text-2xl font-bold ${analysis.score >= 80 ? "text-green-600" : analysis.score >= 50 ? "text-yellow-600" : "text-red-600"}`}>
                  {analysis.score}%
                </span>
              </div>
              {analysis.issues.length > 0 && (
                <div className="mb-2">
                  <p className="text-xs font-semibold text-red-600 mb-1">Issues:</p>
                  {analysis.issues.map((issue, i) => (
                    <p key={i} className="text-xs text-red-500 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> {issue}
                    </p>
                  ))}
                </div>
              )}
              {analysis.suggestions.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-blue-600 mb-1">Suggestions:</p>
                  {analysis.suggestions.map((suggestion, i) => (
                    <p key={i} className="text-xs text-blue-500 flex items-center gap-1">
                      <Lightbulb className="w-3 h-3" /> {suggestion}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}

          {validation && (
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center gap-2 mb-2">
                {validation.valid ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                )}
                <h4 className="font-semibold text-navy">
                  {validation.valid ? "Valid" : "Invalid"}
                </h4>
              </div>
              {validation.errors.length > 0 && (
                <div className="mb-2">
                  {validation.errors.map((error, i) => (
                    <p key={i} className="text-xs text-red-500">• {error}</p>
                  ))}
                </div>
              )}
              {validation.warnings.length > 0 && (
                <div>
                  {validation.warnings.map((warning, i) => (
                    <p key={i} className="text-xs text-yellow-600">• {warning}</p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
