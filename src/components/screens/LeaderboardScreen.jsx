import React, { useState, useEffect } from "react";
import { firebaseService } from "../../services/firebaseService";

function LeaderboardScreen({ onBack }) {
	const [leaders, setLeaders] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchLeaders = async () => {
			const data = await firebaseService.getTopResults();
			setLeaders(data);
			setLoading(false);
		};
		fetchLeaders();
	}, []);

	// Функція для красивого відображення місця (медалі для топ-3)
	const getRankIcon = (index) => {
		if (index === 0) return "🥇";
		if (index === 1) return "🥈";
		if (index === 2) return "🥉";
		return `${index + 1}.`;
	};

	return (
		<div className="quiz-container leaderboard-screen">
			<div className="profile-header leaderboard-header">
				<h2>🏆 Топ-10 Кандидатів</h2>
				<p className="leaderboard-subtitle">
					Найкращі результати за весь час
				</p>
				<button
					className="start-btn back-btn leaderboard-back"
					onClick={onBack}
				>
					⬅ Повернутися на головну
				</button>
			</div>

			{loading ? (
				<div className="leaderboard-empty">
					Завантаження рейтингу... ⏳
				</div>
			) : leaders.length === 0 ? (
				<div className="leaderboard-empty">
					Ще немає жодного результату. Станьте першим!
				</div>
			) : (
				<div className="table-responsive">
					<table className="leaderboard-table">
						<thead>
							<tr>
								<th className="col-rank">Місце</th>
								<th className="col-name">Ім'я</th>
								<th className="col-score">Результат</th>
								<th className="col-date">Дата</th>
							</tr>
						</thead>
						<tbody>
							{leaders.map((leader, index) => (
								<tr key={leader.id}>
									<td className="cell-rank">
										{getRankIcon(index)}
									</td>
									<td className="cell-name">
										{leader.userName}
									</td>
									<td className="cell-score">
										<span
											className={
												leader.percentage >= 80 ? "passed-text" : "failed-text"
											}
											style={{ fontWeight: "bold" }}
										>
											{leader.percentage}%
										</span>
										<div className="score-details">
											{leader.score}/{leader.total}
										</div>
									</td>
									<td className="cell-date">
										{leader.date.split(",")[0]}{" "}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}

export default LeaderboardScreen;
