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

export async function saveDocument(docData: Omit<DocumentRecord, "id">) {
  const docRef = await addDoc(collection(db, "documents"), docData);
  return docRef.id;
}

export async function getUserDocuments(userId: string) {
  const q = query(
    collection(db, "documents"),
    where("generatedBy", "==", userId),
    orderBy("generatedAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as DocumentRecord[];
}

export async function getAllDocuments() {
  const q = query(
    collection(db, "documents"),
    orderBy("generatedAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as DocumentRecord[];
}

export async function getDocumentByDocId(docId: string) {
  const q = query(
    collection(db, "documents"),
    where("docId", "==", docId)
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const d = snapshot.docs[0];
  return { id: d.id, ...d.data() } as DocumentRecord;
}

export async function revokeDocument(docId: string) {
  const q = query(
    collection(db, "documents"),
    where("docId", "==", docId)
  );
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    const docRef = doc(db, "documents", snapshot.docs[0].id);
    await updateDoc(docRef, { status: "revoked" });
  }
}

export async function deleteDocument(docId: string) {
  const q = query(
    collection(db, "documents"),
    where("docId", "==", docId)
  );
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    const docRef = doc(db, "documents", snapshot.docs[0].id);
    await deleteDoc(docRef);
  }
}
