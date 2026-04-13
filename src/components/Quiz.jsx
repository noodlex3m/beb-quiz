import { useState } from "react";
import questionsData from "../data/questions.json";

function Quiz() {
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [score, setScore] = useState(0);
	const [showResult, setShowResult] = useState(false);

	// НОВІ СТАНИ: для збереження вибраної відповіді та паузи
	const [selectedAnswer, setSelectedAnswer] = useState(null);
	const [isChecking, setIsChecking] = useState(false);

	const currentQuestion = questionsData[currentQuestionIndex];

	const handleAnswerClick = (option) => {
		// Якщо ми вже перевіряємо відповідь, ігноруємо подальші кліки
		if (isChecking) return;

		setSelectedAnswer(option);
		setIsChecking(true);

		if (option === currentQuestion.correctAnswer) {
			setScore(score + 1);
		}

		// Робимо паузу 1.5 секунди перед переходом далі
		setTimeout(() => {
			const nextQuestionIndex = currentQuestionIndex + 1;
			if (nextQuestionIndex < questionsData.length) {
				setCurrentQuestionIndex(nextQuestionIndex);
			} else {
				setShowResult(true);
			}

			// Скидаємо стани для наступного питання
			setSelectedAnswer(null);
			setIsChecking(false);
		}, 1500); // 1500 мілісекунд = 1.5 секунди
	};

	const restartQuiz = () => {
		setCurrentQuestionIndex(0);
		setScore(0);
		setShowResult(false);
		setSelectedAnswer(null);
		setIsChecking(false);
	};

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

	return (
		<div className="quiz-container">
			<div className="progress-bar">
				Питання {currentQuestionIndex + 1} з {questionsData.length}
			</div>

			<h2 className="question-text">{currentQuestion.question}</h2>

			<div className="options-container">
				{currentQuestion.options.map((option, index) => {
					// Логіка підсвічування: за замовчуванням клас звичайний
					let buttonClass = "option-button";

					// Якщо йде перевірка, додаємо класи
					if (isChecking) {
						if (option === currentQuestion.correctAnswer) {
							buttonClass += " correct"; // Правильна відповідь ЗАВЖДИ зелена
						} else if (option === selectedAnswer) {
							buttonClass += " incorrect"; // Якщо ти вибрав неправильну - вона червона
						}
					}

					return (
						<button
							key={index}
							className={buttonClass}
							onClick={() => handleAnswerClick(option)}
							disabled={isChecking} // Вимикаємо кнопки під час паузи, щоб не "наклікати" зайвого
						>
							{option}
						</button>
					);
				})}
			</div>
		</div>
	);
}

export default Quiz;
