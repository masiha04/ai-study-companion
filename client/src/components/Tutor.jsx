import { useState } from "react";

function Tutor({ project, onBack }) {
    const [question, setQuestion] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const askTutor = async (event) => {
        event.preventDefault();

        if (!question.trim() || loading) {
            return;
        }

        const currentQuestion = question.trim();

        setLoading(true);
        setError("");

        try {
            const response = await fetch(
                `http://localhost:5000/api/tutor/${project._id}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization:
                            `Bearer ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify({
                        question: currentQuestion
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Could not get answer from AI Tutor"
                );
            }

            setMessages((previous) => [
                ...previous,
                {
                    question: currentQuestion,
                    answer: data.answer,
                    sources: data.sources || []
                }
            ]);

            setQuestion("");
        } catch (error) {
            console.error("Tutor error:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container tutor-page">

            {/* Header */}
            <div className="page-header">

                <button
                    className="back-button"
                    onClick={onBack}
                >
                    ← Back to Dashboard
                </button>

                <h1>AI Tutor</h1>

                <p>
                    Ask questions about your learning material.
                </p>

                <span className="project-badge">
                    {project.name}
                </span>

            </div>

            {/* Tutor */}
            <div className="tutor-container">

                <div className="tutor-chat">

                    {/* Welcome */}
                    {messages.length === 0 && (
                        <div className="tutor-welcome">

                            <div className="tutor-icon">
                                🤖
                            </div>

                            <h2>
                                Ask your AI Tutor
                            </h2>

                            <p>
                                Your Tutor answers using the
                                learning material uploaded to
                                this project.
                            </p>

                            <div className="tutor-examples">

                                <button
                                    type="button"
                                    onClick={() => {
                                        setQuestion(
                                            "What is the MERN stack?"
                                        );
                                        setError("");
                                    }}
                                >
                                    What is the MERN stack?
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setQuestion(
                                            "Explain the important concepts in this material."
                                        );
                                        setError("");
                                    }}
                                >
                                    Explain important concepts
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setQuestion(
                                            "What should I focus on learning?"
                                        );
                                        setError("");
                                    }}
                                >
                                    What should I focus on?
                                </button>

                            </div>

                        </div>
                    )}

                    {/* Conversations */}
                    {messages.map((message, index) => (
                        <div
                            className="tutor-conversation"
                            key={index}
                        >

                            {/* Question */}
                            <div className="tutor-question">

                                <div className="message-avatar">
                                    You
                                </div>

                                <div>
                                    <strong>
                                        You
                                    </strong>

                                    <p>
                                        {message.question}
                                    </p>
                                </div>

                            </div>

                            {/* Answer */}
                            <div className="tutor-answer">

                                <div className="message-avatar tutor-avatar">
                                    AI
                                </div>

                                <div className="tutor-answer-content">

                                    <strong>
                                        AI Tutor
                                    </strong>

                                    <p>
                                        {message.answer}
                                    </p>

                                    {/* Sources */}
                                    {message.sources.length > 0 && (
                                        <div className="tutor-sources">

                                            <h4>
                                                Learning Sources
                                            </h4>

                                            {message.sources.map(
                                                (source, sourceIndex) => (
                                                    <div
                                                        className="tutor-source"
                                                        key={sourceIndex}
                                                    >

                                                        <span>
                                                            Source{" "}
                                                            {sourceIndex + 1}
                                                        </span>

                                                        <span>
                                                            Page{" "}
                                                            {source.pageNumber ??
                                                                "Unknown"}
                                                        </span>

                                                        <span>
                                                            Relevance{" "}
                                                            {source.similarity}
                                                        </span>

                                                    </div>
                                                )
                                            )}

                                        </div>
                                    )}

                                </div>

                            </div>

                        </div>
                    ))}

                    {/* Loading */}
                    {loading && (
                        <div className="tutor-loading">

                            <div className="message-avatar tutor-avatar">
                                AI
                            </div>

                            <div>
                                <strong>
                                    AI Tutor
                                </strong>

                                <p>
                                    Thinking from your learning
                                    material...
                                </p>
                            </div>

                        </div>
                    )}

                </div>

                {/* Error */}
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {/* Input */}
                <form
                    className="tutor-input-area"
                    onSubmit={askTutor}
                >

                    <textarea
                        value={question}
                        onChange={(event) =>
                            setQuestion(event.target.value)
                        }
                        placeholder="Ask something about your learning material..."
                        rows="3"
                        disabled={loading}
                    />

                    <button
                        type="submit"
                        className="primary-button"
                        disabled={
                            loading ||
                            !question.trim()
                        }
                    >
                        {loading
                            ? "Thinking..."
                            : "Ask Tutor"}
                    </button>

                </form>

            </div>

        </div>
    );
}

export default Tutor;