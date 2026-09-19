import { useEffect, useState } from "react";

function ProjectList({ space, onSelectProject, onBack }) {
    const [projects, setProjects] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [goal, setGoal] = useState("");

    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadProjects = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await fetch(
                    `http://localhost:5000/api/projects/space/${space._id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to fetch projects"
                    );
                }

                setProjects(data.projects || data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        loadProjects();
    }, [space._id]);

    const handleCreateProject = async (event) => {
        event.preventDefault();

        if (!name.trim()) {
            return;
        }

        setCreating(true);
        setError("");

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:5000/api/projects",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        name,
                        description,
                        goal,
                        spaceId: space._id
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to create project"
                );
            }

            setProjects((currentProjects) => [
                data.project || data,
                ...currentProjects
            ]);

            setName("");
            setDescription("");
            setGoal("");
        } catch (error) {
            setError(error.message);
        } finally {
            setCreating(false);
        }
    };

    if (loading) {
        return (
            <div className="spaces-page">
                <h2>Loading projects...</h2>
            </div>
        );
    }

    return (
        <div className="spaces-page">
            <div className="spaces-header">
                <div>
                    <button
                        className="back-button"
                        onClick={onBack}
                    >
                        ← Back to Spaces
                    </button>

                    <h1>{space.name}</h1>

                    <p>
                        {space.description ||
                            "Projects inside this learning space."}
                    </p>
                </div>
            </div>

            <section className="create-space-card">
                <h2>Create a Project</h2>

                <form onSubmit={handleCreateProject}>
                    <input
                        type="text"
                        placeholder="Project name"
                        value={name}
                        onChange={(event) =>
                            setName(event.target.value)
                        }
                    />

                    <textarea
                        placeholder="What will you learn in this project?"
                        value={description}
                        onChange={(event) =>
                            setDescription(event.target.value)
                        }
                    />

                    <textarea
                        placeholder="What is your learning goal?"
                        value={goal}
                        onChange={(event) =>
                            setGoal(event.target.value)
                        }
                    />

                    <button
                        type="submit"
                        disabled={creating}
                    >
                        {creating
                            ? "Creating..."
                            : "Create Project"}
                    </button>
                </form>
            </section>

            {error && (
                <p className="spaces-error">
                    {error}
                </p>
            )}

            <section className="spaces-section">
                <h2>Your Projects</h2>

                {projects.length === 0 ? (
                    <div className="empty-space">
                        <h3>No projects yet</h3>

                        <p>
                            Create your first project in this space.
                        </p>
                    </div>
                ) : (
                    <div className="spaces-grid">
                        {projects.map((project) => (
                            <div
                                className="space-card"
                                key={project._id}
                                onClick={() =>
                                    onSelectProject(project)
                                }
                            >
                                <h3>{project.name}</h3>

                                <p>
                                    {project.description ||
                                        "No description"}
                                </p>

                                {project.goal && (
                                    <p>
                                        <strong>Goal:</strong>{" "}
                                        {project.goal}
                                    </p>
                                )}

                                <span>
                                    Open Project →
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

export default ProjectList;