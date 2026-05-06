import { Toaster } from "react-hot-toast";
import { useState, useEffect, useRef } from "react";
import Quiz from "./components/Quiz";
import "./App.css";

function App() {
	const [isDarkMode, setIsDarkMode] = useState(false);
	const quizRef = useRef();

	useEffect(() => {
		if (isDarkMode) {
			document.body.setAttribute("data-theme", "dark");
		} else {
			document.body.removeAttribute("data-theme");
		}
	}, [isDarkMode]);

	const toggleTheme = () => {
		setIsDarkMode(!isDarkMode);
	};

	const goHome = () => {
		if (quizRef.current) {
			quizRef.current.goHome();
		}
	};

	return (
		<div className="app-container">
			<Toaster position="top-center" reverseOrder={false} />
			<header className="app-header">
				<h1 onClick={goHome} style={{ cursor: "pointer" }} title="На головну">
					🏛️ БЕБ Тренажер
				</h1>
				<button className="theme-toggle" onClick={toggleTheme}>
					{isDarkMode ? "☀️ Світла" : "🌙 Темна"}
				</button>
			</header>
			<main>
				<Quiz ref={quizRef} />
			</main>
		</div>
	);
}

export default App;
