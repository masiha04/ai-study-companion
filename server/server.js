const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const spaceRoutes = require("./routes/spaceRoutes");
const projectRoutes = require("./routes/projectRoutes");
const materialRoutes = require("./routes/materialRoutes");
const retrievalRoutes = require("./routes/retrievalRoutes");
const tutorRoutes = require("./routes/tutorRoutes");
const quizRoutes =
    require("./routes/quizRoutes");

const assessmentRoutes =
    require("./routes/assessmentRoutes");

const masteryRoutes =
    require("./routes/masteryRoutes");

const recommendationRoutes =
    require("./routes/recommendationRoutes");

const analyticsRoutes =
    require("./routes/analyticsRoutes");
const app = express();

app.use(cors());
app.use(express.json());


connectDB();
app.use("/api/auth", authRoutes);
app.use("/api/spaces", spaceRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/retrieval", retrievalRoutes);
app.use("/api/tutor", tutorRoutes);
app.use(
    "/api/quizzes",
    quizRoutes
);

app.use(
    "/api/assessments",
    assessmentRoutes
);

app.use(
    "/api/mastery",
    masteryRoutes
);

app.use(
    "/api/recommendations",
    recommendationRoutes
);

app.use(
    "/api/analytics",
    analyticsRoutes
);

app.get("/", (req, res) => {
    res.json({
        message: "AI Study Companion API is running!"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});