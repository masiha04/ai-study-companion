import { useEffect, useState } from "react";

function Recommendation({ project, onBack }) {
    const [recommendation, setRecommendation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadRecommendation = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `http://localhost:5000/api/recommendations/${project._id}`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${localStorage.getItem("token")}`
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    if (response.status === 404) {
                        setRecommendation(null);
                        return;
                    }

                    throw new Error(
                        data.message ||
                        "Could not load recommendation"
                    );
                }

                setRecommendation(
                    data.recommendation || data
                );

            } catch (error) {
                console.error(
                    "Recommendation error:",
                    error
                );

                setError(error.message);

            } finally {
                setLoading(false);
            }
        };

        loadRecommendation();
    }, [project._id]);

    const generateRecommendation = async () => {
        try {
            setGenerating(true);
            setError("");

            const response = await fetch(
                `http://localhost:5000/api/recommendations/generate/${project._id}`,
                {
                    method: "POST",
                    headers: {
                        Authorization:
                            `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Could not generate recommendation"
                );
            }

            setRecommendation(
                data.recommendation || data
            );

        } catch (error) {
            console.error(
                "Generate recommendation error:",
                error
            );

            setError(error.message);

        } finally {
            setGenerating(false);
        }
    };

    if (loading) {
        return (
            <div className="page-container">
                <div className="loading-card">
                    Loading recommendation...
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">

            <div className="page-header">

                <button
                    className="back-button"
                    onClick={onBack}
                >
                    ← Back to Dashboard
                </button>

                <h1>
                    Next Learning Recommendation
                </h1>

                <p>
                    Get a learning action based on your
                    current progress and mastery.
                </p>

            </div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {!recommendation ? (
                <div className="empty-card recommendation-empty">

                    <div className="recommendation-icon">
                        🎯
                    </div>

                    <h2>
                        No recommendation yet
                    </h2>

                    <p>
                        Generate a recommendation based on
                        your current learning progress.
                    </p>

                    <button
                        className="primary-button"
                        onClick={generateRecommendation}
                        disabled={generating}
                    >
                        {generating
                            ? "Generating..."
                            : "Generate Recommendation"}
                    </button>

                </div>
            ) : (
                <div className="recommendation-card">

                    <div className="recommendation-icon">
                        🎯
                    </div>

                    <span className="recommendation-label">
                        Recommended Next Action
                    </span>

                    <h2>
                        {recommendation.title ||
                            recommendation.action ||
                            recommendation.recommendation ||
                            "Continue learning"}
                    </h2>

                    <p>
                        {recommendation.description ||
                            recommendation.reason ||
                            recommendation.message ||
                            "Continue practicing the concepts identified in your learning progress."}
                    </p>

                    {recommendation.concept && (
                        <div className="recommendation-concept">

                            <strong>
                                Focus Concept
                            </strong>

                            <span>
                                {recommendation.concept}
                            </span>

                        </div>
                    )}

                    <button
                        className="secondary-button"
                        onClick={generateRecommendation}
                        disabled={generating}
                    >
                        {generating
                            ? "Updating..."
                            : "Generate New Recommendation"}
                    </button>

                </div>
            )}

        </div>
    );
}

export default Recommendation;
