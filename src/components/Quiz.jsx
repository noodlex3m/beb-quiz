import { useState, useEffect } from "react";
import { CATEGORY_TARGETS } from "../data/categoriesConfig";
import StartScreen from "./screens/StartScreen";
import ResultScreen from "./screens/ResultScreen";
import QuestionCard from "./screens/QuestionCard";
import { storageService } from "../services/storageService";
import { firebaseService } from "../services/firebaseService";
import ProfileScreen from "./screens/ProfileScreen";

// імпорти для авторизації
import { auth } from "../firebase";
import {
	GoogleAuthProvider,
	signInWithPopup,
	signOut,
	onAuthStateChanged,
} from "firebase/auth";

function Quiz() {
	const [quizState, setQuizState] = useState("start"); // "start", "playing", "result"
	const [examQuestions, setExamQuestions] = useState([]);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [score, setScore] = useState(0);
	const [wrongAnswers, setWrongAnswers] = useState([]);
	const [history, setHistory] = useState([]);

	// НОВІ СТАНИ ДЛЯ FIREBASE
	const [questionsData, setQuestionsData] = useState([]); // Тут тепер зберігатимемо питання
	const [isLoading, setIsLoading] = useState(true); // Стан завантаження
	const [user, setUser] = useState(null); // Авторизація

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

		const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
			setUser(currentUser);

			// Завантажуємо історію з Firebase, якщо користувач авторизований
			if (currentUser) {
				const userHistory = await firebaseService.getUserHistory(
					currentUser.uid,
				);
				setHistory(userHistory);
			} else {
				setHistory([]); // Очищаємо історію, якщо користувач вийшов
			}
		});
		return () => unsubscribe(); // Очищення підписки
	}, []);

	// ФУНКЦІЯ: Вхід через Google
	const handleLogin = async () => {
		const provider = new GoogleAuthProvider();
		try {
			await signInWithPopup(auth, provider);
		} catch (error) {
			console.error("Помилка під час входу:", error);
			alert("Не вдалося увійти. Спробуйте ще раз.");
		}
	};

	// ФУНКЦІЯ: Вихід
	const handleLogout = async () => {
		try {
			await signOut(auth);
		} catch (error) {
			console.error("Помилка під час виходу:", error);
		}
	};

	// Стан під час гри
	const [selectedAnswer, setSelectedAnswer] = useState(null);
	const [isChecking, setIsChecking] = useState(false);
	const [shuffledOptions, setShuffledOptions] = useState([]);

	const startQuiz = () => {
		// Обираємо 100 рандомних питань (або менше, якщо в базі ще немає 100)
		const shuffledAll = [...questionsData].sort(() => Math.random() - 0.5);
		const selected100 = shuffledAll.slice(0, 5);

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
					id: currentQuestion.id, // номер питання
					category: currentQuestion.category, // категорія
				},
			]);
		}
	};

	const finishQuiz = async () => {
		const percentage = Math.round((score / examQuestions.length) * 100);
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
			percentage: percentage,
			wrongAnswers: wrongAnswers,
		};

		// Якщо користувач увійшов, зберігаємо у хмарі
		if (user) {
			await firebaseService.saveUserResult(user.uid, newResult);
			// Оновлюємо історію, щоб вона одразу відображалася
			const updatedHistory = await firebaseService.getUserHistory(user.uid);
			setHistory(updatedHistory);
		} else {
			// Якщо не увійшов - зберігаємо локально і перевіряємо наявність історії
			const updatedHistory = storageService.saveResult(newResult);
			setHistory(updatedHistory);
		}

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
				<StartScreen
					questionsData={questionsData}
					onStart={startQuiz}
					user={user}
					onLogin={handleLogin}
					onLogout={handleLogout}
					onGoToProfile={() => setQuizState("profile")}
				/>
			</>
		);
	}

	if (quizState === "profile") {
		return (
			<ProfileScreen
				user={user}
				history={history}
				onBack={() => setQuizState("start")}
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
