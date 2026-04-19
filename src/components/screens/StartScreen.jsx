import React, { useState } from "react";
import { CATEGORY_TARGETS } from "../../data/categoriesConfig";

function StartScreen({ questionsData, onStart, history }) {
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
					<button className="start-btn" onClick={onStart}>
						Почати іспит (100 питань)
					</button>

					{/* Кнопка відкриття статистики (показуємо, тільки якщо є історія) */}
					{history && history.length > 0 && (
						<button className="stats-btn" onClick={() => setIsModalOpen(true)}>
							📊 Моя статистика
						</button>
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
			{isModalOpen && (
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
								const percentage = Math.round((attempt.score / attempt.total) * 100);
								return (
									<li key={index} className="history-item">
										<span className="history-date">
											{attempt.date}
										</span>
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
				</div>
			)}
		</div>
	);
}

export default StartScreen;
