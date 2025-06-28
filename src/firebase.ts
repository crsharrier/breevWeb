// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAAoLSnz-aahpAW-_Z5qHHxh-d5zYeY_FQ",
  authDomain: "breev-fa8b2.firebaseapp.com",
  projectId: "breev-fa8b2",
  storageBucket: "breev-fa8b2.firebasestorage.app",
  messagingSenderId: "493800258621",
  appId: "1:493800258621:web:b38987f456602764e8be54",
  measurementId: "G-2H37VZ3P2Y",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
