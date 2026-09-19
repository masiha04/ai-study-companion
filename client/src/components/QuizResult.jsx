function QuizResult({
    assessment,
    onBackToDashboard,
    onTakeAnotherQuiz
}) {
    const percentage = Math.round(
        assessment?.percentage || 0
    );

    return (
        <div className="dashboard-page">
            <div className="dashboard-header">
                <h1>🎉 Quiz Result</h1>

                <p>
                    Your assessment has been completed.
                </p>
            </div>

            <section className="dashboard-section">
                <div className="quiz-result-card">
                    <div className="quiz-score-circle">
                        <strong>{percentage}%</strong>
                        <span>Score</span>
                    </div>

                    <h2>
                        {percentage >= 75
                            ? "Great work!"
                            : percentage >= 50
                                ? "Keep improving!"
                                : "More practice needed"}
                    </h2>

                    <p>
                        Total Score:{" "}
                        <strong>
                            {assessment.totalScore}
                        </strong>
                    </p>

                    <p>
                        Your concept mastery has been
                        updated based on this assessment.
                    </p>
                </div>
            </section>

            <section className="dashboard-section">
                <h2>Question Results</h2>

                <div className="quiz-results-list">
                    {assessment.answers?.map(
                        (answer, index) => (
                            <div
                                className="quiz-result-question"
                                key={
                                    answer.questionId ||
                                    index
                                }
                            >
                                <div>
                                    <strong>
                                        Question {index + 1}
                                    </strong>

                                    <span
                                        className={
                                            answer.isCorrect
                                                ? "result-correct"
                                                : "result-incorrect"
                                        }
                                    >
                                        {answer.isCorrect
                                            ? "Correct"
                                            : "Needs Review"}
                                    </span>
                                </div>

                                <p>
                                    Score:{" "}
                                    {answer.score}/100
                                </p>

                                <p>
                                    {answer.feedback}
                                </p>

                                <p>
                                    <strong>
                                        Concept:
                                    </strong>{" "}
                                    {answer.concept}
                                </p>
                            </div>
                        )
                    )}
                </div>
            </section>

            <div className="quiz-result-actions">
                <button
                    className="back-button"
                    onClick={onBackToDashboard}
                >
                    ← Back to Dashboard
                </button>

                <button
                    className="primary-button"
                    onClick={onTakeAnotherQuiz}
                >
                    Take Another Quiz
                </button>
            </div>
        </div>
    );
}

export default QuizResult;