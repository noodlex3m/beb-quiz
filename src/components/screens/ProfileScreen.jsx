import React from "react";

function ProfileScreen({ user, history, onBack }) {
	// Підрахунок статистики
	const totalTests = history.length;
	const averageScore =
		totalTests > 0
			? Math.round(
					history.reduce((acc, curr) => acc + curr.percentage, 0) / totalTests,
				)
			: 0;

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
