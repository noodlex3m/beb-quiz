import Quiz from "./components/Quiz";
import "./App.css";

function App() {
	return (
		<div className="app-container">
			<header className="app-header">
				<h1>🏛️ БЕБ Тренажер</h1>
			</header>
			<main>
				<Quiz />
			</main>
		</div>
	);
}

export default App;
