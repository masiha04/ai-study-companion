const express = require("express");

const authMiddleware =
    require("../middleware/authMiddleware");

const Project =
    require("../models/Project");

const Mastery =
    require("../models/Mastery");

const Recommendation =
    require("../models/Recommendation");

const {
    generateStructuredJSON
} = require("../services/groqService");

const router = express.Router();


// ==========================================
// GENERATE RECOMMENDATION
// ==========================================

router.post(
    "/generate/:projectId",
    authMiddleware,
    async (req, res) => {
        try {
            const { projectId } = req.params;

            // ==========================================
            // 1. Check project ownership
            // ==========================================

            const project =
                await Project.findOne({
                    _id: projectId,
                    user: req.userId
                });

            if (!project) {
                return res.status(404).json({
                    message:
                        "Project not found"
                });
            }

            // ==========================================
            // 2. Get mastery records
            // ==========================================

            const mastery =
                await Mastery.find({
                    project: projectId,
                    user: req.userId
                });

            if (mastery.length === 0) {
                return res.status(404).json({
                    message:
                        "No mastery data available"
                });
            }

            // ==========================================
            // 3. Find weakest concept
            // ==========================================

            const sortedMastery =
                [...mastery].sort(
                    (a, b) =>
                        a.score - b.score
                );

            const weakestConcept =
                sortedMastery[0];

            // ==========================================
            // 4. No weak concepts
            // ==========================================

            if (weakestConcept.score >= 75) {
                const recommendation =
                    await Recommendation.create({
                        user: req.userId,
                        project: projectId,
                        title:
                            "Continue practicing",
                        reason:
                            "Your current concept mastery is strong.",
                        action:
                            "Continue learning and attempt another quiz to maintain your progress.",
                        priority:
                            "low"
                    });

                return res.status(201).json({
                    message:
                        "Recommendation generated",
                    recommendation
                });
            }

            // ==========================================
            // 5. Prepare mastery context
            // ==========================================

            const masteryContext =
                sortedMastery.map(item => ({
                    concept:
                        item.concept,
                    score:
                        item.score,
                    status:
                        item.status,
                    attempts:
                        item.attempts
                }));

            // ==========================================
            // 6. Generate AI recommendation
            // ==========================================

            const prompt = `
You are an AI learning recommendation engine.

The student is learning:

Project:
${project.name}

Description:
${project.description || ""}

Goal:
${project.goal || ""}

The student's weakest concept is:

Concept:
${weakestConcept.concept}

Mastery score:
${weakestConcept.score}

Status:
${weakestConcept.status}

Attempts:
${weakestConcept.attempts}

Other mastery information:

${JSON.stringify(
    masteryContext,
    null,
    2
)}

Create ONE actionable learning recommendation.

IMPORTANT:
- The recommendation MUST focus on the weakest concept:
  ${weakestConcept.concept}
- Do not recommend a different concept as the main focus.
- Give a practical next learning action.
- Keep the recommendation concise and useful for a student.

Return ONLY valid JSON:

{
    "title": "...",
    "reason": "...",
    "action": "...",
    "priority": "low"
}

priority must be one of:

low
medium
high
`;

            const generated =
                await generateStructuredJSON(
                    prompt
                );

            // ==========================================
            // 7. Validate AI response
            // ==========================================

            if (
                !generated ||
                !generated.title ||
                !generated.reason ||
                !generated.action ||
                ![
                    "low",
                    "medium",
                    "high"
                ].includes(
                    generated.priority
                )
            ) {
                throw new Error(
                    "Invalid recommendation generated by AI"
                );
            }

            // ==========================================
            // 8. Save recommendation
            // ==========================================

            const recommendation =
                await Recommendation.create({
                    user: req.userId,
                    project: projectId,
                    title:
                        generated.title,
                    reason:
                        generated.reason,
                    action:
                        generated.action,
                    priority:
                        generated.priority
                });

            // ==========================================
            // 9. Return recommendation
            // ==========================================

            return res.status(201).json({
                message:
                    "Recommendation generated",
                recommendation
            });

        } catch (error) {
            console.error(
                "Recommendation error:",
                error.message
            );

            return res.status(500).json({
                message:
                    "Could not generate recommendation",
                error:
                    error.message
            });
        }
    }
);


// ==========================================
// GET RECOMMENDATIONS
// ==========================================

router.get(
    "/:projectId",
    authMiddleware,
    async (req, res) => {
        try {
            const recommendations =
                await Recommendation.find({
                    project:
                        req.params.projectId,
                    user:
                        req.userId
                }).sort({
                    createdAt: -1
                });

            return res.status(200).json({
                recommendations
            });

        } catch (error) {
            console.error(
                "Get recommendations error:",
                error.message
            );

            return res.status(500).json({
                message:
                    "Could not fetch recommendations"
            });
        }
    }
);


module.exports = router;