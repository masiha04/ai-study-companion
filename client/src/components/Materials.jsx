import { useEffect, useState } from "react";

function Materials({ project, onBack }) {
    const [materials, setMaterials] = useState([]);
    const [selectedFile, setSelectedFile] =
        useState(null);

    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] =
        useState(false);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const loadMaterials = async () => {
            try {
                const token =
                    localStorage.getItem("token");

                const response = await fetch(
                    `http://localhost:5000/api/materials/${project._id}`,
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
                            "Failed to load materials"
                    );
                }

                setMaterials(
                    data.materials || []
                );
            } catch (error) {
                console.error(
                    "Load materials error:",
                    error
                );

                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        loadMaterials();
    }, [project._id]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];

        setError("");
        setMessage("");

        if (!file) {
            setSelectedFile(null);
            return;
        }

        if (file.type !== "application/pdf") {
            setSelectedFile(null);

            setError(
                "Only PDF files are allowed."
            );

            return;
        }

        setSelectedFile(file);
    };

    const handleUpload = async (event) => {
        event.preventDefault();

        if (!selectedFile) {
            setError(
                "Please select a PDF file."
            );

            return;
        }

        setUploading(true);
        setError("");
        setMessage("");

        try {
            const token =
                localStorage.getItem("token");

            const formData = new FormData();

            formData.append(
                "file",
                selectedFile
            );

            const response = await fetch(
                `http://localhost:5000/api/materials/${project._id}`,
                {
                    method: "POST",

                    headers: {
                        Authorization: `Bearer ${token}`
                    },

                    body: formData
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Failed to upload material"
                );
            }

            setMaterials(
                (currentMaterials) => [
                    data.material,
                    ...currentMaterials
                ]
            );

            setSelectedFile(null);

            setMessage(
                "PDF uploaded and processed successfully."
            );

            event.target.reset();
        } catch (error) {
            console.error(
                "Upload error:",
                error
            );

            setError(error.message);
        } finally {
            setUploading(false);
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

                <h1>
                    📄 Learning Materials
                </h1>

                <p>
                    Upload PDF materials for your{" "}
                    <strong>
                        {project.name}
                    </strong>{" "}
                    project.
                </p>

            </div>

            <section className="dashboard-section">

                <div className="material-upload-card">

                    <h2>
                        Upload Learning Material
                    </h2>

                    <p>
                        Upload a PDF and the system
                        will extract its content,
                        create chunks and generate
                        embeddings for AI-powered
                        learning.
                    </p>

                    <form
                        onSubmit={handleUpload}
                    >

                        <input
                            type="file"
                            accept="application/pdf"
                            onChange={
                                handleFileChange
                            }
                        />

                        {selectedFile && (
                            <div className="selected-file">

                                <strong>
                                    Selected:
                                </strong>{" "}
                                {selectedFile.name}

                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={
                                uploading ||
                                !selectedFile
                            }
                        >
                            {uploading
                                ? "Processing PDF..."
                                : "Upload PDF"}
                        </button>

                    </form>

                    {message && (
                        <div className="material-success">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="dashboard-error">
                            {error}
                        </div>
                    )}

                </div>

            </section>

            <section className="dashboard-section">

                <h2>Your Materials</h2>

                {loading ? (
                    <div className="dashboard-empty">
                        Loading materials...
                    </div>
                ) : materials.length === 0 ? (
                    <div className="dashboard-empty">

                        <h3>
                            No materials yet
                        </h3>

                        <p>
                            Upload your first PDF
                            to start learning with
                            the AI Tutor.
                        </p>

                    </div>
                ) : (
                    <div className="materials-list">

                        {materials.map(
                            (material) => (
                                <div
                                    className="material-card"
                                    key={
                                        material._id
                                    }
                                >

                                    <div>

                                        <div className="material-title">
                                            📄{" "}
                                            {material.originalName ||
                                                material.name}
                                        </div>

                                        <p>
                                            Status:{" "}
                                            <span
                                                className={`material-status ${material.status}`}
                                            >
                                                {
                                                    material.status
                                                }
                                            </span>
                                        </p>

                                    </div>

                                    <span className="material-type">
                                        PDF
                                    </span>

                                </div>
                            )
                        )}

                    </div>
                )}

            </section>

        </div>
    );
}

export default Materials;