import { GoogleAuthProvider, GithubAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "./firebase";
import { useAuth } from "./AuthContext";

export default function App() {
     const { user, loading } = useAuth();

  const loginGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const loginGithub = async () => {
    const provider = new GithubAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
  };
  

  if (loading) return <div style={{ padding: 24 }}>Chargement...</div>;

  return (
    <div style={{ fontFamily: "system-ui", padding: 24, maxWidth: 720, margin: "0 auto" }}>
      <h1>AI Notes Manager</h1>

      {!user ? (
        <>
          <p>Connecte-toi pour accéder à tes notes.</p>
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={loginGoogle}>Se connecter avec Google</button>
            <button onClick={loginGithub}>Se connecter avec GitHub</button>
          </div>
        </>
      ) : (
        <>
          <p>
            Connecté en tant que <b>{user.displayName || user.email}</b>
          </p>
          <p style={{ opacity: 0.8, marginTop: 4 }}>UID: {user.uid}</p>

          <button onClick={logout} style={{ marginTop: 12 }}>
            Se déconnecter
          </button>

          <hr style={{ margin: "24px 0" }} />
          <p>✅ Section Auth terminée. Prochaine étape : Firestore (CRUD).</p>
        </>
      )}
    </div>
  );
}
