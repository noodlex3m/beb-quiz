import React, { useMemo } from "react";

function ProfileScreen({ user, history, onBack }) {
	// 1. Базова статистика
	const totalTests = history.length;
	const averageScore =
		totalTests > 0
			? Math.round(
					history.reduce((acc, curr) => acc + curr.percentage, 0) / totalTests,
				)
			: 0;

	// 2. НОВА ЛОГІКА: Підрахунок слабких категорій
	const weakestCategories = useMemo(() => {
		if (!history || history.length === 0) return [];

		const categoryErrors = {};

		// Проходимося по всіх тестах в історії
		history.forEach((attempt) => {
			// Якщо в тесті були помилки (wrongAnswers існує і це масив)
			if (attempt.wrongAnswers && Array.isArray(attempt.wrongAnswers)) {
				attempt.wrongAnswers.forEach((mistake) => {
					const cat = mistake.category || "Інше";
					if (!categoryErrors[cat]) {
						categoryErrors[cat] = 0;
					}
					categoryErrors[cat] += 1; // Додаємо +1 помилку цій категорії
				});
			}
		});

		// Перетворюємо об'єкт в масив, сортуємо за кількістю помилок (від найбільшого) і беремо топ-3
		return Object.entries(categoryErrors)
			.map(([name, count]) => ({ name, count }))
			.sort((a, b) => b.count - a.count)
			.slice(0, 3);
	}, [history]);

	return (
		<div className="profile-screen quiz-container">
			<div className="profile-header">
				<h2>👤 Особистий кабінет</h2>
				<p className="profile-name">
					Користувач: <strong>{user?.displayName}</strong>
				</p>
				<button className="start-btn back-btn" onClick={onBack}>
					⬅ Повернутися на головну
				</button>
			</div>

			<div className="stats-cards">
				<div className="stat-card glass-panel">
					<h3>{totalTests}</h3>
					<p className="stat-label">Пройдено тестів</p>
				</div>
				<div className="stat-card glass-panel">
					<h3>{averageScore}%</h3>
					<p className="stat-label">Середня успішність</p>
				</div>
			</div>

			{/* НОВИЙ БЛОК: Слабкі категорії */}
			{weakestCategories.length > 0 && (
				<div className="weak-categories-section">
					<h3 className="weak-categories-title">⚠️ Топ тем для повторення:</h3>
					<ul className="weak-categories-list">
						{weakestCategories.map((cat, idx) => (
							<li key={idx} className="weak-category-item">
								<span className="weak-category-name">{cat.name}</span>
								<strong className="weak-category-count">{cat.count} помилок</strong>
							</li>
						))}
					</ul>
				</div>
			)}

			<div className="history-section">
				<h3 className="history-title">Історія останніх спроб</h3>
				{totalTests === 0 ? (
					<p className="empty-history">Ви ще не проходили тестів.</p>
				) : (
					<ul className="history-list">
						{history.map((attempt, index) => (
							<li key={index} className="history-item">
								<span className="history-date">{attempt.date}</span>
								<span
									className={`history-score ${attempt.percentage >= 80 ? "passed-text" : "failed-text"}`}
								>
									{attempt.percentage}% ({attempt.score}/{attempt.total})
								</span>
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
}

export default ProfileScreen;
