import React from "react";

function ResultScreen({ score, totalQuestions, wrongAnswers, onRestart }) {
	// Рахуємо відсоток успішності
	const percentage = Math.round((score / totalQuestions) * 100);
	const isPassed = percentage >= 80; // Наприклад, 80% — це прохідний бал

	return (
		<div className="result-screen">
			<h2>Результати іспиту</h2>

			<div className={`score-circle ${isPassed ? "passed" : "failed"}`}>
				<span className="score-percent">{percentage}%</span>
				<span className="score-text">
					{score} з {totalQuestions}
				</span>
			</div>

			<h3 style={{ textAlign: "center", marginBottom: "20px" }}>
				{isPassed
					? "🎉 Вітаємо! Ви склали іспит."
					: "😢 На жаль, іспит не складено. Треба ще повчитися."}
			</h3>

			{/* ОСЬ ТУТ МИ ВИКОРИСТОВУЄМО wrongAnswers */}
			{wrongAnswers.length > 0 && (
				<div className="mistakes-section">
					<h4>Ваші помилки для опрацювання:</h4>
					<ul className="mistakes-list" style={{ textAlign: "left" }}>
						{wrongAnswers.map((item, index) => (
							<li
								key={index}
								className="mistake-item"
								style={{
									marginBottom: "15px",
									padding: "10px",
									background: "rgba(255,0,0,0.05)",
									borderRadius: "8px",
								}}
							>
								<p style={{ margin: "0 0 5px 0" }}>
									<strong>Питання:</strong> {item.question}
								</p>
								<p style={{ margin: "0 0 5px 0" }}>
									<strong>Ваша відповідь:</strong>{" "}
									<span style={{ color: "#d32f2f" }}>{item.userAnswer}</span>
								</p>
								<p style={{ margin: "0" }}>
									<strong>Правильна відповідь:</strong>{" "}
									<span style={{ color: "#2e7d32" }}>{item.correctAnswer}</span>
								</p>
							</li>
						))}
					</ul>
				</div>
			)}

			<div style={{ textAlign: "center", marginTop: "30px" }}>
				<button className="start-btn" onClick={onRestart}>
					Повернутися на головну
				</button>
			</div>
		</div>
	);
}

export default ResultScreen;
