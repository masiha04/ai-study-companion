const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const Project = require("../models/Project");
const Activity = require("../models/Activity");
const Assessment = require("../models/Assessment");
const Mastery = require("../models/Mastery");

const router = express.Router();


// ==========================================
// PROJECT ANALYTICS
// ==========================================

router.get(
    "/project/:projectId",
    authMiddleware,
    async (req, res) => {
        try {
            const { projectId } = req.params;

            // Check project ownership
            const project = await Project.findOne({
                _id: projectId,
                user: req.userId
            });

            if (!project) {
                return res.status(404).json({
                    message: "Project not found"
                });
            }

            // Get project activity
            const activities = await Activity.find({
                project: projectId,
                user: req.userId
            }).sort({
                createdAt: -1
            });

            // Get assessments
            const assessments = await Assessment.find({
                project: projectId,
                user: req.userId
            }).sort({
                createdAt: -1
            });

            // Get mastery
            const mastery = await Mastery.find({
                project: projectId,
                user: req.userId
            }).sort({
                score: 1
            });

            // Calculate average mastery
            const averageMastery =
                mastery.length > 0
                    ? mastery.reduce(
                        (sum, item) => sum + item.score,
                        0
                    ) / mastery.length
                    : 0;

            // Calculate average quiz score
            const averageQuizScore =
                assessments.length > 0
                    ? assessments.reduce(
                        (sum, item) => sum + item.percentage,
                        0
                    ) / assessments.length
                    : 0;

            // Find attention areas
            const attentionAreas = mastery.filter(
                item => item.score < 50
            );

            // Find improving concepts
            const improvingConcepts = mastery.filter(
                item =>
                    item.score >= 50 &&
                    item.score < 75
            );

            return res.status(200).json({
                project: {
                    id: project._id,
                    name: project.name,
                    description: project.description,
                    goal: project.goal
                },

                summary: {
                    averageMastery,
                    averageQuizScore,
                    totalActivities: activities.length,
                    totalAssessments: assessments.length,
                    totalConcepts: mastery.length
                },

                attentionAreas,

                improvingConcepts,

                mastery,

                recentAssessments: assessments.slice(0, 10),

                recentActivities: activities.slice(0, 20)
            });

        } catch (error) {
            console.error(
                "Project analytics error:",
                error.message
            );

            return res.status(500).json({
                message: "Could not fetch project analytics"
            });
        }
    }
);


// ==========================================
// GLOBAL ANALYTICS
// ==========================================

router.get(
    "/global",
    authMiddleware,
    async (req, res) => {
        try {
            const activities = await Activity.find({
                user: req.userId
            });

            const assessments = await Assessment.find({
                user: req.userId
            });

            const mastery = await Mastery.find({
                user: req.userId
            });

            const averageMastery =
                mastery.length > 0
                    ? mastery.reduce(
                        (sum, item) => sum + item.score,
                        0
                    ) / mastery.length
                    : 0;

            const averageQuizScore =
                assessments.length > 0
                    ? assessments.reduce(
                        (sum, item) => sum + item.percentage,
                        0
                    ) / assessments.length
                    : 0;

            return res.status(200).json({
                summary: {
                    totalActivities: activities.length,
                    totalAssessments: assessments.length,
                    totalConcepts: mastery.length,
                    averageMastery,
                    averageQuizScore
                }
            });

        } catch (error) {
            console.error(
                "Global analytics error:",
                error.message
            );

            return res.status(500).json({
                message: "Could not fetch global analytics"
            });
        }
    }
);


module.exports = router;