import { useState } from "react";

import Login from "./components/Login";
import Spaces from "./components/Spaces";
import ProjectList from "./components/ProjectList";
import ProjectDashboard from "./components/ProjectDashboard";
import Materials from "./components/Materials";
import Quiz from "./components/Quiz";
import QuizResult from "./components/QuizResult";
import Tutor from "./components/Tutor";
import Mastery from "./components/Mastery";
import Recommendation from "./components/Recommendation";
import Analytics from "./components/Analytics";

import "./App.css";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(
        Boolean(localStorage.getItem("token"))
    );

    const [selectedSpace, setSelectedSpace] =
        useState(null);

    const [selectedProject, setSelectedProject] =
        useState(null);

    const [currentPage, setCurrentPage] =
        useState("dashboard");

    const [assessment, setAssessment] =
        useState(null);

    const logout = () => {
        localStorage.removeItem("token");

        setIsLoggedIn(false);
        setSelectedSpace(null);
        setSelectedProject(null);
        setAssessment(null);
        setCurrentPage("dashboard");
    };

    if (!isLoggedIn) {
        return (
            <Login
                onLogin={() => {
                    setIsLoggedIn(true);
                }}
            />
        );
    }

    if (
        selectedProject &&
        currentPage === "materials"
    ) {
        return (
            <Materials
                project={selectedProject}
                onBack={() => {
                    setCurrentPage("dashboard");
                }}
            />
        );
    }

    if (
        selectedProject &&
        currentPage === "quiz"
    ) {
        return (
            <Quiz
                project={selectedProject}
                onBack={() => {
                    setCurrentPage("dashboard");
                }}
                onResult={(result) => {
                    setAssessment(result);
                    setCurrentPage("quiz-result");
                }}
            />
        );
    }

    if (
        selectedProject &&
        currentPage === "quiz-result"
    ) {
        return (
            <QuizResult
                assessment={assessment}
                onBackToDashboard={() => {
                    setCurrentPage("dashboard");
                }}
                onTakeAnotherQuiz={() => {
                    setAssessment(null);
                    setCurrentPage("quiz");
                }}
            />
        );
    }

    if (
        selectedProject &&
        currentPage === "tutor"
    ) {
        return (
            <Tutor
                project={selectedProject}
                onBack={() => {
                    setCurrentPage("dashboard");
                }}
            />
        );
    }

    if (
        selectedProject &&
        currentPage === "mastery"
    ) {
        return (
            <Mastery
                project={selectedProject}
                onBack={() => {
                    setCurrentPage("dashboard");
                }}
            />
        );
    }

    if (
        selectedProject &&
        currentPage === "recommendation"
    ) {
        return (
            <Recommendation
                project={selectedProject}
                onBack={() => {
                    setCurrentPage("dashboard");
                }}
            />
        );
    }

    if (
        selectedProject &&
        currentPage === "analytics"
    ) {
        return (
            <Analytics
                project={selectedProject}
                onBack={() => {
                    setCurrentPage("dashboard");
                }}
            />
        );
    }

    if (
        selectedProject &&
        currentPage === "dashboard"
    ) {
        return (
            <ProjectDashboard
                project={selectedProject}

                onBack={() => {
                    setSelectedProject(null);
                    setCurrentPage("dashboard");
                }}

                onOpenMaterials={() => {
                    setCurrentPage("materials");
                }}

                onOpenQuiz={() => {
                    setCurrentPage("quiz");
                }}

                onOpenTutor={() => {
                    setCurrentPage("tutor");
                }}

                onOpenMastery={() => {
                    setCurrentPage("mastery");
                }}

                onOpenRecommendation={() => {
                    setCurrentPage("recommendation");
                }}

                onOpenAnalytics={() => {
                    setCurrentPage("analytics");
                }}

                onLogout={logout}
            />
        );
    }

    if (selectedSpace) {
        return (
            <ProjectList
                space={selectedSpace}

                onSelectProject={(project) => {
                    setSelectedProject(project);
                    setCurrentPage("dashboard");
                }}

                onBack={() => {
                    setSelectedSpace(null);
                }}
            />
        );
    }

    return (
        <div className="app">
            <Spaces
                onSelectSpace={(space) => {
                    setSelectedSpace(space);
                }}
            />
        </div>
    );
}

export default App;