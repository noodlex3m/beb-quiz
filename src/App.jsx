import { useState, useEffect } from "react";
import Quiz from "./components/Quiz";
import "./App.css";

function App() {
	// Стан для теми: за замовчуванням false (світла)
	const [isDarkMode, setIsDarkMode] = useState(false);

	// Цей хук спрацьовує щоразу, коли змінюється isDarkMode
	useEffect(() => {
		if (isDarkMode) {
			document.body.setAttribute("data-theme", "dark");
		} else {
			document.body.removeAttribute("data-theme");
		}
	}, [isDarkMode]);

	// Функція перемикання
	const toggleTheme = () => {
		setIsDarkMode(!isDarkMode);
	};

	const goHome = () => {
		window.dispatchEvent(new Event("goHome"));
	};

	return (
		<div className="app-container">
			<header className="app-header">
				<h1
					onClick={goHome}
					style={{ cursor: "pointer" }}
					title="На головну"
				>
					🏛️ БЕБ Тренажер
				</h1>
				<button className="theme-toggle" onClick={toggleTheme}>
					{isDarkMode ? "☀️ Світла" : "🌙 Темна"}
				</button>
			</header>
			<main>
				<Quiz />
			</main>
		</div>
	);
}

export default App;
