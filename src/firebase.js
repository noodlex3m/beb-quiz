// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Твоя конфігурація Firebase
const firebaseConfig = {
	apiKey: "AIzaSyC4nYecH1aB_nS4qbQI6bWE-Kf-70bz4mQ",
	authDomain: "beb-quiz-app.firebaseapp.com",
	projectId: "beb-quiz-app",
	storageBucket: "beb-quiz-app.firebasestorage.app",
	messagingSenderId: "305461667068",
	appId: "1:305461667068:web:77dbba2ef5af6dc80ca379",
};

// Ініціалізація Firebase
const app = initializeApp(firebaseConfig);

// Ініціалізація Firestore (бази даних)
export const db = getFirestore(app);
