import { useEffect, useState } from "react";

function Analytics({ project, onBack }) {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadAnalytics = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `http://localhost:5000/api/analytics/project/${project._id}`,
                    {
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
                        "Could not load analytics"
                    );
                }

                setAnalytics(data);
            } catch (error) {
                console.error(
                    "Analytics error:",
                    error
                );

                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        loadAnalytics();
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

                <h1>Learning Analytics</h1>

                <p>Loading analytics...</p>
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

                <h1>Learning Analytics</h1>

                <div className="error-message">
                    {error}
                </div>
            </div>
        );
    }

    const summary = analytics?.summary || {};

    const attentionAreas =
        analytics?.attentionAreas || [];

    const improvingConcepts =
        analytics?.improvingConcepts || [];

    const recentAssessments =
        analytics?.recentAssessments || [];

    const recentActivities =
        analytics?.recentActivities || [];

    return (
        <div className="page-container">

            {/* Back */}

            <button
                className="back-button"
                onClick={onBack}
            >
                ← Back to Dashboard
            </button>

            {/* Header */}

            <h1>Learning Analytics</h1>

            <p>
                Track your learning progress and
                identify areas that need attention.
            </p>

            {/* Summary */}

            <div className="analytics-grid">

                <div className="analytics-card">
                    <h3>Average Mastery</h3>

                    <div className="analytics-value">
                        {Math.round(
                            summary.averageMastery || 0
                        )}%
                    </div>
                </div>

                <div className="analytics-card">
                    <h3>Average Quiz Score</h3>

                    <div className="analytics-value">
                        {Math.round(
                            summary.averageQuizScore || 0
                        )}%
                    </div>
                </div>

                <div className="analytics-card">
                    <h3>Total Activities</h3>

                    <div className="analytics-value">
                        {summary.totalActivities || 0}
                    </div>
                </div>

                <div className="analytics-card">
                    <h3>Total Assessments</h3>

                    <div className="analytics-value">
                        {summary.totalAssessments || 0}
                    </div>
                </div>

                <div className="analytics-card">
                    <h3>Total Concepts</h3>

                    <div className="analytics-value">
                        {summary.totalConcepts || 0}
                    </div>
                </div>

            </div>

            {/* Attention Areas */}

            <h2>Attention Areas</h2>

            {attentionAreas.length === 0 ? (
                <div className="empty-state">
                    <p>
                        No concepts currently need
                        immediate attention.
                    </p>
                </div>
            ) : (
                <div className="mastery-list">

                    {attentionAreas.map((item) => (
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
                                        Needs attention
                                    </p>
                                </div>

                                <strong>
                                    {Math.round(
                                        item.score || 0
                                    )}%
                                </strong>

                            </div>

                            <div className="progress-container">
                                <div
                                    className="progress-bar"
                                    style={{
                                        width:
                                            `${Math.min(
                                                Math.max(
                                                    item.score || 0,
                                                    0
                                                ),
                                                100
                                            )}%`
                                    }}
                                />
                            </div>
                        </div>
                    ))}

                </div>
            )}

            {/* Improving Concepts */}

            <h2>Improving Concepts</h2>

            {improvingConcepts.length === 0 ? (
                <div className="empty-state">
                    <p>
                        No concepts are currently in
                        the improving range.
                    </p>
                </div>
            ) : (
                <div className="mastery-list">

                    {improvingConcepts.map((item) => (
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
                                        Improving
                                    </p>
                                </div>

                                <strong>
                                    {Math.round(
                                        item.score || 0
                                    )}%
                                </strong>

                            </div>

                            <div className="progress-container">
                                <div
                                    className="progress-bar"
                                    style={{
                                        width:
                                            `${Math.min(
                                                Math.max(
                                                    item.score || 0,
                                                    0
                                                ),
                                                100
                                            )}%`
                                    }}
                                />
                            </div>
                        </div>
                    ))}

                </div>
            )}

            {/* Recent Assessments */}

            <h2>Recent Assessments</h2>

            {recentAssessments.length === 0 ? (
                <div className="empty-state">
                    <p>
                        No assessments completed yet.
                    </p>
                </div>
            ) : (
                <div className="activity-list">

                    {recentAssessments.map(
                        (assessment) => (
                            <div
                                className="activity-card"
                                key={assessment._id}
                            >
                                <h3>
                                    Quiz Assessment
                                </h3>

                                <p>
                                    Score:{" "}
                                    {Math.round(
                                        assessment.percentage ||
                                        0
                                    )}%
                                </p>

                                <small>
                                    {assessment.createdAt
                                        ? new Date(
                                            assessment.createdAt
                                        ).toLocaleString()
                                        : ""}
                                </small>
                            </div>
                        )
                    )}

                </div>
            )}

            {/* Recent Activities */}

            <h2>Recent Activities</h2>

            {recentActivities.length === 0 ? (
                <div className="empty-state">
                    <p>
                        No recent activities.
                    </p>
                </div>
            ) : (
                <div className="activity-list">

                    {recentActivities.map(
                        (activity) => (
                            <div
                                className="activity-card"
                                key={activity._id}
                            >
                                <h3>
                                    {activity.type
                                        ?.replace(
                                            /_/g,
                                            " "
                                        )
                                        .replace(
                                            /\b\w/g,
                                            char =>
                                                char.toUpperCase()
                                        )}
                                </h3>

                                <small>
                                    {activity.createdAt
                                        ? new Date(
                                            activity.createdAt
                                        ).toLocaleString()
                                        : ""}
                                </small>
                            </div>
                        )
                    )}

                </div>
            )}

        </div>
    );
}

export default Analytics;