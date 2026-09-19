import { useState } from "react";

function Quiz({ project, onBack, onResult }) {
    const [quiz, setQuiz] = useState(null);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const generateQuiz = async () => {
        setLoading(true);
        setError("");
        setAnswers({});

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:5000/api/quizzes/generate/${project._id}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to generate quiz"
                );
            }

            setQuiz(data.quiz);
        } catch (error) {
            console.error("Quiz generation error:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerChange = (questionId, answer) => {
        setAnswers((currentAnswers) => ({
            ...currentAnswers,
            [questionId]: answer
        }));
    };

    const submitQuiz = async () => {
        if (!quiz) {
            return;
        }

        const unanswered = quiz.questions.some(
            (question) =>
                !answers[question._id]?.trim()
        );

        if (unanswered) {
            setError(
                "Please answer all 5 questions before submitting."
            );
            return;
        }

        setSubmitting(true);
        setError("");

        try {
            const token = localStorage.getItem("token");

            const formattedAnswers = quiz.questions.map(
                (question) => ({
                    questionId: question._id,
                    answer: answers[question._id] || ""
                })
            );

            const response = await fetch(
                `http://localhost:5000/api/assessments/submit/${quiz._id}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        answers: formattedAnswers
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to submit quiz"
                );
            }

            onResult(data.assessment);
        } catch (error) {
            console.error("Quiz submission error:", error);
            setError(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="dashboard-page">
            <div className="dashboard-header">
                <button
                    className="back-button"
                    onClick={onBack}
                >
                    ← Back to Dashboard
                </button>

                <h1>📝 Adaptive Quiz</h1>

                <p>
                    Test your understanding of{" "}
                    <strong>{project.name}</strong>.
                </p>
            </div>

            {error && (
                <div className="dashboard-error">
                    {error}
                </div>
            )}

            {!quiz && (
                <section className="dashboard-section">
                    <div className="quiz-start-card">
                        <h2>Ready to test yourself?</h2>

                        <p>
                            The AI will generate 5 questions
                            from your uploaded learning
                            material.
                        </p>

                        <ul>
                            <li>4 multiple-choice questions</li>
                            <li>1 open-ended question</li>
                            <li>Questions are grounded in your PDF</li>
                            <li>Your score updates concept mastery</li>
                        </ul>

                        <button
                            className="primary-button"
                            onClick={generateQuiz}
                            disabled={loading}
                        >
                            {loading
                                ? "Generating Quiz..."
                                : "Generate Quiz"}
                        </button>
                    </div>
                </section>
            )}

            {quiz && (
                <section className="dashboard-section">
                    <div className="quiz-header-card">
                        <h2>Quiz</h2>
                        <p>
                            Answer all 5 questions and
                            submit your assessment.
                        </p>
                    </div>

                    <div className="quiz-list">
                        {quiz.questions.map(
                            (question, index) => (
                                <div
                                    className="quiz-question-card"
                                    key={question._id}
                                >
                                    <div className="quiz-question-top">
                                        <span>
                                            Question{" "}
                                            {index + 1}
                                        </span>

                                        <span>
                                            {question.difficulty}
                                        </span>
                                    </div>

                                    <h3>
                                        {question.question}
                                    </h3>

                                    <p className="quiz-concept">
                                        Concept:{" "}
                                        {question.concept}
                                    </p>

                                    {question.type ===
                                    "mcq" ? (
                                        <div className="quiz-options">
                                            {question.options.map(
                                                (
                                                    option,
                                                    optionIndex
                                                ) => (
                                                    <label
                                                        className={`quiz-option ${
                                                            answers[
                                                                question
                                                                    ._id
                                                            ] ===
                                                            option
                                                                ? "selected"
                                                                : ""
                                                        }`}
                                                        key={
                                                            optionIndex
                                                        }
                                                    >
                                                        <input
                                                            type="radio"
                                                            name={`question-${question._id}`}
                                                            value={
                                                                option
                                                            }
                                                            checked={
                                                                answers[
                                                                    question
                                                                        ._id
                                                                ] ===
                                                                option
                                                            }
                                                            onChange={() =>
                                                                handleAnswerChange(
                                                                    question._id,
                                                                    option
                                                                )
                                                            }
                                                        />

                                                        <span>
                                                            {
                                                                option
                                                            }
                                                        </span>
                                                    </label>
                                                )
                                            )}
                                        </div>
                                    ) : (
                                        <textarea
                                            className="quiz-text-answer"
                                            placeholder="Write your answer here..."
                                            value={
                                                answers[
                                                    question
                                                        ._id
                                                ] || ""
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                handleAnswerChange(
                                                    question._id,
                                                    event.target
                                                        .value
                                                )
                                            }
                                            rows={6}
                                        />
                                    )}
                                </div>
                            )
                        )}
                    </div>

                    <div className="quiz-submit-area">
                        <button
                            className="primary-button"
                            onClick={submitQuiz}
                            disabled={submitting}
                        >
                            {submitting
                                ? "Evaluating..."
                                : "Submit Quiz"}
                        </button>
                    </div>
                </section>
            )}
        </div>
    );
}

export default Quiz;