// src/services/firebaseService.js
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
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

	// НОВА ФУНКЦІЯ: Одноразове завантаження локального JSON у Firebase
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
};
