const express = require("express");
const Space = require("../models/Space");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// CREATE SPACE
router.post("/", authMiddleware, async (req, res) => {

    try {

        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Space name is required"
            });
        }

        const space = await Space.create({
            name,
            description,
            user: req.userId
        });

        return res.status(201).json({
            message: "Space created successfully",
            space
        });

    } catch (error) {

        console.error("Create space error:", error.message);

        return res.status(500).json({
            message: "Something went wrong while creating the space"
        });
    }

});
    // GET USER'S SPACES
router.get("/", authMiddleware, async (req, res) => {

    try {

        const spaces = await Space.find({
            user: req.userId
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            spaces
        });

    } catch (error) {

        console.error("Get spaces error:", error.message);

        return res.status(500).json({
            message: "Something went wrong while fetching spaces"
        });
    }

});


module.exports = router;