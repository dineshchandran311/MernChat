import firebase from "firebase/compat/app";
import 'firebase/compat/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAPGUQYfugGi5tqwxwULprTZW2xaZ6-blk",
  authDomain: "whatsapp-mern-cd311.firebaseapp.com",
  projectId: "whatsapp-mern-cd311",
  storageBucket: "whatsapp-mern-cd311.appspot.com",
  messagingSenderId: "503550365900",
  appId: "1:503550365900:web:7b72c83937201de10e7269",
  measurementId: "G-0E9BCFB3TG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = app.auth();

export { app, auth };
export default app;