import { useEffect, useState } from "react";

function Mastery({ project, onBack }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadMastery = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `http://localhost:5000/api/mastery/${project._id}`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${localStorage.getItem("token")}`
                        }
                    }
                );

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(
                        result.message ||
                        "Could not load mastery"
                    );
                }

                setData(result);
            } catch (error) {
                console.error(
                    "Mastery error:",
                    error
                );

                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        loadMastery();
    }, [project._id]);

    if (loading) {
        return (
            <div className="page-container">
                <button
                    className="back-button"
                    onClick={onBack}
                >
                    ← Back to Dashboard
                </button>

                <h1>Concept Mastery</h1>

                <p>Loading mastery data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-container">
                <button
                    className="back-button"
                    onClick={onBack}
                >
                    ← Back to Dashboard
                </button>

                <h1>Concept Mastery</h1>

                <div className="error-message">
                    {error}
                </div>
            </div>
        );
    }

    const concepts = data?.concepts || [];

    return (
        <div className="page-container">

            <button
                className="back-button"
                onClick={onBack}
            >
                ← Back to Dashboard
            </button>

            <h1>Concept Mastery</h1>

            <p>
                Track how well you understand each concept.
            </p>

            {/* Summary */}

            <div className="analytics-grid">

                <div className="analytics-card">
                    <h3>Overall Mastery</h3>

                    <div className="analytics-value">
                        {data?.averageMastery || 0}%
                    </div>
                </div>

                <div className="analytics-card">
                    <h3>Total Concepts</h3>

                    <div className="analytics-value">
                        {concepts.length}
                    </div>
                </div>

            </div>

            {/* Concepts */}

            <h2>Concepts</h2>

            {concepts.length === 0 ? (
                <div className="empty-state">
                    <p>
                        Complete a quiz to start tracking
                        concept mastery.
                    </p>
                </div>
            ) : (
                <div className="mastery-list">

                    {concepts.map((item) => {

                        const score = Math.min(
                            Math.max(
                                item.score || 0,
                                0
                            ),
                            100
                        );

                        return (
                            <div
                                className="mastery-card"
                                key={item._id}
                            >

                                <div className="mastery-header">

                                    <div>
                                        <h3>
                                            {item.concept}
                                        </h3>

                                        <p>
                                            Status:{" "}
                                            {item.status}
                                        </p>
                                    </div>

                                    <strong>
                                        {Math.round(score)}%
                                    </strong>

                                </div>

                                {/* Progress bar */}

                                <div className="progress-container">
                                    <div
                                        className="progress-bar"
                                        style={{
                                            width:
                                                `${score}%`
                                        }}
                                    />
                                </div>

                                {/* Details */}

                                <div className="mastery-details">

                                    <span>
                                        Attempts:{" "}
                                        {item.attempts || 0}
                                    </span>

                                    <span>
                                        Correct Answers:{" "}
                                        {item.correctAnswers || 0}
                                    </span>

                                    <span>
                                        Last Score:{" "}
                                        {item.lastScore || 0}%
                                    </span>

                                </div>

                            </div>
                        );
                    })}

                </div>
            )}

        </div>
    );
}

export default Mastery;