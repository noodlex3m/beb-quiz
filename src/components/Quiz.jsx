import { useState } from "react";
import questionsData from "../data/questions.json";
import { CATEGORY_TARGETS } from "../data/categoriesConfig";

function Quiz() {
	const [quizState, setQuizState] = useState("start"); // "start", "playing", "result"
	const [examQuestions, setExamQuestions] = useState([]);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [score, setScore] = useState(0);
	const [history, setHistory] = useState(() => {
		try {
			const savedHistory = localStorage.getItem("beb_quiz_results");
			return savedHistory ? JSON.parse(savedHistory) : [];
		} catch {
			return [];
		}
	});

	// Стан під час гри
	const [selectedAnswer, setSelectedAnswer] = useState(null);
	const [isChecking, setIsChecking] = useState(false);
	const [shuffledOptions, setShuffledOptions] = useState([]);

	const startQuiz = () => {
		// Обираємо 100 рандомних питань (або менше, якщо в базі ще немає 100)
		const shuffledAll = [...questionsData].sort(() => Math.random() - 0.5);
		const selected100 = shuffledAll.slice(0, 100);
		
		setExamQuestions(selected100);
		setCurrentQuestionIndex(0);
		setScore(0);
		setSelectedAnswer(null);
		setIsChecking(false);
		setQuizState("playing");

		if (selected100.length > 0) {
			setShuffledOptions([...selected100[0].options].sort(() => Math.random() - 0.5));
		}
	};

	const currentQuestion = examQuestions[currentQuestionIndex];

	const handleAnswerClick = (option) => {
		if (isChecking) return;

		setSelectedAnswer(option);
		setIsChecking(true);

		if (option === currentQuestion.correctAnswer) {
			setScore(score + 1);
		}
	};

	const finishQuiz = () => {
		const newResult = {
			date: new Date().toLocaleDateString("uk-UA") + " " + new Date().toLocaleTimeString("uk-UA", {hour: '2-digit', minute:'2-digit'}),
			score: score,
			total: examQuestions.length
		};
		// Зберігаємо останніх 8 спроб
		const updatedHistory = [newResult, ...history].slice(0, 8); 
		localStorage.setItem("beb_quiz_results", JSON.stringify(updatedHistory));
		setHistory(updatedHistory);
		setQuizState("result");
	};

	const handleNextQuestion = () => {
		const nextQuestionIndex = currentQuestionIndex + 1;
		if (nextQuestionIndex < examQuestions.length) {
			setCurrentQuestionIndex(nextQuestionIndex);
			setShuffledOptions([...examQuestions[nextQuestionIndex].options].sort(() => Math.random() - 0.5));
			setSelectedAnswer(null);
			setIsChecking(false);
		} else {
			finishQuiz();
		}
	};

	// --- РЕНДЕР ЕКРАНУ СТАРТУ ---
	if (quizState === "start") {
		const totalAvailable = questionsData.length;
		const totalExpected = 884;
		const progressPercent = Math.round((totalAvailable / totalExpected) * 100);

		return (
			<div className="start-screen">
				<h2>Наповненість бази питань</h2>
				
				<div className="progress-container">
					<div className="progress-bar-bg">
						<div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
					</div>
					<p className="progress-text">Зібрано {totalAvailable} із {totalExpected} ({progressPercent}%)</p>
				</div>

				<div className="category-stats">
					{CATEGORY_TARGETS.map((cat, idx) => {
						const count = questionsData.filter(q => q.category === cat.title).length;
						return (
							<div key={idx} className="stat-row">
								<span className="stat-title">{cat.title}</span>
								<span className="stat-count">{count} / {cat.expected}</span>
							</div>
						);
					})}
				</div>

				<button className="start-btn" onClick={startQuiz} disabled={totalAvailable === 0}>
					Почати симуляцію іспиту (до 100 питань)
				</button>
			</div>
		);
	}

	// --- РЕНДЕР ЕКРАНУ РЕЗУЛЬТАТУ ---
	if (quizState === "result") {
		const percentage = Math.round((score / examQuestions.length) * 100);
		const isPassed = percentage >= 80;

		return (
			<div className="result-screen">
				<h2>Тестування завершено!</h2>
				
				<div className={`score-circle ${isPassed ? "passed" : "failed"}`}>
					<span className="score-percent">{percentage}%</span>
					<span className="score-text">{score} з {examQuestions.length}</span>
				</div>

				<h3 className={`status-msg ${isPassed ? "passed-text" : "failed-text"}`}>
					{isPassed ? "✅ Складено успішно!" : "❌ Не здано. Спробуй ще раз!"}
				</h3>

				<button className="restart-btn" onClick={() => setQuizState("start")}>
					Головне меню
				</button>

				{history.length > 0 && (
					<div className="history-section">
						<h3>Останні 8 спроб:</h3>
						<ul className="history-list">
							{history.map((item, idx) => (
								<li key={idx}>
									<span className="history-date">{item.date}</span>
									<strong className="history-score">{item.score} / {item.total} ({Math.round((item.score / item.total) * 100)}%)</strong>
								</li>
							))}
						</ul>
					</div>
				)}
			</div>
		);
	}

	// --- РЕНДЕР ЕКРАНУ ПІД ЧАС ТЕСТУ ---
	return (
		<div className="quiz-container">
			<div className="progress-bar">
				Питання {currentQuestionIndex + 1} з {examQuestions.length}
			</div>

			<div className="question-category">{currentQuestion.category}</div>

			<h2 className="question-text">{currentQuestion.question}</h2>

			<div className="options-container">
				{shuffledOptions.map((option, index) => {
					let buttonClass = "option-button";

					if (isChecking) {
						if (option === currentQuestion.correctAnswer) {
							buttonClass += " correct";
						} else if (option === selectedAnswer) {
							buttonClass += " incorrect";
						}
					}

					return (
						<button
							key={index}
							className={buttonClass}
							onClick={() => handleAnswerClick(option)}
							disabled={isChecking}
						>
							{option}
						</button>
					);
				})}
			</div>

			{isChecking && currentQuestion.explanation && (
				<div className="explanation-box">
					<div className="explanation-content">
						<h3>ℹ️ Пояснення:</h3>
						<p>{currentQuestion.explanation}</p>
					</div>
					<button className="next-btn" onClick={handleNextQuestion}>
						Наступне питання ➔
					</button>
				</div>
			)}
			{isChecking && !currentQuestion.explanation && (
				<div className="explanation-box">
					<button className="next-btn" onClick={handleNextQuestion}>
						Наступне питання ➔
					</button>
				</div>
			)}
		</div>
	);
}

export default Quiz;
