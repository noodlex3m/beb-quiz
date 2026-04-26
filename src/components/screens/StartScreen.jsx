import React, { useState } from "react";
import { createPortal } from "react-dom";
import { CATEGORY_TARGETS } from "../../data/categoriesConfig";

function StartScreen({
	questionsData,
	onStart,
	history,
	user,
	onLogin,
	onLogout,
}) {
	// Стан для керування видимістю модального вікна
	const [isModalOpen, setIsModalOpen] = useState(false);

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
							<div
								className="user-profile"
								style={{
									width: "100%",
									textAlign: "center",
									marginBottom: "15px",
								}}
							>
								<p style={{ margin: "0 0 10px 0" }}>
									Привіт, <strong>{user.displayName}</strong>! 👋
								</p>
								<button
									onClick={onLogout}
									style={{
										fontSize: "0.8rem",
										padding: "5px 10px",
										background: "transparent",
										border: "1px solid var(--border-color)",
										color: "var(--text-muted)",
										borderRadius: "5px",
										cursor: "pointer",
									}}
								>
									Вийти з акаунта
								</button>
							</div>

							<button className="start-btn" onClick={onStart}>
								Почати іспит (100 питань)
							</button>

							{history && history.length > 0 && (
								<button
									className="stats-btn"
									onClick={() => setIsModalOpen(true)}
								>
									📊 Моя статистика
								</button>
							)}
						</>
					) : (
						/* ЯКЩО КОРИСТУВАЧ НЕ АВТОРИЗОВАНИЙ */
						<div
							className="login-prompt"
							style={{ width: "100%", textAlign: "center" }}
						>
							<p style={{ marginBottom: "15px", color: "var(--text-muted)" }}>
								Щоб проходити тести та зберігати прогрес, будь ласка,
								авторизуйтесь.
							</p>
							<button
								className="start-btn"
								onClick={onLogin}
								style={{
									background: "#4285F4",
									border: "none",
									color: "white",
								}}
							>
								🛡️ Увійти через Google
							</button>
						</div>
					)}
				</div>
			</div>

			<div className="stats-section">
				<h3>Наповнення бази:</h3>
				<div className="categories-grid">
					{CATEGORY_TARGETS.map((cat, index) => {
						const currentCount = getCategoryCount(cat.title);
						const percentage = Math.round((currentCount / cat.expected) * 100);

						return (
							<div key={index} className="category-card">
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
								<div className="category-count">
									{currentCount} / {cat.expected}
								</div>
							</div>
						);
					})}
				</div>
			</div>

			{/* МОДАЛЬНЕ ВІКНО З ІСТОРІЄЮ */}
			{isModalOpen &&
				createPortal(
					<div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
						<div className="modal-content" onClick={(e) => e.stopPropagation()}>
							<div className="modal-header">
								<h3>Історія спроб</h3>
								<button
									className="close-modal"
									onClick={() => setIsModalOpen(false)}
								>
									&times;
								</button>
							</div>

							<ul className="history-list">
								{history.map((attempt, index) => {
									const percentage = Math.round(
										(attempt.score / attempt.total) * 100,
									);
									return (
										<li key={index} className="history-item">
											<span className="history-date">{attempt.date}</span>
											<span
												className={`history-score ${percentage >= 80 ? "passed-text" : "failed-text"}`}
											>
												{percentage}% ({attempt.score}/{attempt.total})
											</span>
										</li>
									);
								})}
							</ul>
						</div>
					</div>,
					document.body,
				)}
		</div>
	);
}

export default StartScreen;
