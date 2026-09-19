const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Project = require("../models/Project");
const Space = require("../models/Space");

const router = express.Router();


// Create project
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { name, description, goal, spaceId } = req.body;

        if (!name || !spaceId) {
            return res.status(400).json({
                message: "Project name and space are required"
            });
        }

        const space = await Space.findOne({
            _id: spaceId,
            user: req.userId
        });

        if (!space) {
            return res.status(404).json({
                message: "Space not found"
            });
        }

        const project = await Project.create({
            name,
            description,
            goal,
            space: spaceId,
            user: req.userId
        });

        return res.status(201).json({
            message: "Project created successfully",
            project
        });

    } catch (error) {
        console.error(
            "Create project error:",
            error.message
        );

        return res.status(500).json({
            message: "Could not create project"
        });
    }
});


// Get projects for a specific space
router.get("/space/:spaceId", authMiddleware, async (req, res) => {
    try {
        const { spaceId } = req.params;

        const space = await Space.findOne({
            _id: spaceId,
            user: req.userId
        });

        if (!space) {
            return res.status(404).json({
                message: "Space not found"
            });
        }

        const projects = await Project.find({
            space: spaceId,
            user: req.userId
        }).sort({
            createdAt: -1
        });

        return res.status(200).json({
            projects
        });

    } catch (error) {
        console.error(
            "Get space projects error:",
            error.message
        );

        return res.status(500).json({
            message: "Could not fetch projects"
        });
    }
});


// Get all projects for logged-in user
router.get("/", authMiddleware, async (req, res) => {
    try {
        const projects = await Project.find({
            user: req.userId
        }).sort({
            createdAt: -1
        });

        return res.status(200).json({
            projects
        });

    } catch (error) {
        console.error(
            "Get projects error:",
            error.message
        );

        return res.status(500).json({
            message: "Could not fetch projects"
        });
    }
});


module.exports = router;