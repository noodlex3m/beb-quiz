import { useState, useEffect } from "react";
import { CATEGORY_TARGETS } from "../data/categoriesConfig";
import StartScreen from "./screens/StartScreen";
import ResultScreen from "./screens/ResultScreen";
import QuestionCard from "./screens/QuestionCard";
import { storageService } from "../services/storageService";
import { firebaseService } from "../services/firebaseService";

// ТИМЧАСОВО РОЗКОМЕНТУЙ (або додай) ці два рядки:
// import questionsRaw from "../data/questions.json";
// const newQuestionsData = questionsRaw.filter((q) => q.question !== "");

function Quiz() {
	const [quizState, setQuizState] = useState("start"); // "start", "playing", "result"
	const [examQuestions, setExamQuestions] = useState([]);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [score, setScore] = useState(0);
	const [wrongAnswers, setWrongAnswers] = useState([]);
	const [history, setHistory] = useState(storageService.getHistory());

	// НОВІ СТАНИ ДЛЯ FIREBASE
	const [questionsData, setQuestionsData] = useState([]); // Тут тепер зберігатимемо питання
	const [isLoading, setIsLoading] = useState(true); // Стан завантаження

	// Завантажуємо питання при першому запуску додатку
	useEffect(() => {
		const loadQuestions = async () => {
			try {
				const data = await firebaseService.fetchQuestions();
				// Відфільтровуємо пусті питання (про всяк випадок, якщо вони є в базі)
				const validQuestions = data.filter(
					(q) => q.question && q.question.trim() !== "",
				);
				setQuestionsData(validQuestions);
			} catch (error) {
				console.error("Не вдалося завантажити питання:", error);
			} finally {
				setIsLoading(false);
			}
		};

		loadQuestions();
	}, []);

	// Стан під час гри
	const [selectedAnswer, setSelectedAnswer] = useState(null);
	const [isChecking, setIsChecking] = useState(false);
	const [shuffledOptions, setShuffledOptions] = useState([]);

	// ТИМЧАСОВО РОЗКОМЕНТУЙ цю функцію:
	// const handleUpload = async () => {
	// 	await firebaseService.uploadQuestions(newQuestionsData);
	// };

	const startQuiz = () => {
		// Обираємо 100 рандомних питань (або менше, якщо в базі ще немає 100)
		const shuffledAll = [...questionsData].sort(() => Math.random() - 0.5);
		const selected100 = shuffledAll.slice(0, 100);

		setExamQuestions(selected100);
		setCurrentQuestionIndex(0);
		setScore(0);
		setWrongAnswers([]);
		setSelectedAnswer(null);
		setIsChecking(false);
		setQuizState("playing");

		if (selected100.length > 0) {
			setShuffledOptions(
				[...selected100[0].options].sort(() => Math.random() - 0.5),
			);
		}
	};

	const currentQuestion = examQuestions[currentQuestionIndex];

	const handleAnswerClick = (option) => {
		if (isChecking) return;
		setSelectedAnswer(option);
		setIsChecking(true);

		if (option === currentQuestion.correctAnswer) {
			// Правильна відповідь
			setScore(score + 1);
		} else {
			// НЕПРАВИЛЬНА ВІДПОВІДЬ! Зберігаємо її для аналізу
			setWrongAnswers((prev) => [
				...prev,
				{
					question: currentQuestion.question,
					userAnswer: option, // що відповів користувач
					correctAnswer: currentQuestion.correctAnswer, // що було правильно
				},
			]);
		}
	};

	const finishQuiz = () => {
		const newResult = {
			date:
				new Date().toLocaleDateString("uk-UA") +
				" " +
				new Date().toLocaleTimeString("uk-UA", {
					hour: "2-digit",
					minute: "2-digit",
				}),
			score: score,
			total: examQuestions.length,
		};
		const updatedHistory = storageService.saveResult(newResult);

		setHistory(updatedHistory);
		setQuizState("result");
	};

	const handleNextQuestion = () => {
		const nextQuestionIndex = currentQuestionIndex + 1;
		if (nextQuestionIndex < examQuestions.length) {
			setCurrentQuestionIndex(nextQuestionIndex);
			setShuffledOptions(
				[...examQuestions[nextQuestionIndex].options].sort(
					() => Math.random() - 0.5,
				),
			);
			setSelectedAnswer(null);
			setIsChecking(false);
		} else {
			finishQuiz();
		}
	};

	// --- РЕНДЕР ЕКРАНУ ЗАВАНТАЖЕННЯ ---
	if (isLoading) {
		return (
			<div
				className="quiz-container"
				style={{ textAlign: "center", padding: "50px" }}
			>
				<h2>Завантаження бази питань... ⏳</h2>
			</div>
		);
	}

	// --- РЕНДЕР ЕКРАНУ СТАРТУ ---
	if (quizState === "start") {
		return (
			<>
				{/* <button
					onClick={handleUpload}
					style={{
						position: "absolute",
						top: 10,
						left: 10,
						background: "red",
						color: "white",
						padding: "10px",
						zIndex: 9999,
						borderRadius: "5px",
					}}
				>
					🚀 ЗАВАНТАЖИТИ В FIREBASE
				</button> */}
				<StartScreen
					questionsData={questionsData}
					onStart={startQuiz}
					history={history}
				/>
			</>
		);
	}

	if (quizState === "playing") {
		return (
			<QuestionCard
				currentQuestionIndex={currentQuestionIndex}
				totalQuestions={examQuestions.length}
				currentQuestion={examQuestions[currentQuestionIndex]}
				shuffledOptions={shuffledOptions}
				isChecking={isChecking}
				selectedAnswer={selectedAnswer}
				onAnswerClick={handleAnswerClick}
				onNextQuestion={handleNextQuestion}
			/>
		);
	}

	// --- РЕНДЕР ЕКРАНУ РЕЗУЛЬТАТУ ---
	if (quizState === "result") {
		return (
			<ResultScreen
				score={score}
				totalQuestions={examQuestions.length}
				wrongAnswers={wrongAnswers}
				onRestart={() => setQuizState("start")}
			/>
		);
	}

	return null;
}

export default Quiz;
