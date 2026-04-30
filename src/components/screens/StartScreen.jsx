import React from "react";
import { CATEGORY_TARGETS } from "../../data/categoriesConfig";

function StartScreen({
	questionsData,
	onStart,
	onStartMistakes,
	user,
	onLogin,
	onLogout,
	onGoToProfile,
	history,
	onGoToLeaderboard,
}) {
	// Допоміжна функція для підрахунку питань у категорії
	const getCategoryCount = (categoryName) => {
		return questionsData.filter((q) => q.category === categoryName).length;
	};

	return (
		<div className="start-screen">
			<div className="hero-section">
				<h2 className="title">Готові перевірити свої знання?</h2>
				<p className="subtitle">
					У базі зараз <strong>{questionsData.length}</strong> з 884 питань.
				</p>

				<div className="start-actions">
					{/* ЯКЩО КОРИСТУВАЧ АВТОРИЗОВАНИЙ */}
					{user ? (
						<>
							<div className="user-profile">
								<p className="greeting-text">
									Привіт, <strong>{user.displayName}</strong>! 👋
								</p>
								<button className="logout-btn" onClick={onLogout}>
									Вийти з акаунта
								</button>
							</div>

							<button className="start-btn" onClick={onStart}>
								Почати іспит (100 питань)
							</button>

							{history &&
								history.some(
									(h) => h.wrongAnswers && h.wrongAnswers.length > 0,
								) && (
									<button
										className="start-btn mistakes-btn"
										onClick={onStartMistakes}
									>
										🎯 Робота над помилками
									</button>
								)}

							{history && history.length > 0 && (
								<button className="stats-btn" onClick={() => onGoToProfile()}>
									👤 Мій кабінет
								</button>
							)}
						</>
					) : (
						/* ЯКЩО КОРИСТУВАЧ НЕ АВТОРИЗОВАНИЙ */
						<div className="login-prompt">
							<p className="login-hint">
								Щоб проходити тести та зберігати прогрес, будь ласка,
								авторизуйтесь.
							</p>
							<button className="start-btn google-login-btn" onClick={onLogin}>
								🛡️ Увійти через Google
							</button>
						</div>
					)}

					{/* РЕЙТИНГ НАЙКРАЩИХ (доступно всім) */}
					<button className="stats-btn leaderboard-btn" onClick={onGoToLeaderboard} style={{ marginTop: '10px', background: 'var(--card-bg)' }}>
						🏆 Рейтинг найкращих
					</button>
				</div>
			</div>

			<div className="stats-section">
				<h3>Наповнення бази:</h3>
				<div className="categories-grid">
					{CATEGORY_TARGETS.map((cat, index) => {
						const currentCount = getCategoryCount(cat.title);
						const percentage = Math.round((currentCount / cat.expected) * 100);

						return (
							<div
								key={index}
								className={`category-card ${user ? "clickable" : ""}`}
								onClick={() => {
									if (user) {
										onStart(cat.title);
									} else {
										alert(
											"Будь ласка, авторизуйтесь, щоб проходити тестування.",
										);
									}
								}}
								title={
									user
										? `Почати тест по категорії: ${cat.title}`
										: "Авторизуйтесь, щоб почати тест"
								}
							>
								<div className="category-header">
									<span className="category-title">{cat.title}</span>
									<span className="category-progress">{percentage}%</span>
								</div>
								<div className="progress-bar-bg">
									<div
										className="progress-bar-fill"
										style={{ width: `${percentage}%` }}
									></div>
								</div>
								<div
									className="category-count"
									style={{ display: "flex", justifyContent: "space-between" }}
								>
									<span
										style={{
											color: "var(--text-muted)",
											fontWeight: "normal",
											fontSize: "0.8rem",
										}}
									>
										{user ? "▶ Клікніть для іспиту" : ""}
									</span>
									<span>
										{currentCount} / {cat.expected}
									</span>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}

export default StartScreen;
