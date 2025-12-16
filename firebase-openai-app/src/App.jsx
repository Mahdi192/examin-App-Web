import { useEffect, useMemo, useState } from "react";
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth } from "./firebase";
import { useAuth } from "./AuthContext";
import { createNote, deleteNote, listenToMyNotes, updateNote } from "./notesService";

export default function App() {
  const { user, loading } = useAuth();

  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const loginGoogle = async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (e) {
      console.error(e);
      alert(e.code || e.message);
    }
  };

  const loginGithub = async () => {
    try {
      await signInWithPopup(auth, new GithubAuthProvider());
    } catch (e) {
      console.error(e);
      alert(e.code || e.message);
    }
  };

  const logout = async () => signOut(auth);

  // ✅ READ (real-time)
  useEffect(() => {
    if(!user) return;
    const unsub = listenToMyNotes(user.uid, setNotes);
    return () => unsub();
  }, [user]);
  

  const canCreate = useMemo(() => title.trim() && content.trim(), [title, content]);

  const onCreate = async () => {
    if (!user) return;
    await createNote(user.uid, title.trim(), content.trim());
    setTitle("");
    setContent("");
  };

  const startEdit = (n) => {
    setEditingId(n.id);
    setEditTitle(n.title || "");
    setEditContent(n.content || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditContent("");
  };

  const onSaveEdit = async () => {
    await updateNote(editingId, { title: editTitle.trim(), content: editContent.trim() });
    cancelEdit();
  };

  const onDelete = async (id) => {
    if (!confirm("Supprimer cette note ?")) return;
    await deleteNote(id);
  };

  if (loading) return <div style={{ padding: 24 }}>Chargement...</div>;

  if (!user) {
    return (
      <div style={{ fontFamily: "system-ui", padding: 24, maxWidth: 900, margin: "0 auto" }}>
        <h1>AI Notes Manager</h1>
        <p>Connecte-toi pour accéder à tes notes.</p>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={loginGoogle}>Se connecter avec Google</button>
          <button onClick={loginGithub}>Se connecter avec GitHub</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "system-ui", padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
        <div>
          <h1 style={{ margin: 0 }}>AI Notes Manager</h1>
          <div style={{ opacity: 0.8, marginTop: 4 }}>
            Connecté : <b>{user.displayName || user.email}</b>
          </div>
        </div>
        <button onClick={logout}>Se déconnecter</button>
      </div>

      <hr style={{ margin: "20px 0" }} />

      {/* CREATE */}
      <h2>Créer une note</h2>
      <div style={{ display: "grid", gap: 10 }}>
        <input
          placeholder="Titre"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Contenu"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
        />
        <button onClick={onCreate} disabled={!canCreate}>
          Ajouter
        </button>
      </div>

      <hr style={{ margin: "20px 0" }} />

      {/* READ + UPDATE + DELETE */}
      <h2>Mes notes</h2>

      {notes.length === 0 ? (
        <p>Aucune note pour l’instant.</p>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {notes.map((n) => (
            <div key={n.id} style={{ border: "1px solid #333", borderRadius: 10, padding: 12 }}>
              {editingId === n.id ? (
                <>
                  <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={4}
                    style={{ width: "100%", marginTop: 8 }}
                  />
                  <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                    <button onClick={onSaveEdit}>Enregistrer</button>
                    <button onClick={cancelEdit}>Annuler</button>
                  </div>
                </>
              ) : (
                <>
                  <h3 style={{ marginTop: 0 }}>{n.title}</h3>
                  <p style={{ whiteSpace: "pre-wrap" }}>{n.content}</p>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={() => startEdit(n)}>Modifier</button>
                    <button onClick={() => onDelete(n.id)}>Supprimer</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
