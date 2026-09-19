const mongoose = require("mongoose");


const masterySchema = new mongoose.Schema(
    {
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        concept: {
            type: String,
            required: true,
            trim: true
        },

        score: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },

        status: {
            type: String,
            enum: [
                "attention",
                "improving",
                "stable"
            ],
            default: "attention"
        },

        attempts: {
            type: Number,
            default: 0
        },

        correctAnswers: {
            type: Number,
            default: 0
        },

        lastScore: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);


masterySchema.index(
    {
        project: 1,
        user: 1,
        concept: 1
    },
    {
        unique: true
    }
);


module.exports =
    mongoose.model(
        "Mastery",
        masterySchema
    );