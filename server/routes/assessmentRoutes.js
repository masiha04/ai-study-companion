const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");

const Quiz = require("../models/Quiz");
const Assessment = require("../models/Assessment");
const Mastery = require("../models/Mastery");
const Activity = require("../models/Activity");

const {
    generateStructuredJSON
} = require("../services/groqService");

const router = express.Router();

// ==========================================
// SUBMIT ASSESSMENT
// ==========================================

router.post(
    "/submit/:quizId",
    authMiddleware,
    async (req, res) => {
        try {
            const { quizId } = req.params;
            const { answers } = req.body;

            if (!Array.isArray(answers)) {
                return res.status(400).json({
                    message: "Answers must be an array"
                });
            }

            // ==========================================
            // 1. Find quiz
            // ==========================================

            const quiz = await Quiz.findOne({
                _id: quizId,
                user: req.userId
            });

            if (!quiz) {
                return res.status(404).json({
                    message: "Quiz not found"
                });
            }

            const evaluatedAnswers = [];

            // ==========================================
            // 2. Evaluate each question
            // ==========================================

            for (const question of quiz.questions) {
                const submitted = answers.find(
                    answer =>
                        answer.questionId ===
                        question._id.toString()
                );

                const studentAnswer =
                    submitted?.answer?.toString().trim() || "";

                // ==========================================
                // MCQ
                // ==========================================

                if (question.type === "mcq") {
                    const correctAnswer =
                        question.correctAnswer
                            ?.toString()
                            .trim() || "";

                    const isCorrect =
                        studentAnswer.toLowerCase() ===
                        correctAnswer.toLowerCase();

                    evaluatedAnswers.push({
                        questionId: question._id,
                        answer: studentAnswer,
                        isCorrect,
                        score: isCorrect ? 100 : 0,
                        feedback: isCorrect
                            ? "Correct answer."
                            : `Incorrect. The correct answer is ${correctAnswer}.`,
                        concept: question.concept
                    });

                    continue;
                }

                // ==========================================
                // OPEN-ENDED QUESTION
                // ==========================================

                const prompt = `
You are an AI assessment evaluator.

Evaluate the student's answer using the expected answer and question below.

Question:
${question.question}

Expected answer:
${question.correctAnswer}

Student answer:
${studentAnswer}

Evaluate based on:

- Understanding
- Accuracy
- Relevance
- Important concepts
- Missing concepts
- Reasoning

Return ONLY valid JSON:

{
    "score": 0,
    "isCorrect": false,
    "feedback": "..."
}

Score must be between 0 and 100.
`;

                const evaluation =
                    await generateStructuredJSON(prompt);

                const score = Math.min(
                    Math.max(
                        Number(evaluation.score) || 0,
                        0
                    ),
                    100
                );

                evaluatedAnswers.push({
                    questionId: question._id,
                    answer: studentAnswer,
                    isCorrect:
                        Boolean(evaluation.isCorrect),
                    score,
                    feedback:
                        evaluation.feedback ||
                        "Answer evaluated.",
                    concept: question.concept
                });
            }

            // ==========================================
            // 3. Calculate total score
            // ==========================================

            if (evaluatedAnswers.length === 0) {
                return res.status(400).json({
                    message: "No questions were evaluated"
                });
            }

            const totalScore =
                evaluatedAnswers.reduce(
                    (total, answer) =>
                        total + answer.score,
                    0
                );

            const percentage =
                totalScore /
                evaluatedAnswers.length;

            // ==========================================
            // 4. Count correct answers
            // ==========================================

            const correctAnswers =
                evaluatedAnswers.filter(
                    answer => answer.isCorrect
                ).length;

            // ==========================================
            // 5. Save assessment
            // ==========================================

            const assessment =
                await Assessment.create({
                    quiz: quiz._id,
                    project: quiz.project,
                    user: req.userId,
                    answers: evaluatedAnswers,
                    totalScore,
                    percentage
                });

            // ==========================================
            // 6. Update concept mastery
            // ==========================================

            for (
                const answer
                of evaluatedAnswers
            ) {
                // Skip answers without a concept
                if (!answer.concept) {
                    continue;
                }

                const existing =
                    await Mastery.findOne({
                        project: quiz.project,
                        user: req.userId,
                        concept: answer.concept
                    });

                if (existing) {
                    existing.score =
                        existing.score * 0.6 +
                        answer.score * 0.4;

                    existing.attempts += 1;

                    if (answer.isCorrect) {
                        existing.correctAnswers += 1;
                    }

                    existing.lastScore =
                        answer.score;

                    if (existing.score < 50) {
                        existing.status =
                            "attention";
                    } else if (
                        existing.score < 75
                    ) {
                        existing.status =
                            "improving";
                    } else {
                        existing.status =
                            "stable";
                    }

                    await existing.save();
                } else {
                    await Mastery.create({
                        project: quiz.project,
                        user: req.userId,
                        concept: answer.concept,
                        score: answer.score,
                        status:
                            answer.score < 50
                                ? "attention"
                                : answer.score < 75
                                    ? "improving"
                                    : "stable",
                        attempts: 1,
                        correctAnswers:
                            answer.isCorrect
                                ? 1
                                : 0,
                        lastScore:
                            answer.score
                    });
                }
            }

            // ==========================================
            // 7. Mark quiz completed
            // ==========================================

            quiz.status = "completed";

            await quiz.save();

            // ==========================================
            // 8. Record activity
            // ==========================================

            await Activity.create({
                user: req.userId,
                project: quiz.project,
                type: "quiz_completed",
                metadata: {
                    quizId: quiz._id,
                    percentage,
                    correctAnswers,
                    totalQuestions:
                        evaluatedAnswers.length
                }
            });

            // ==========================================
            // 9. Return result
            // ==========================================

            return res.status(200).json({
                message:
                    "Assessment submitted successfully",

                assessment,

                summary: {
                    totalQuestions:
                        evaluatedAnswers.length,

                    correctAnswers,

                    percentage:
                        Number(
                            percentage.toFixed(2)
                        )
                }
            });
        } catch (error) {
            console.error(
                "Assessment error:",
                error.message
            );

            return res.status(500).json({
                message:
                    "Could not submit assessment",
                error: error.message
            });
        }
    }
);

module.exports = router;