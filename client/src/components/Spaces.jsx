import { useEffect, useState } from "react";

function Spaces({ onSelectSpace }) {
    const [spaces, setSpaces] = useState([]);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadSpaces = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await fetch(
                    "http://localhost:5000/api/spaces",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message ||
                            "Failed to fetch spaces"
                    );
                }

                setSpaces(data.spaces || data || []);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        loadSpaces();
    }, []);

    const handleCreateSpace = async (event) => {
        event.preventDefault();

        if (!name.trim()) {
            return;
        }

        setCreating(true);
        setError("");

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:5000/api/spaces",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        name,
                        description
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Failed to create space"
                );
            }

            setSpaces((currentSpaces) => [
                data.space || data,
                ...currentSpaces
            ]);

            setName("");
            setDescription("");
        } catch (error) {
            setError(error.message);
        } finally {
            setCreating(false);
        }
    };

    if (loading) {
        return (
            <div className="spaces-page">
                <h2>Loading your spaces...</h2>
            </div>
        );
    }

    return (
        <div className="spaces-page">

            <div className="spaces-header">
                <div>
                    <h1>My Learning Spaces</h1>

                    <p>
                        Organize your learning into
                        focused areas.
                    </p>
                </div>
            </div>

            <section className="create-space-card">

                <h2>Create a Space</h2>

                <form onSubmit={handleCreateSpace}>

                    <input
                        type="text"
                        placeholder="Space name"
                        value={name}
                        onChange={(event) =>
                            setName(event.target.value)
                        }
                    />

                    <textarea
                        placeholder="What do you want to learn?"
                        value={description}
                        onChange={(event) =>
                            setDescription(
                                event.target.value
                            )
                        }
                    />

                    <button
                        type="submit"
                        disabled={creating}
                    >
                        {creating
                            ? "Creating..."
                            : "Create Space"}
                    </button>

                </form>

            </section>

            {error && (
                <p className="spaces-error">
                    {error}
                </p>
            )}

            <section className="spaces-section">

                <h2>Your Spaces</h2>

                {spaces.length === 0 ? (
                    <div className="empty-space">

                        <h3>No spaces yet</h3>

                        <p>
                            Create your first learning
                            space above.
                        </p>

                    </div>
                ) : (
                    <div className="spaces-grid">

                        {spaces.map((space) => (
                            <div
                                className="space-card"
                                key={space._id}
                                onClick={() =>
                                    onSelectSpace(space)
                                }
                            >
                                <h3>{space.name}</h3>

                                <p>
                                    {space.description ||
                                        "No description"}
                                </p>

                                <span>
                                    Open Space →
                                </span>
                            </div>
                        ))}

                    </div>
                )}

            </section>

        </div>
    );
}

export default Spaces;