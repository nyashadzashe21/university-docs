import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export interface DocumentRecord {
  id?: string;
  type: "id-card" | "schedule" | "receipt";
  studentName: string;
  studentId: string;
  docId: string;
  data: Record<string, unknown>;
  generatedBy: string;
  generatedAt: Timestamp;
  status: "active" | "revoked";
}

// Save a generated document
export async function saveDocument(doc: Omit<DocumentRecord, "id">) {
  const docRef = await addDoc(collection(db, "documents"), doc);
  return docRef.id;
}

// Get all documents for a user
export async function getUserDocuments(userId: string) {
  const q = query(
    collection(db, "documents"),
    where("generatedBy", "==", userId),
    orderBy("generatedAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as DocumentRecord[];
}

// Get all documents (admin)
export async function getAllDocuments() {
  const q = query(
    collection(db, "documents"),
    orderBy("generatedAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as DocumentRecord[];
}

// Get document by docId (for verification)
export async function getDocumentByDocId(docId: string) {
  const q = query(
    collection(db, "documents"),
    where("docId", "==", docId)
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as DocumentRecord;
}

// Revoke a document
export async function revokeDocument(docId: string) {
  const q = query(
    collection(db, "documents"),
    where("docId", "==", docId)
  );
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    await updateDoc(doc(db, "documents", snapshot.docs[0].id), {
      status: "revoked",
    });
  }
}

// Delete a document
export async function deleteDocument(docId: string) {
  const q = query(
    collection(db, "documents"),
    where("docId", "==", docId)
  );
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    await deleteDoc(doc(db, "documents", snapshot.docs[0].id));
  }
}
