import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyD1Xdj-BZ3GXZ9l67b1aP8lerzLKpgYX10",
  authDomain: "women-safety-application-ceb02.firebaseapp.com",
  databaseURL: "https://women-safety-application-ceb02-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "women-safety-application-ceb02",
  storageBucket: "women-safety-application-ceb02.appspot.com",
  messagingSenderId: "242099442566",
  appId: "1:242099442566:web:2ff3ba16211a3f0b109207"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);