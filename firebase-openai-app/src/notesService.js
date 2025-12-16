import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

export function listenToMyNotes(uid, callback) {
  const q = query(
    collection(db, "notes"),
    where("uid", "==", uid)
  );

  return onSnapshot(q, (snap) => {
    const notes = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(notes);
  });
}


export async function createNote(uid, title, content) {
  return addDoc(collection(db, "notes"), {
    uid,
    title,
    content,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateNote(noteId, data) {
  const ref = doc(db, "notes", noteId);
  return updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
}

export async function deleteNote(noteId) {
  const ref = doc(db, "notes", noteId);
  return deleteDoc(ref);
}
