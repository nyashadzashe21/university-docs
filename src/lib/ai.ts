const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
}

async function callGemini(prompt: string): Promise<string> {
  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data: GeminiResponse = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  } catch (error) {
    console.error("Gemini API error:", error);
    return "";
  }
}

export async function aiSmartFill(
  partialData: Record<string, string>,
  documentType: "id-card" | "schedule" | "receipt",
  universityName: string = "the university"
): Promise<Record<string, string>> {
  const prompt = `You are a university document assistant for ${universityName}.
Based on the partial information provided, generate realistic and appropriate values for empty fields.
Return ONLY a JSON object with the same keys, filling in empty strings with sensible values.
Do not change any fields that already have values.

Partial ${documentType} data:
${JSON.stringify(partialData, null, 2)}

Rules:
- Student IDs follow format: [2-letter prefix][2-digit year][5-digit number]
- Use realistic department names: Computer Science, Engineering, Business, Liberal Arts, Sciences, Medicine
- Use realistic course codes and names
- Keep names professional and realistic
- Dates should be in YYYY-MM-DD format
- Return ONLY the JSON object, no explanation.`;

  const response = await callGemini(prompt);
  try {
    const cleaned = response.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return partialData;
  }
}

export async function aiAnalyzeDocument(
  documentData: Record<string, unknown>,
  documentType: "id-card" | "schedule" | "receipt",
  universityName: string = "the university"
): Promise<{ score: number; issues: string[]; suggestions: string[] }> {
  const prompt = `You are a university document quality analyzer for ${universityName}.
Analyze this ${documentType} document data and provide:
1. A completeness score from 0-100
2. A list of issues found (empty array if none)
3. A list of improvement suggestions

Document data:
${JSON.stringify(documentData, null, 2)}

Return ONLY a JSON object in this format:
{
  "score": number,
  "issues": ["issue1", "issue2"],
  "suggestions": ["suggestion1", "suggestion2"]
}`;

  const response = await callGemini(prompt);
  try {
    const cleaned = response.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return {
      score: 50,
      issues: ["Could not analyze document"],
      suggestions: ["Please try again"],
    };
  }
}

export async function aiSuggestCourses(
  department: string,
  year: string,
  universityName: string = "the university"
): Promise<Array<{ code: string; name: string; instructor: string; schedule: string; room: string; credits: number }>> {
  const prompt = `You are a university course scheduler for ${universityName}.
Generate 4-5 realistic courses for a ${year} student in the ${department} department.

Return ONLY a JSON array of course objects:
[
  {
    "code": "DEPT 101",
    "name": "Course Name",
    "instructor": "Prof. First Last",
    "schedule": "MWF 9:00-9:50 AM",
    "room": "Building Room",
    "credits": 3
  }
]

Rules:
- Use realistic course codes (e.g., CS 101, MATH 201, ENG 102)
- Use realistic professor names
- Vary schedule times (MWF or TTh patterns)
- Use realistic room/building names
- Credits should be 1-4
- Return ONLY the JSON array, no explanation.`;

  const response = await callGemini(prompt);
  try {
    const cleaned = response.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return [];
  }
}

export async function aiValidateStudent(
  studentData: Record<string, string>,
  universityName: string = "the university"
): Promise<{ valid: boolean; errors: string[]; warnings: string[] }> {
  const prompt = `You are a university student data validator for ${universityName}.
Validate this student information and return any errors or warnings.

Student data:
${JSON.stringify(studentData, null, 2)}

Return ONLY a JSON object:
{
  "valid": true/false,
  "errors": ["error1"],
  "warnings": ["warning1"]
}

Check for:
- Required fields (firstName, lastName, studentId, department, year)
- Student ID format (PRU + 2 digits + 5 digits)
- Email format if provided
- Realistic name (not obviously fake)
- Return ONLY the JSON, no explanation.`;

  const response = await callGemini(prompt);
  try {
    const cleaned = response.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return { valid: true, errors: [], warnings: [] };
  }
}

export async function aiGenerateCompleteDocument(
  documentType: "id-card" | "schedule" | "receipt",
  hints: Record<string, string>,
  universityName: string = "the university"
): Promise<Record<string, string>> {
  const prompt = `You are a university document generator for ${universityName}.
Generate a complete, realistic ${documentType} document based on these hints:
${JSON.stringify(hints, null, 2)}

Return ONLY a JSON object with all required fields filled in with realistic data.
Make sure all fields are appropriate for a ${documentType} document at ${universityName}.
Return ONLY the JSON, no explanation.`;

  const response = await callGemini(prompt);
  try {
    const cleaned = response.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return hints;
  }
}
