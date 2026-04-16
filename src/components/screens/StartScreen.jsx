import React from "react";
import { CATEGORY_TARGETS } from "../../data/categoriesConfig";

function StartScreen({ questionsData, onStart }) {
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

				<button className="start-btn" onClick={onStart}>
					Почати іспит (100 питань)
				</button>
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
		</div>
	);
}

export default StartScreen;
