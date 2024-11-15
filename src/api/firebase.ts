import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  NextOrObserver,
  onAuthStateChanged,
  signInWithPopup,
  User,
} from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDeXI9mPivB4FU9BsQS40i5KDNO5wIJqfw",
  authDomain: "simple-desires.firebaseapp.com",
  projectId: "simple-desires",
  storageBucket: "simple-desires.firebasestorage.app",
  messagingSenderId: "376265130880",
  appId: "1:376265130880:web:31c651fed15adca4b4f765",
};

const provider = new GoogleAuthProvider();
initializeApp(firebaseConfig);

const signIn = async () => {
  const auth = getAuth();
  const result = await signInWithPopup(auth, provider);
  const credential = GoogleAuthProvider.credentialFromResult(result);
  if (!credential) throw new Error("Error retrieving credential");
  const token = credential?.accessToken;
  const user = result.user;
  console.log(user);
  return { token, user };
};

let cached: Desire[] | null = null;

const getRandomDesire = async (): Promise<Desire> => {
  if (cached != null) {
    return cached[Math.floor(Math.random() * cached.length)];
  }
  const auth = getAuth();
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Connect to the World to connect to your Desires.");
  const db = getFirestore();
  const docs = await getDocs(
    query(collection(db, "simple-desire"), where("uid", "==", uid))
  );
  cached = [];
  docs.forEach((doc) =>
    cached!.push({ ...(doc.data() as Desire), desireUid: doc.id })
  );
  return cached[Math.floor(Math.random() * cached.length)];
};

const addDesire = async (description: string) => {
  const auth = getAuth();
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Connect to the World to connect to your Desires.");
  const db = getFirestore();
  const desire: Desire = {
    uid,
    description,
  };
  const created = await addDoc(collection(db, "simple-desire"), desire);
  cached = null;
  return created;
};

const removeDesire = async (desireUid: string) => {
  const db = getFirestore();
  await deleteDoc(doc(db, "simple-desire", desireUid));
  cached = null;
};

const onAuthChange = (callback: NextOrObserver<User>) => {
  const auth = getAuth();
  onAuthStateChanged(auth, callback);
};

export { getRandomDesire, signIn, onAuthChange, addDesire, removeDesire };
