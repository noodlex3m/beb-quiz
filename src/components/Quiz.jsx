import { useState } from "react";
import questionsRaw from "../data/questions.json";
import { CATEGORY_TARGETS } from "../data/categoriesConfig";
import StartScreen from "./screens/StartScreen";
import ResultScreen from "./screens/ResultScreen";
import QuestionCard from "./screens/QuestionCard";

const questionsData = questionsRaw.filter((q) => q.question !== "");

function Quiz() {
	const [quizState, setQuizState] = useState("start"); // "start", "playing", "result"
	const [examQuestions, setExamQuestions] = useState([]);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [score, setScore] = useState(0);
	const [wrongAnswers, setWrongAnswers] = useState([]);
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

	// --- РЕНДЕР ЕКРАНУ СТАРТУ ---
	if (quizState === "start") {
		return (
			<StartScreen
				questionsData={questionsData}
				onStart={startQuiz}
				history={history}
			/>
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
