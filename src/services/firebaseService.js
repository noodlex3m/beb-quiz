// src/services/firebaseService.js
import {
	collection,
	getDocs,
	doc,
	setDoc,
	addDoc,
	query,
	where,
	orderBy,
	limit,
} from "firebase/firestore";
import { db } from "../firebase";

export const firebaseService = {
	// Завантаження питань з бази (те, що ми писали раніше)
	fetchQuestions: async () => {
		try {
			const querySnapshot = await getDocs(collection(db, "questions"));
			const questions = [];
			querySnapshot.forEach((docSnap) => {
				questions.push({ id: docSnap.id, ...docSnap.data() });
			});
			return questions;
		} catch (error) {
			console.error("Помилка при завантаженні питань з Firebase:", error);
			throw error;
		}
	},

	// ФУНКЦІЯ: Одноразове завантаження локального JSON у Firebase
	uploadQuestions: async (questionsArray) => {
		try {
			console.log(`Починаємо завантаження ${questionsArray.length} питань...`);

			// Проходимося по кожному питанню з масиву
			for (const question of questionsArray) {
				// Створюємо посилання на документ. Використовуємо id питання як ключ.
				// Перетворюємо id в рядок, бо Firebase любить ключі-рядки
				const docRef = doc(db, "questions", question.id.toString());

				// Зберігаємо документ у базу
				await setDoc(docRef, question);
			}

			console.log("✅ Всі питання успішно завантажено у Firebase!");
			alert("✅ База успішно синхронізована з Firebase!");
		} catch (error) {
			console.error("❌ Помилка під час завантаження:", error);
			alert("❌ Сталася помилка. Подивись консоль.");
		}
	},
	// --- НОВІ ФУНКЦІЇ ДЛЯ СТАТИСТИКИ ---

	// 1. Збереження результату іспиту
	saveUserResult: async (userId, resultData) => {
		try {
			// Зберігаємо в колекцію "user_results"
			await addDoc(collection(db, "user_results"), {
				userId: userId, // ID користувача з Google
				score: resultData.score,
				total: resultData.total,
				percentage: resultData.percentage,
				date: resultData.date,
				timestamp: new Date(), // Зберігаємо точний час для сортування
				wrongAnswers: resultData.wrongAnswers,
			});
			console.log("Результат збережено у Firebase!");
		} catch (error) {
			console.error("Помилка збереження результату:", error);
		}
	},

	// 2. Отримання останніх 8 результатів конкретного користувача
	getUserHistory: async (userId) => {
		try {
			// Створюємо запит: шукаємо результати ЦЬОГО користувача, сортуємо від найновіших, беремо 8 штук
			const q = query(
				collection(db, "user_results"),
				where("userId", "==", userId),
				orderBy("timestamp", "desc"),
				limit(8),
			);

			const querySnapshot = await getDocs(q);
			const history = [];
			querySnapshot.forEach((doc) => {
				history.push(doc.data());
			});
			return history;
		} catch (error) {
			console.error("Помилка отримання історії:", error);
			return [];
		}
	},
};
