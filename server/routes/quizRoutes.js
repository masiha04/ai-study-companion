const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const Project = require("../models/Project");
const Quiz = require("../models/Quiz");

const {
    retrieveRelevantChunks
} = require("../services/retrievalService");

const {
    generateStructuredJSON
} = require("../services/groqService");

const router = express.Router();

router.post(
    "/generate/:projectId",
    authMiddleware,
    async (req, res) => {

        try {

            console.log("QUIZ GENERATION ROUTE HIT");

            const { projectId } = req.params;

            const project = await Project.findOne({
                _id: projectId,
                user: req.userId
            });

            if (!project) {
                return res.status(404).json({
                    message: "Project not found"
                });
            }

            const quizTopic = `
            Project: ${project.name}
            Description: ${project.description || ""}
            Goal: ${project.goal || ""}
            `;

            const results = await retrieveRelevantChunks(
                   projectId,
                   req.userId,
                   quizTopic,
                   10
            );

            if (results.length === 0) {
                return res.status(404).json({
                    message: "No relevant learning material found"
                });
            }

            const context = results
                .map((item, index) => {
                    return (
                        "Source " +
                        (index + 1) +
                        ":\n" +
                        item.chunk.text
                    );
                })
                .join("\n\n");

            const prompt = `
You are an AI Study Quiz Generator.

Create a quiz ONLY from the study material
provided below.

Generate EXACTLY 5 questions.

Requirements:
- 4 MCQ questions
- 1 open-ended question

Each question must contain:
question
type
options
correctAnswer
explanation
concept
difficulty

Rules:

1. type must be "mcq" or "open".

2. MCQ questions must contain exactly 4 options.

3. Open-ended questions must contain an empty options array.

4. For MCQ questions, correctAnswer must exactly
match one of the options.

5. For open-ended questions, correctAnswer should
contain the expected answer.

6. Every question must have a concept.

7. difficulty must be "easy", "medium", or "hard".

8. Use ONLY the provided study material.

9. Do not use outside knowledge.

10. Return valid JSON only.

Return exactly this structure:

{
    "questions": [
        {
            "question": "...",
            "type": "mcq",
            "options": ["...", "...", "...", "..."],
            "correctAnswer": "...",
            "explanation": "...",
            "concept": "...",
            "difficulty": "easy"
        }
    ]
}

Study material:

${context}
`;

            console.log("Sending quiz request to Groq...");

            const generated =
                await generateStructuredJSON(prompt);

            console.log(
                "AI generated",
                generated.questions?.length,
                "questions"
            );

            if (
                !generated ||
                !Array.isArray(generated.questions)
            ) {
                throw new Error(
                    "Invalid quiz structure"
                );
            }

            if (generated.questions.length !== 5) {
                throw new Error(
                    "AI did not generate exactly 5 questions"
                );
            }

            const mcqCount =
                generated.questions.filter(
                    question => question.type === "mcq"
                ).length;

            const openCount =
                generated.questions.filter(
                    question => question.type === "open"
                ).length;

            if (
                mcqCount !== 4 ||
                openCount !== 1
            ) {
                throw new Error(
                    "Quiz must contain 4 MCQs and 1 open-ended question"
                );
            }

            for (
                const question
                of generated.questions
            ) {

                if (
                    !question.question ||
                    !question.type ||
                    !question.correctAnswer ||
                    !question.explanation ||
                    !question.concept ||
                    !question.difficulty
                ) {
                    throw new Error(
                        "Quiz question is missing required fields"
                    );
                }

                if (
                    !["mcq", "open"].includes(
                        question.type
                    )
                ) {
                    throw new Error(
                        "Invalid question type"
                    );
                }

                if (
                    !["easy", "medium", "hard"].includes(
                        question.difficulty
                    )
                ) {
                    throw new Error(
                        "Invalid difficulty"
                    );
                }

                if (question.type === "mcq") {

                    if (
                        !Array.isArray(
                            question.options
                        ) ||
                        question.options.length !== 4
                    ) {
                        throw new Error(
                            "MCQ must contain exactly 4 options"
                        );
                    }

                    if (
                        !question.options.includes(
                            question.correctAnswer
                        )
                    ) {
                        throw new Error(
                            "MCQ correctAnswer must match one of the options"
                        );
                    }
                }

                if (question.type === "open") {

                    if (
                        !Array.isArray(
                            question.options
                        ) ||
                        question.options.length !== 0
                    ) {
                        throw new Error(
                            "Open-ended question must have an empty options array"
                        );
                    }
                }
            }

            const quiz = await Quiz.create({
                project: projectId,
                user: req.userId,
                questions: generated.questions
            });

            return res.status(201).json({
                message: "Quiz generated successfully",
                quiz
            });

        } catch (error) {

            console.error(
                "Quiz generation error:",
                error.message
            );

            return res.status(500).json({
                message: "Could not generate quiz",
                error: error.message
            });
        }
    }
);

router.get(
    "/:projectId",
    authMiddleware,
    async (req, res) => {

        try {

            const quizzes = await Quiz.find({
                project: req.params.projectId,
                user: req.userId
            }).sort({
                createdAt: -1
            });

            return res.status(200).json({
                quizzes
            });

        } catch (error) {

            console.error(
                "Get quizzes error:",
                error.message
            );

            return res.status(500).json({
                message: "Could not fetch quizzes"
            });
        }
    }
);

module.exports = router;

