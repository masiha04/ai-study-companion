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

    useEffect(() => {
        const loadDashboard = async () => {
            const token =
                localStorage.getItem("token");

            try {
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

                const masteryData =
                    await masteryResponse.json();

                const recommendationData =
                    await recommendationResponse.json();

                const analyticsData =
                    await analyticsResponse.json();

                if (masteryResponse.ok) {
                    setMastery(masteryData);
                }

                if (recommendationResponse.ok) {
                    setRecommendation(
                        recommendationData.recommendation ||
                        recommendationData
                    );
                }

                if (analyticsResponse.ok) {
                    setAnalytics(analyticsData);
                }

            } catch (error) {
                console.error(
                    "Dashboard loading error:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, [project._id]);

    return (
        <div className="page-container">

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
                        onClick={onOpenTutor}
                    >
                        <span className="tool-icon">
                            🤖
                        </span>

                        <strong>
                            AI Tutor
                        </strong>

                        <small>
                            Ask grounded questions
                        </small>
                    </button>

                    <button
                        className="tool-card"
                        onClick={onOpenQuiz}
                    >
                        <span className="tool-icon">
                            🧠
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
                        onClick={onOpenMastery}
                    >
                        <span className="tool-icon">
                            📊
                        </span>

                        <strong>
                            Concept Mastery
                        </strong>

                        <small>
                            Track your knowledge
                        </small>
                    </button>

                    <button
                        className="tool-card"
                        onClick={onOpenRecommendation}
                    >
                        <span className="tool-icon">
                            🎯
                        </span>

                        <strong>
                            Next Recommendation
                        </strong>

                        <small>
                            Know what to learn next
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
                            Analytics
                        </strong>

                        <small>
                            View your learning growth
                        </small>
                    </button>

                </div>

            </div>

            <div className="dashboard-section">

                <div className="section-heading">
                    <h2>
                        Current Progress
                    </h2>
                </div>

                <div className="dashboard-two-column">

                    <div className="dashboard-card">

                        <h3>
                            Mastery Overview
                        </h3>

                        {mastery?.masteries?.length > 0 ? (
                            mastery.masteries
                                .slice(0, 5)
                                .map((item) => (
                                    <div
                                        className="dashboard-mastery-row"
                                        key={item._id}
                                    >

                                        <div>
                                            <strong>
                                                {item.concept}
                                            </strong>

                                            <span>
                                                {item.status}
                                            </span>
                                        </div>

                                        <strong>
                                            {Math.round(
                                                item.score || 0
                                            )}
                                            %
                                        </strong>

                                    </div>
                                ))
                        ) : (
                            <p>
                                Complete a quiz to build
                                mastery data.
                            </p>
                        )}

                    </div>

                    <div className="dashboard-card">

                        <h3>
                            Next Action
                        </h3>

                        {recommendation ? (
                            <>
                                <h4>
                                    {recommendation.title ||
                                        recommendation.action ||
                                        recommendation.recommendation ||
                                        "Continue learning"}
                                </h4>

                                <p>
                                    {recommendation.description ||
                                        recommendation.reason ||
                                        recommendation.message ||
                                        "Continue practicing your learning material."}
                                </p>
                            </>
                        ) : (
                            <p>
                                Complete an assessment to
                                receive a recommendation.
                            </p>
                        )}

                    </div>

                </div>

            </div>

        </div>
    );
}

export default ProjectDashboard;