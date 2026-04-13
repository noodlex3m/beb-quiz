import { useState } from "react";
import questionsData from "../data/questions.json";

function Quiz() {
	// Створюємо "стани" (state) для нашого додатку
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Номер поточного питання
	const [score, setScore] = useState(0); // Кількість правильних відповідей
	const [showResult, setShowResult] = useState(false); // Чи показувати екран результатів

	// Беремо поточне питання з нашого масиву
	const currentQuestion = questionsData[currentQuestionIndex];

	// Функція, яка спрацьовує при кліку на варіант відповіді
	const handleAnswerClick = (selectedOption) => {
		// Перевіряємо, чи правильна відповідь
		if (selectedOption === currentQuestion.correctAnswer) {
			setScore(score + 1); // Додаємо 1 бал
		}

		// Переходимо до наступного питання або показуємо результат
		const nextQuestionIndex = currentQuestionIndex + 1;
		if (nextQuestionIndex < questionsData.length) {
			setCurrentQuestionIndex(nextQuestionIndex);
		} else {
			setShowResult(true);
		}
	};

	// Функція для перезапуску тесту
	const restartQuiz = () => {
		setCurrentQuestionIndex(0);
		setScore(0);
		setShowResult(false);
	};

	// Якщо тест завершено, показуємо цей блок (ResultScreen)
	if (showResult) {
		return (
			<div className="result-screen">
				<h2>Тестування завершено! 🎉</h2>
				<p>
					Твій результат: <strong>{score}</strong> з{" "}
					<strong>{questionsData.length}</strong>
				</p>
				<button className="restart-btn" onClick={restartQuiz}>
					Спробувати ще раз
				</button>
			</div>
		);
	}

	// Якщо тест триває, показуємо картку з питанням (QuestionCard + ProgressBar)
	return (
		<div className="quiz-container">
			<div className="progress-bar">
				Питання {currentQuestionIndex + 1} з {questionsData.length}
			</div>

			<h2 className="question-text">{currentQuestion.question}</h2>

			<div className="options-container">
				{currentQuestion.options.map((option, index) => (
					<button
						key={index}
						className="option-button"
						onClick={() => handleAnswerClick(option)}
					>
						{option}
					</button>
				))}
			</div>
		</div>
	);
}

export default Quiz;
