import React from "react";

function QuestionCard({
	currentQuestionIndex,
	totalQuestions,
	currentQuestion,
	shuffledOptions,
	isChecking,
	selectedAnswer,
	onAnswerClick,
	onNextQuestion,
}) {
	if (!currentQuestion) return <div>Завантаження...</div>;

	return (
		<div className="quiz-container">
			<div className="progress-bar">
				Питання {currentQuestionIndex + 1} з {totalQuestions}
			</div>

			<div className="question-category">{currentQuestion.category}</div>

			<h2 className="question-text">{currentQuestion.question}</h2>

			<div className="options-container">
				{shuffledOptions.map((option, index) => {
					let buttonClass = "option-button";

					if (isChecking) {
						if (option === currentQuestion.correctAnswer) {
							buttonClass += " correct";
						} else if (option === selectedAnswer) {
							buttonClass += " incorrect";
						}
					}

					return (
						<button
							key={index}
							className={buttonClass}
							onClick={() => onAnswerClick(option)}
							disabled={isChecking}
						>
							{option}
						</button>
					);
				})}
			</div>

			{isChecking && currentQuestion.explanation && (
				<div className="explanation-box">
					<div className="explanation-content">
						<h3>ℹ️ Пояснення:</h3>
						<p>{currentQuestion.explanation}</p>
					</div>
					<button className="next-btn" onClick={onNextQuestion}>
						Наступне питання ➔
					</button>
				</div>
			)}

			{isChecking && !currentQuestion.explanation && (
				<div className="explanation-box">
					<button className="next-btn" onClick={onNextQuestion}>
						Наступне питання ➔
					</button>
				</div>
			)}
		</div>
	);
}

export default QuestionCard;
