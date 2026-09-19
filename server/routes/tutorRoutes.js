const express = require("express");

const authMiddleware =
    require("../middleware/authMiddleware");

const {
    retrieveRelevantChunks
} = require("../services/retrievalService");

const {
    generateAnswer
} = require("../services/groqService");

const Activity =
    require("../models/Activity");

const router = express.Router();


// AI TUTOR
router.post(
    "/:projectId",
    authMiddleware,
    async (req, res) => {

        try {

            const { projectId } =
                req.params;

            const { question } =
                req.body;


            // Validate question
            if (!question || !question.trim()) {

                return res.status(400).json({
                    message:
                        "Question is required"
                });

            }


            // Retrieve relevant learning material
            const results =
                await retrieveRelevantChunks(
                    projectId,
                    req.userId,
                    question,
                    5
                );


            // If no relevant material was found
            if (results.length === 0) {

                await Activity.create({

                    user:
                        req.userId,

                    project:
                        projectId,

                    type:
                        "tutor_interaction",

                    metadata: {

                        question,

                        sourceCount: 0

                    }

                });


                return res.status(200).json({

                    answer:
                        "I couldn't find enough information about this question in the uploaded learning material.",

                    sources: []

                });

            }


            // Build context for the AI
            const context =
                results
                    .map((item, index) => {

                        const chunk =
                            item.chunk;

                        return `
Source ${index + 1}
Material ID: ${chunk.material}
Page: ${chunk.pageNumber ?? "Unknown"}

${chunk.text}
`;

                    })
                    .join("\n\n");


            // Generate grounded answer
            const answer =
                await generateAnswer(
                    question,
                    context
                );


            // Record Tutor activity
            await Activity.create({

                user:
                    req.userId,

                project:
                    projectId,

                type:
                    "tutor_interaction",

                metadata: {

                    question,

                    sourceCount:
                        results.length

                }

            });


            // Send answer + sources
            return res.status(200).json({

                answer,

                sources:
                    results.map(item => ({

                        material:
                            item.chunk.material,

                        chunkIndex:
                            item.chunk.chunkIndex,

                        pageNumber:
                            item.chunk.pageNumber,

                        similarity:
                            Number(
                                item.score.toFixed(4)
                            )

                    }))

            });


        } catch (error) {

            console.error(
                "Tutor error:",
                error.message
            );

            return res.status(500).json({

                message:
                    "Something went wrong with the AI Tutor"

            });

        }

    }
);


module.exports = router;