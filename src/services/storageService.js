// src/services/storageService.js

const HISTORY_KEY = "beb_quiz_results";

export const storageService = {
	// Отримання історії
	getHistory: () => {
		try {
			const savedHistory = localStorage.getItem(HISTORY_KEY);
			return savedHistory ? JSON.parse(savedHistory) : [];
		} catch (error) {
			console.error("Помилка при читанні історії:", error);
			return [];
		}
	},

	// Збереження нового результату
	saveResult: (newResult) => {
		try {
			const history = storageService.getHistory();
			// Зберігаємо тільки останні 8 спроб
			const updatedHistory = [newResult, ...history].slice(0, 8);
			localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
			return updatedHistory;
		} catch (error) {
			console.error("Помилка при збереженні результату:", error);
			return storageService.getHistory(); // Повертаємо стару історію, якщо сталася помилка
		}
	},
};
