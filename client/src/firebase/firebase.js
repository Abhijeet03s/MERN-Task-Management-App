import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBXbAaMCiVFCys0FUVjcfJPsTIvnXZX2Ps",
  authDomain: "todo-auth-40a5f.firebaseapp.com",
  projectId: "todo-auth-40a5f",
  storageBucket: "todo-auth-40a5f.appspot.com",
  messagingSenderId: "901327267071",
  appId: "1:901327267071:web:0d02395b8786f866c918ca"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();

export { app, auth };