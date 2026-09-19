import { useEffect, useState } from "react";

function ProjectDashboard({
    project,
    onBack,
    onOpenMaterials,
    onOpenQuiz,
    onOpenTutor,
    onOpenMastery,
    onOpenRecommendation,
    onOpenAnalytics,
    onLogout
}) {
    const [mastery, setMastery] = useState(null);
    const [recommendation, setRecommendation] = useState(null);
    const [analytics, setAnalytics] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadDashboard = async () => {
            const token =
                localStorage.getItem("token");

            try {
                setLoading(true);
                setError("");

                const [
                    masteryResponse,
                    recommendationResponse,
                    analyticsResponse
                ] = await Promise.all([
                    fetch(
                        `http://localhost:5000/api/mastery/${project._id}`,
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    ),

                    fetch(
                        `http://localhost:5000/api/recommendations/${project._id}`,
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    ),

                    fetch(
                        `http://localhost:5000/api/analytics/project/${project._id}`,
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    )
                ]);

                if (!masteryResponse.ok) {
                    throw new Error(
                        "Could not load mastery data"
                    );
                }

                if (!recommendationResponse.ok) {
                    throw new Error(
                        "Could not load recommendations"
                    );
                }

                if (!analyticsResponse.ok) {
                    throw new Error(
                        "Could not load analytics"
                    );
                }

                const masteryData =
                    await masteryResponse.json();

                const recommendationData =
                    await recommendationResponse.json();

                const analyticsData =
                    await analyticsResponse.json();

                setMastery(masteryData);

                setRecommendation(
                    recommendationData.recommendation ||
                    recommendationData
                );

                setAnalytics(analyticsData);

            } catch (error) {
                console.error(
                    "Dashboard loading error:",
                    error
                );

                setError(
                    error.message ||
                    "Could not load dashboard data"
                );

            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, [project._id]);

    return (
        <div className="page-container">

            {error && (
                <div className="dashboard-error">
                    {error}
                </div>
            )}

            <div className="dashboard-header">

                <div>

                    <button
                        className="back-button"
                        onClick={onBack}
                    >
                        ← Back
                    </button>

                    <h1>
                        {project.name}
                    </h1>

                    <p>
                        {project.description}
                    </p>

                    {project.goal && (
                        <div className="goal-box">
                            <strong>
                                Goal:
                            </strong>{" "}
                            {project.goal}
                        </div>
                    )}

                </div>

                <button
                    className="logout-button"
                    onClick={onLogout}
                >
                    Logout
                </button>

            </div>

            <div className="dashboard-summary">

                <div className="summary-card">
                    <span>
                        Average Mastery
                    </span>

                    <strong>
                        {loading
                            ? "..."
                            : `${Math.round(
                                mastery?.averageMastery || 0
                            )}%`}
                    </strong>
                </div>

                <div className="summary-card">
                    <span>
                        Quiz Score
                    </span>

                    <strong>
                        {loading
                            ? "..."
                            : `${Math.round(
                                analytics?.averageQuizScore || 0
                            )}%`}
                    </strong>
                </div>

                <div className="summary-card">
                    <span>
                        Concepts
                    </span>

                    <strong>
                        {loading
                            ? "..."
                            : analytics?.totalConcepts || 0}
                    </strong>
                </div>

                <div className="summary-card">
                    <span>
                        Activities
                    </span>

                    <strong>
                        {loading
                            ? "..."
                            : analytics?.totalActivities || 0}
                    </strong>
                </div>

            </div>

            <div className="dashboard-section">

                <div className="section-heading">
                    <h2>
                        Learning Tools
                    </h2>

                    <p>
                        Learn, practice, and track your progress.
                    </p>
                </div>

                <div className="tool-grid">

                    <button
                        className="tool-card"
                        onClick={onOpenMaterials}
                    >
                        <span className="tool-icon">
                            📚
                        </span>

                        <strong>
                            Learning Materials
                        </strong>

                        <small>
                            Upload and manage PDFs
                        </small>
                    </button>

                    <button
                        className="tool-card"
                        onClick={onOpenQuiz}
                    >
                        <span className="tool-icon">
                            📝
                        </span>

                        <strong>
                            Adaptive Quiz
                        </strong>

                        <small>
                            Test your understanding
                        </small>
                    </button>

                    <button
                        className="tool-card"
                        onClick={onOpenTutor}
                    >
                        <span className="tool-icon">
                            🤖
                        </span>

                        <strong>
                            AI Tutor
                        </strong>

                        <small>
                            Ask questions about your material
                        </small>
                    </button>

                    <button
                        className="tool-card"
                        onClick={onOpenMastery}
                    >
                        <span className="tool-icon">
                            📊
                        </span>

                        <strong>
                            Concept Mastery
                        </strong>

                        <small>
                            Track your understanding
                        </small>
                    </button>

                    <button
                        className="tool-card"
                        onClick={onOpenRecommendation}
                    >
                        <span className="tool-icon">
                            💡
                        </span>

                        <strong>
                            Recommendations
                        </strong>

                        <small>
                            Discover what to learn next
                        </small>
                    </button>

                    <button
                        className="tool-card"
                        onClick={onOpenAnalytics}
                    >
                        <span className="tool-icon">
                            📈
                        </span>

                        <strong>
                            Growth Analytics
                        </strong>

                        <small>
                            Analyze your learning progress
                        </small>
                    </button>

                </div>

            </div>

            <div className="dashboard-section">

                <div className="section-heading">
                    <h2>
                        Current Progress
                    </h2>

                    <p>
                        Your latest learning insights.
                    </p>
                </div>

                <div className="progress-grid">

                    <div className="progress-card">

                        <span>
                            Average Mastery
                        </span>

                        <strong>
                            {loading
                                ? "..."
                                : `${Math.round(
                                    mastery?.averageMastery || 0
                                )}%`}
                        </strong>

                    </div>

                    <div className="progress-card">

                        <span>
                            Quiz Performance
                        </span>

                        <strong>
                            {loading
                                ? "..."
                                : `${Math.round(
                                    analytics?.averageQuizScore || 0
                                )}%`}
                        </strong>

                    </div>

                </div>

            </div>

            {recommendation && !loading && (
                <div className="dashboard-section">

                    <div className="section-heading">
                        <h2>
                            Recommended Next Step
                        </h2>

                        <p>
                            Continue improving your learning.
                        </p>
                    </div>

                    <div className="recommendation-card">

                        <h3>
                            {recommendation.title ||
                                "Keep Learning"}
                        </h3>

                        {recommendation.reason && (
                            <p>
                                {recommendation.reason}
                            </p>
                        )}

                        {recommendation.action && (
                            <strong>
                                Next action:{" "}
                                {recommendation.action}
                            </strong>
                        )}

                    </div>

                </div>
            )}

        </div>
    );
}

export default ProjectDashboard;